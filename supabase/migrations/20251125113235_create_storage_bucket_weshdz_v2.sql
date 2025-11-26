/*
  # Create Storage Bucket for WeshDZ

  ## Bucket Configuration
  - Name: weshdz
  - Public: true (for reading)
  - Authenticated users can upload
  
  ## Folders Structure
  - classifieds/ (listing images)
  - documents/ (user documents)
  - avatars/ (user profile pictures)
  
  ## Security Policies
  - Public read access for all files
  - Authenticated users can upload to their own folders
  - Users can only delete their own files
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'weshdz',
  'weshdz',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for weshdz bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to weshdz" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files in weshdz" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files in weshdz" ON storage.objects;

-- Policy: Allow public read access
CREATE POLICY "Public read access for weshdz bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'weshdz');

-- Policy: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to weshdz"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'weshdz' AND
  (
    (storage.foldername(name))[1] = 'classifieds' OR
    (storage.foldername(name))[1] = 'documents' OR
    (storage.foldername(name))[1] = 'avatars'
  )
);

-- Policy: Users can update their own files
CREATE POLICY "Users can update own files in weshdz"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'weshdz' AND auth.uid()::text = (storage.foldername(name))[2])
WITH CHECK (bucket_id = 'weshdz' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files in weshdz"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'weshdz' AND auth.uid()::text = (storage.foldername(name))[2]);

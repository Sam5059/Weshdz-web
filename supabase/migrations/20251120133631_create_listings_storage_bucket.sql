/*
  # Create Storage Bucket for Listing Images

  1. Storage Setup
    - Create public bucket named 'listings' for storing listing images
    - Set appropriate policies for public read access
    - Allow authenticated users to upload their own images
    - Allow users to delete their own images

  2. Security
    - Public read access for all listing images
    - Authenticated users can upload images
    - Users can only delete their own images
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listings');

CREATE POLICY "Users can update their own listing images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own listing images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

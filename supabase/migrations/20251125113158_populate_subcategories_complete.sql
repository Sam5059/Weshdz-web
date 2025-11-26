/*
  # Populate subcategories table with all subcategories

  ## Purpose
  Insert all subcategories from the categories table (where parent_id is not null)
  into the new subcategories table for better organization
  
  ## Data Migration
  - Move all child categories to subcategories table
  - Maintain translations (fr, ar, en)
  - Preserve display order and slugs
*/

-- Insert subcategories from categories where parent_id is not null
INSERT INTO subcategories (id, category_id, name, name_fr, name_ar, name_en, slug, icon, description, display_order, created_at)
SELECT 
  id,
  parent_id as category_id,
  name,
  name_fr,
  name_ar,
  name_en,
  slug,
  icon,
  description,
  display_order,
  created_at
FROM categories
WHERE parent_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Add subcategory_id column to listings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE listings ADD COLUMN subcategory_id uuid REFERENCES subcategories(id);
    CREATE INDEX IF NOT EXISTS idx_listings_subcategory ON listings(subcategory_id);
  END IF;
END $$;

-- Migrate listings category references
-- If a listing references a subcategory (category with parent_id), move it to subcategory_id
UPDATE listings
SET subcategory_id = category_id,
    category_id = (SELECT parent_id FROM categories WHERE id = listings.category_id)
WHERE category_id IN (SELECT id FROM categories WHERE parent_id IS NOT NULL)
  AND subcategory_id IS NULL;

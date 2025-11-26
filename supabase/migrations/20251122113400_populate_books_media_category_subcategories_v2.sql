/*
  # Populate Books & Media Category with Subcategories

  ## Purpose
  Add proper translations to the "Livres & Multimédia" category and create all subcategories:
  - Livres (Books)
  - Magazines & Revues
  - BD & Mangas
  - DVD & Blu-ray
  - CD & Vinyles
  - Jeux vidéo (cartouches physiques)

  ## Changes
  1. Update main category with proper translations
  2. Create 6 subcategories with translations and proper ordering
*/

-- Update main category with proper translations
UPDATE categories 
SET 
  name = 'Livres & Multimédia',
  name_fr = 'Livres & Multimédia',
  name_ar = 'كتب ووسائط',
  name_en = 'Books & Media'
WHERE slug = 'livres-multimedia';

-- Create subcategories (using parent_id)
DO $$
DECLARE
  v_parent_id uuid;
BEGIN
  -- Get the parent category ID
  SELECT id INTO v_parent_id FROM categories WHERE slug = 'livres-multimedia';

  -- Livres (Books)
  INSERT INTO categories (parent_id, slug, name, name_fr, name_ar, name_en, display_order)
  VALUES (v_parent_id, 'livres-subcategory', 'Livres', 'Livres', 'كتب', 'Books', 1)
  ON CONFLICT (slug) DO UPDATE SET
    parent_id = v_parent_id,
    name = 'Livres',
    name_fr = 'Livres',
    name_ar = 'كتب',
    name_en = 'Books',
    display_order = 1;

  -- Magazines & Revues
  INSERT INTO categories (parent_id, slug, name, name_fr, name_ar, name_en, display_order)
  VALUES (v_parent_id, 'magazines-revues', 'Magazines & Revues', 'Magazines & Revues', 'مجلات', 'Magazines', 2)
  ON CONFLICT (slug) DO UPDATE SET
    parent_id = v_parent_id,
    name = 'Magazines & Revues',
    name_fr = 'Magazines & Revues',
    name_ar = 'مجلات',
    name_en = 'Magazines',
    display_order = 2;

  -- BD & Mangas
  INSERT INTO categories (parent_id, slug, name, name_fr, name_ar, name_en, display_order)
  VALUES (v_parent_id, 'bd-mangas', 'BD & Mangas', 'BD & Mangas', 'قصص مصورة ومانغا', 'Comics & Manga', 3)
  ON CONFLICT (slug) DO UPDATE SET
    parent_id = v_parent_id,
    name = 'BD & Mangas',
    name_fr = 'BD & Mangas',
    name_ar = 'قصص مصورة ومانغا',
    name_en = 'Comics & Manga',
    display_order = 3;

  -- DVD & Blu-ray
  INSERT INTO categories (parent_id, slug, name, name_fr, name_ar, name_en, display_order)
  VALUES (v_parent_id, 'dvd-bluray', 'DVD & Blu-ray', 'DVD & Blu-ray', 'دي في دي وبلوراي', 'DVD & Blu-ray', 4)
  ON CONFLICT (slug) DO UPDATE SET
    parent_id = v_parent_id,
    name = 'DVD & Blu-ray',
    name_fr = 'DVD & Blu-ray',
    name_ar = 'دي في دي وبلوراي',
    name_en = 'DVD & Blu-ray',
    display_order = 4;

  -- CD & Vinyles
  INSERT INTO categories (parent_id, slug, name, name_fr, name_ar, name_en, display_order)
  VALUES (v_parent_id, 'cd-vinyles', 'CD & Vinyles', 'CD & Vinyles', 'سي دي وفينيل', 'CD & Vinyl', 5)
  ON CONFLICT (slug) DO UPDATE SET
    parent_id = v_parent_id,
    name = 'CD & Vinyles',
    name_fr = 'CD & Vinyles',
    name_ar = 'سي دي وفينيل',
    name_en = 'CD & Vinyl',
    display_order = 5;

  -- Jeux vidéo physiques
  INSERT INTO categories (parent_id, slug, name, name_fr, name_ar, name_en, display_order)
  VALUES (v_parent_id, 'jeux-video-physiques', 'Jeux vidéo', 'Jeux vidéo (cartouches)', 'ألعاب فيديو (خراطيش)', 'Video Games (Physical)', 6)
  ON CONFLICT (slug) DO UPDATE SET
    parent_id = v_parent_id,
    name = 'Jeux vidéo',
    name_fr = 'Jeux vidéo (cartouches)',
    name_ar = 'ألعاب فيديو (خراطيش)',
    name_en = 'Video Games (Physical)',
    display_order = 6;

END $$;
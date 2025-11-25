/*
  # Add Books & Media Fields to Listings

  ## Purpose
  Add comprehensive fields for Books & Multimedia category with support for multiple subcategories:
  - Books (livres)
  - Magazines & Revues
  - BD & Mangas
  - DVD & Blu-ray
  - CD & Vinyles
  - Jeux vidéo (cartouches physiques)

  ## New Fields Added

  ### 1. Books (Livres) - 9 fields
    - `book_genre` (text) - Genre du livre (Roman, SF/Fantasy, Policier, etc.)
    - `book_language` (text) - Langue du livre (Français, Arabe, Anglais, Autre)
    - `book_author` (text) - Nom de l'auteur
    - `book_publisher` (text) - Maison d'édition
    - `book_isbn` (text) - ISBN du livre
    - `book_publication_year` (integer) - Année d'édition
    - `book_pages` (integer) - Nombre de pages
    - `book_format` (text) - Format (Broché/Poche, Relié, Grand format)

  ### 2. BD & Mangas - 4 fields
    - `comic_series_title` (text) - Titre de la série
    - `comic_issue_number` (integer) - Numéro du tome
    - `comic_language` (text) - Langue
    - `comic_publisher` (text) - Éditeur

  ### 3. DVD & Blu-ray - 4 fields
    - `media_type` (text) - Type (Film, Série TV, Documentaire, Autre)
    - `media_audio_languages` (text[]) - Langues audio disponibles
    - `media_subtitles` (text[]) - Sous-titres disponibles
    - `media_zone` (text) - Zone DVD/Blu-ray

  ### 4. CD & Vinyles - 4 fields
    - `music_format` (text) - Format (CD, Vinyle, Cassette)
    - `music_genre` (text) - Genre musical
    - `music_artist` (text) - Nom de l'artiste
    - `music_album` (text) - Nom de l'album

  ### 5. Exchange Options - 2 fields
    - `exchange_only` (boolean) - Échange uniquement (sans prix)
    - `exchange_for` (text) - Contre quoi échanger

  ## Notes
  - All fields are nullable (optional) by default
  - Fields are conditional based on subcategory selected
  - Arrays used for multi-select fields (audio languages, subtitles)
  - Exchange options available for all Books & Media items
*/

-- Add Books (Livres) fields
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS book_genre text,
ADD COLUMN IF NOT EXISTS book_language text,
ADD COLUMN IF NOT EXISTS book_author text,
ADD COLUMN IF NOT EXISTS book_publisher text,
ADD COLUMN IF NOT EXISTS book_isbn text,
ADD COLUMN IF NOT EXISTS book_publication_year integer,
ADD COLUMN IF NOT EXISTS book_pages integer,
ADD COLUMN IF NOT EXISTS book_format text;

-- Add BD & Mangas fields
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS comic_series_title text,
ADD COLUMN IF NOT EXISTS comic_issue_number integer,
ADD COLUMN IF NOT EXISTS comic_language text,
ADD COLUMN IF NOT EXISTS comic_publisher text;

-- Add DVD & Blu-ray fields
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS media_type text,
ADD COLUMN IF NOT EXISTS media_audio_languages text[],
ADD COLUMN IF NOT EXISTS media_subtitles text[],
ADD COLUMN IF NOT EXISTS media_zone text;

-- Add CD & Vinyles fields
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS music_format text,
ADD COLUMN IF NOT EXISTS music_genre text,
ADD COLUMN IF NOT EXISTS music_artist text,
ADD COLUMN IF NOT EXISTS music_album text;

-- Add Exchange options
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS exchange_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS exchange_for text;

-- Add comments for documentation
COMMENT ON COLUMN listings.book_genre IS 'Genre du livre: Roman, SF/Fantasy, Policier/Thriller, etc.';
COMMENT ON COLUMN listings.book_language IS 'Langue: Français, Arabe, Anglais, Autre';
COMMENT ON COLUMN listings.book_author IS 'Nom de l''auteur du livre';
COMMENT ON COLUMN listings.book_publisher IS 'Maison d''édition';
COMMENT ON COLUMN listings.book_isbn IS 'ISBN du livre';
COMMENT ON COLUMN listings.book_publication_year IS 'Année d''édition';
COMMENT ON COLUMN listings.book_pages IS 'Nombre de pages';
COMMENT ON COLUMN listings.book_format IS 'Format: Broché/Poche, Relié, Grand format';

COMMENT ON COLUMN listings.comic_series_title IS 'Titre de la série (BD/Manga)';
COMMENT ON COLUMN listings.comic_issue_number IS 'Numéro du tome';
COMMENT ON COLUMN listings.comic_language IS 'Langue de la BD/Manga';
COMMENT ON COLUMN listings.comic_publisher IS 'Éditeur de la BD/Manga';

COMMENT ON COLUMN listings.media_type IS 'Type: Film, Série TV, Documentaire, Autre';
COMMENT ON COLUMN listings.media_audio_languages IS 'Langues audio disponibles (array)';
COMMENT ON COLUMN listings.media_subtitles IS 'Sous-titres disponibles (array)';
COMMENT ON COLUMN listings.media_zone IS 'Zone DVD/Blu-ray: Zone 2, Multi-zone, etc.';

COMMENT ON COLUMN listings.music_format IS 'Format: CD, Vinyle, Cassette';
COMMENT ON COLUMN listings.music_genre IS 'Genre musical: Raï, Chaabi, Pop, Rock, etc.';
COMMENT ON COLUMN listings.music_artist IS 'Nom de l''artiste';
COMMENT ON COLUMN listings.music_album IS 'Nom de l''album';

COMMENT ON COLUMN listings.exchange_only IS 'True si échange uniquement (sans vente)';
COMMENT ON COLUMN listings.exchange_for IS 'Description de ce qui est recherché en échange';
/*
  # Create classifieds as an alias/view for listings

  ## Purpose
  Make 'classifieds' available as a more semantic name for listings
  This maintains backward compatibility while using the existing listings table
  
  ## Implementation
  Create a view that mirrors the listings table
*/

-- Create a view for classifieds that references listings
CREATE OR REPLACE VIEW classifieds AS
SELECT * FROM listings;

-- Grant permissions on the view
GRANT SELECT, INSERT, UPDATE, DELETE ON classifieds TO authenticated;
GRANT SELECT ON classifieds TO anon;

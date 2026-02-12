-- Add youtube_url column to problems table
ALTER TABLE problems 
ADD COLUMN youtube_url TEXT;

-- Optional: Add a check constraint to ensure it's a valid URL format if supported by your DB version, 
-- or just leave it as TEXT for simplicity.

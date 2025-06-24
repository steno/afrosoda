/*
  # Refresh schema cache for contact submissions

  This migration refreshes the schema cache by:
  1. Dropping and recreating the table with all current columns
  2. Preserving existing data
  3. Maintaining RLS policies
*/

-- Create a temporary table to store existing data
CREATE TABLE IF NOT EXISTS contact_submissions_temp AS 
SELECT * FROM contact_submissions;

-- Drop the existing table
DROP TABLE contact_submissions;

-- Recreate the table with all columns
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_type text NOT NULL,
  company text NOT NULL,
  street text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  marketing_consent boolean DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Copy data back from temporary table
INSERT INTO contact_submissions (
  id, business_type, company, street, postal_code, city,
  first_name, last_name, email, phone, message,
  marketing_consent, status, created_at, updated_at
)
SELECT 
  id, business_type, company, street, postal_code, city,
  first_name, last_name, email, phone, message,
  marketing_consent, status, created_at, updated_at
FROM contact_submissions_temp;

-- Drop temporary table
DROP TABLE contact_submissions_temp;

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can read own contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Anonymous users can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
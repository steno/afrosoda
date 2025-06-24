/*
  # Fix contact submissions table schema

  1. Changes
    - Recreate table with correct schema
    - Preserve existing data
    - Maintain RLS policies
*/

-- Temporarily disable RLS
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'business_type') THEN
        ALTER TABLE contact_submissions ADD COLUMN business_type text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'company') THEN
        ALTER TABLE contact_submissions ADD COLUMN company text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'street') THEN
        ALTER TABLE contact_submissions ADD COLUMN street text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'postal_code') THEN
        ALTER TABLE contact_submissions ADD COLUMN postal_code text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'city') THEN
        ALTER TABLE contact_submissions ADD COLUMN city text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'phone') THEN
        ALTER TABLE contact_submissions ADD COLUMN phone text;
    END IF;
END $$;

-- Update any NULL values with empty strings
UPDATE contact_submissions SET
    business_type = COALESCE(business_type, ''),
    company = COALESCE(company, ''),
    street = COALESCE(street, ''),
    postal_code = COALESCE(postal_code, ''),
    city = COALESCE(city, '');

-- Set NOT NULL constraints
ALTER TABLE contact_submissions
    ALTER COLUMN business_type SET NOT NULL,
    ALTER COLUMN company SET NOT NULL,
    ALTER COLUMN street SET NOT NULL,
    ALTER COLUMN postal_code SET NOT NULL,
    ALTER COLUMN city SET NOT NULL;

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Recreate policies (in case they were lost)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_submissions' 
        AND policyname = 'Users can read own contact submissions'
    ) THEN
        CREATE POLICY "Users can read own contact submissions"
            ON contact_submissions
            FOR SELECT
            TO authenticated
            USING (auth.jwt() ->> 'email' = email);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_submissions' 
        AND policyname = 'Anonymous users can submit contact forms'
    ) THEN
        CREATE POLICY "Anonymous users can submit contact forms"
            ON contact_submissions
            FOR INSERT
            TO anon
            WITH CHECK (true);
    END IF;
END $$;
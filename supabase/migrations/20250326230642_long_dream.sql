/*
  # Fix contact submissions schema constraints

  1. Changes
    - Temporarily remove NOT NULL constraints
    - Set default values for existing rows
    - Re-add NOT NULL constraints
    
  2. Security
    - No changes to RLS policies
*/

-- First, remove NOT NULL constraints
ALTER TABLE contact_submissions 
  ALTER COLUMN business_type DROP NOT NULL,
  ALTER COLUMN company DROP NOT NULL,
  ALTER COLUMN street DROP NOT NULL,
  ALTER COLUMN postal_code DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL;

-- Update any existing rows with default values
UPDATE contact_submissions
SET 
  business_type = COALESCE(business_type, ''),
  company = COALESCE(company, ''),
  street = COALESCE(street, ''),
  postal_code = COALESCE(postal_code, ''),
  city = COALESCE(city, '');

-- Re-add NOT NULL constraints
ALTER TABLE contact_submissions 
  ALTER COLUMN business_type SET NOT NULL,
  ALTER COLUMN company SET NOT NULL,
  ALTER COLUMN street SET NOT NULL,
  ALTER COLUMN postal_code SET NOT NULL,
  ALTER COLUMN city SET NOT NULL;
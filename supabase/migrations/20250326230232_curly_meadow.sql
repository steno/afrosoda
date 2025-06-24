/*
  # Add missing fields to contact_submissions table

  1. Changes
    Add the following columns to contact_submissions table:
    - `business_type` (text, not null)
    - `company` (text, not null)
    - `street` (text, not null)
    - `postal_code` (text, not null)
    - `city` (text, not null)
    - `phone` (text)

  2. Security
    - Existing RLS policies will apply to new columns
*/

-- Add new columns to contact_submissions table
ALTER TABLE contact_submissions 
  ADD COLUMN IF NOT EXISTS business_type text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS company text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS street text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS postal_code text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text;

-- Drop the subject column as it's not used in the form
ALTER TABLE contact_submissions DROP COLUMN IF EXISTS subject;
/*
  # Create data requests table for GDPR compliance

  1. New Tables
    - `data_requests`
      - `id` (uuid, primary key)
      - `first_name` (text, not null)
      - `last_name` (text, not null)
      - `email` (text, not null)
      - `request_type` (text, not null)
      - `message` (text, not null)
      - `status` (text, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `data_requests` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
*/

CREATE TABLE IF NOT EXISTS data_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  request_type text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read own data requests"
  ON data_requests
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Create policy for -- Create policy for users to insert their own data
CREATE POLICY "Users can insert own data requests"
  ON data_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create policy for anonymous users to insert data requests
CREATE POLICY "Anonymous users can submit data requests"
  ON data_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_data_requests_email ON data_requests(email);
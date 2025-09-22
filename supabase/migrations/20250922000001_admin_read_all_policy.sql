/*
  # Add admin read-all policy for contact submissions
  
  1. Changes
    - Add policy to allow authenticated users to read ALL contact submissions
    - This enables admin dashboard to view all submissions from all users
    - Keep existing policy for individual users to read their own submissions
  
  2. Security
    - Authenticated users can read all submissions (for admin dashboard)
    - Anonymous users can still only insert (submit forms)
    - Individual users can still read their own submissions
*/

-- Add policy for authenticated users to read ALL contact submissions (admin access)
CREATE POLICY "Authenticated users can read all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Note: This replaces the more restrictive policy that only allowed users to read their own submissions
-- The new policy allows any authenticated user to read all submissions, which is needed for admin functionality

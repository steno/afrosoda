/*
  # Secure admin-only policy for contact submissions
  
  1. Security Fix
    - Remove the overly permissive policy that allowed ANY authenticated user to read all submissions
    - Create a secure admin-only policy that restricts access to specific admin email addresses
    - Maintain existing policies for form submission and individual user access
  
  2. Admin Access
    - Only specific admin email addresses can read all submissions
    - Replace 'admin@afrosoda.com' with your actual admin email address(es)
    - You can add multiple admin emails by extending the condition
*/

-- First, drop the overly permissive policy we just created
DROP POLICY IF EXISTS "Authenticated users can read all contact submissions" ON contact_submissions;

-- Create a secure admin-only policy
-- Only stefan.asemota@gmail.com can access all contact submissions
CREATE POLICY "Admin users can read all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'stefan.asemota@gmail.com'
  );

-- Alternative: If you have a user_roles table, you could use:
-- USING (
--   EXISTS (
--     SELECT 1 FROM user_roles 
--     WHERE user_id = auth.uid() 
--     AND role = 'admin'
--   )
-- );

-- Keep the original policy for users to read their own submissions
-- This should already exist from previous migrations

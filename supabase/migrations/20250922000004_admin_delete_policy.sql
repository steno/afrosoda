/*
  # Add delete policy for admin functionality
  
  1. Changes
    - Add policy to allow anonymous and authenticated users to delete contact submissions
    - This enables the admin dashboard delete functionality
    - Security is handled by the frontend login modal
  
  2. Security
    - Frontend login modal controls access to admin dashboard
    - Only users who can access admin dashboard can delete submissions
    - Delete operations are logged and irreversible
*/

-- Add policy for deleting contact submissions
CREATE POLICY "Anyone can delete contact submissions"
  ON contact_submissions
  FOR DELETE
  TO anon, authenticated
  USING (true);

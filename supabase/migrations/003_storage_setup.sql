-- ============================================
-- STORAGE SETUP
-- ============================================

-- Create proofs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for proofs bucket

-- Users can upload their own proofs
CREATE POLICY "Users can upload own proofs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own proofs
CREATE POLICY "Users can read own proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Creators can read proofs from their community
CREATE POLICY "Creators can read community proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proofs' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT p.id FROM profiles p
      WHERE p.creator_id IN (
        SELECT id FROM creators WHERE owner_profile_id = auth.uid()
      )
    )
  );

-- Admins can read all proofs
CREATE POLICY "Admins can read all proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proofs' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

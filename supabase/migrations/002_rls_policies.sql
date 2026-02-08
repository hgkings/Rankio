-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Creators can read profiles of their community members
CREATE POLICY "Creators can read their community profiles"
  ON profiles FOR SELECT
  USING (
    creator_id IN (
      SELECT id FROM creators WHERE owner_profile_id = auth.uid()
    )
  );

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- CREATORS POLICIES
-- ============================================

-- Anyone can read active creators
CREATE POLICY "Anyone can read active creators"
  ON creators FOR SELECT
  USING (is_active = true);

-- Creators can read their own creator record
CREATE POLICY "Creators can read own record"
  ON creators FOR SELECT
  USING (owner_profile_id = auth.uid());

-- Users can create creator record
CREATE POLICY "Users can create creator record"
  ON creators FOR INSERT
  WITH CHECK (owner_profile_id = auth.uid());

-- Creators can update their own record
CREATE POLICY "Creators can update own record"
  ON creators FOR UPDATE
  USING (owner_profile_id = auth.uid());

-- Admins can manage all creators
CREATE POLICY "Admins can manage creators"
  ON creators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- MISSIONS POLICIES
-- ============================================

-- Anyone can read active missions
CREATE POLICY "Anyone can read active missions"
  ON missions FOR SELECT
  USING (is_active = true);

-- Creators can read their own missions
CREATE POLICY "Creators can read own missions"
  ON missions FOR SELECT
  USING (
    creator_id IN (
      SELECT id FROM creators WHERE owner_profile_id = auth.uid()
    )
  );

-- Creators can create missions
CREATE POLICY "Creators can create missions"
  ON missions FOR INSERT
  WITH CHECK (
    creator_id IN (
      SELECT id FROM creators WHERE owner_profile_id = auth.uid()
    )
  );

-- Creators can update their own missions
CREATE POLICY "Creators can update own missions"
  ON missions FOR UPDATE
  USING (
    creator_id IN (
      SELECT id FROM creators WHERE owner_profile_id = auth.uid()
    )
  );

-- Admins can manage all missions
CREATE POLICY "Admins can manage missions"
  ON missions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- MISSION ATTEMPTS POLICIES
-- ============================================

-- Users can read their own attempts
CREATE POLICY "Users can read own attempts"
  ON mission_attempts FOR SELECT
  USING (user_profile_id = auth.uid());

-- Users can create attempts
CREATE POLICY "Users can create attempts"
  ON mission_attempts FOR INSERT
  WITH CHECK (user_profile_id = auth.uid());

-- Creators can read attempts for their missions
CREATE POLICY "Creators can read mission attempts"
  ON mission_attempts FOR SELECT
  USING (
    mission_id IN (
      SELECT m.id FROM missions m
      JOIN creators c ON m.creator_id = c.id
      WHERE c.owner_profile_id = auth.uid()
    )
  );

-- Creators can update attempts for their missions
CREATE POLICY "Creators can update mission attempts"
  ON mission_attempts FOR UPDATE
  USING (
    mission_id IN (
      SELECT m.id FROM missions m
      JOIN creators c ON m.creator_id = c.id
      WHERE c.owner_profile_id = auth.uid()
    )
  );

-- Admins can manage all attempts
CREATE POLICY "Admins can manage attempts"
  ON mission_attempts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PROOFS POLICIES
-- ============================================

-- Users can read their own proofs
CREATE POLICY "Users can read own proofs"
  ON proofs FOR SELECT
  USING (user_profile_id = auth.uid());

-- Users can create proofs
CREATE POLICY "Users can create proofs"
  ON proofs FOR INSERT
  WITH CHECK (user_profile_id = auth.uid());

-- Creators can read proofs for their missions
CREATE POLICY "Creators can read mission proofs"
  ON proofs FOR SELECT
  USING (
    attempt_id IN (
      SELECT ma.id FROM mission_attempts ma
      JOIN missions m ON ma.mission_id = m.id
      JOIN creators c ON m.creator_id = c.id
      WHERE c.owner_profile_id = auth.uid()
    )
  );

-- Creators can update proofs for their missions
CREATE POLICY "Creators can update mission proofs"
  ON proofs FOR UPDATE
  USING (
    attempt_id IN (
      SELECT ma.id FROM mission_attempts ma
      JOIN missions m ON ma.mission_id = m.id
      JOIN creators c ON m.creator_id = c.id
      WHERE c.owner_profile_id = auth.uid()
    )
  );

-- Admins can manage all proofs
CREATE POLICY "Admins can manage proofs"
  ON proofs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- WALLETS POLICIES
-- ============================================

-- Users can read their own wallet
CREATE POLICY "Users can read own wallet"
  ON wallets FOR SELECT
  USING (profile_id = auth.uid());

-- Admins can read all wallets
CREATE POLICY "Admins can read all wallets"
  ON wallets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can update wallets (via service role)
-- No user-facing update policy - wallets updated via functions only

-- ============================================
-- LEDGER ENTRIES POLICIES
-- ============================================

-- Users can read their own ledger entries
CREATE POLICY "Users can read own ledger"
  ON ledger_entries FOR SELECT
  USING (profile_id = auth.uid());

-- Admins can read all ledger entries
CREATE POLICY "Admins can read all ledger"
  ON ledger_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can create ledger entries (via service role)
-- No user-facing insert policy - ledger created via functions only

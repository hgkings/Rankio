-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('fan', 'creator', 'admin')) DEFAULT 'fan',
  display_name TEXT,
  avatar_url TEXT,
  creator_id UUID,
  verification_code TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  profile_url TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to profiles after creators table is created
ALTER TABLE profiles
  ADD CONSTRAINT fk_creator
  FOREIGN KEY (creator_id) REFERENCES creators(id);

-- Missions table
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) NOT NULL,
  type TEXT CHECK (type IN ('comment', 'quiz', 'raid', 'screenshot')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points_base INTEGER DEFAULT 10,
  points_bonus INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission attempts table
CREATE TABLE mission_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id) NOT NULL,
  user_profile_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  reviewer_profile_id UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}',
  UNIQUE(mission_id, user_profile_id)
);

-- Proofs table
CREATE TABLE proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES mission_attempts(id) NOT NULL,
  user_profile_id UUID REFERENCES profiles(id) NOT NULL,
  file_path TEXT,
  type TEXT CHECK (type IN ('screenshot', 'text')) DEFAULT 'screenshot',
  ai_status TEXT,
  review_status TEXT CHECK (review_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets table
CREATE TABLE wallets (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  coins_balance INTEGER DEFAULT 0,
  points_balance INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ledger entries table
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  kind TEXT CHECK (kind IN ('points', 'coins')) NOT NULL,
  direction TEXT CHECK (direction IN ('credit', 'debit')) NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT,
  ref_type TEXT,
  ref_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_creator_id ON profiles(creator_id);
CREATE INDEX idx_profiles_verification_code ON profiles(verification_code);
CREATE INDEX idx_missions_creator_id ON missions(creator_id);
CREATE INDEX idx_missions_is_active ON missions(is_active);
CREATE INDEX idx_mission_attempts_mission_id ON mission_attempts(mission_id);
CREATE INDEX idx_mission_attempts_user_profile_id ON mission_attempts(user_profile_id);
CREATE INDEX idx_mission_attempts_status ON mission_attempts(status);
CREATE INDEX idx_proofs_attempt_id ON proofs(attempt_id);
CREATE INDEX idx_proofs_review_status ON proofs(review_status);
CREATE INDEX idx_ledger_entries_profile_id ON ledger_entries(profile_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for wallets
CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile and wallet on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO wallets (profile_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  code := 'RANK' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  RETURN code;
END;
$$ LANGUAGE plpgsql;

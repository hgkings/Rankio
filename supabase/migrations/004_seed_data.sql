-- ============================================
-- SEED DATA (Demo/Development)
-- ============================================

-- Note: Replace the UUIDs with actual user IDs from your auth.users table
-- This is example data for development/testing

-- Create a demo creator profile (you'll need to signup first, then update this)
-- UPDATE profiles SET role = 'creator' WHERE id = 'YOUR_USER_ID';

-- Example: Insert demo creator
-- INSERT INTO creators (id, owner_profile_id, name, platform, profile_url, avatar_url)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   'YOUR_USER_ID',
--   'Demo Creator',
--   'tiktok',
--   'https://tiktok.com/@democreator',
--   null
-- );

-- Example: Insert demo missions
-- INSERT INTO missions (creator_id, type, title, description, points_base, points_bonus, is_active)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'comment', 'Videoma Yorum Yap', 'En son videoma yorum yap ve ekran görüntüsü al', 10, 5, true),
--   ('00000000-0000-0000-0000-000000000001', 'screenshot', 'Takip Ekran Görüntüsü', 'Beni takip ettiğini kanıtla', 20, 0, true),
--   ('00000000-0000-0000-0000-000000000001', 'quiz', 'Trivia Sorusu', 'Doğru cevabı bul', 15, 10, true);

-- TODO: After setting up your Supabase project:
-- 1. Create a user account via signup
-- 2. Get the user ID from auth.users
-- 3. Update the profile role to 'creator'
-- 4. Insert creator record with that user ID
-- 5. Insert demo missions
-- 6. Test the flow!

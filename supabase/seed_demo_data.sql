-- Demo Creator Account
-- Email: demo_creator@rankio.test
-- Password: Demo12345!

-- Create demo creator profile (assumes auth user already exists)
INSERT INTO public.profiles (id, role, display_name, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,  -- Replace with actual auth.users id after manual creation
    'creator',
    'Demo Creator',
    true
) ON CONFLICT (id) DO NOTHING;

-- Create creator record
INSERT INTO public.creators (id, owner_profile_id, name, platform, profile_url, is_active)
VALUES (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Demo Creator',
    'tiktok',
    'https://tiktok.com/@democreator',
    true
) ON CONFLICT (id) DO NOTHING;

-- Link creator to profile
UPDATE public.profiles
SET creator_id = '10000000-0000-0000-0000-000000000001'::uuid
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Demo Fan Account
-- Email: demo_fan@rankio.test
-- Password: Demo12345!

-- Create demo fan profile (assumes auth user already exists)
INSERT INTO public.profiles (id, role, display_name, creator_id, is_verified)
VALUES (
    '00000000-0000-0000-0000-000000000002'::uuid,  -- Replace with actual auth.users id after manual creation
    'fan',
    'Demo Fan',
    '10000000-0000-0000-0000-000000000001'::uuid,  -- Link to demo creator
    true
) ON CONFLICT (id) DO NOTHING;

-- Create wallet for demo fan with starting balance
INSERT INTO public.wallets (profile_id, points_balance, coins_balance)
VALUES (
    '00000000-0000-0000-0000-000000000002'::uuid,
    150,  -- Starting points
    20    -- Starting coins
) ON CONFLICT (profile_id) DO UPDATE
SET points_balance = 150, coins_balance = 20;

-- Demo Missions

-- Mission 1: Screenshot Mission
INSERT INTO public.missions (id, creator_id, type, title, description, points_base, points_bonus, starts_at, ends_at, is_active)
VALUES (
    '20000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'screenshot',
    'TikTok Videoma Ekran Görüntüsü Yükle',
    'En son TikTok videomun ekran görüntüsünü çek ve yükle. Videonun tamamının görünmesi gerekiyor!',
    25,
    10,
    NOW(),
    NOW() + INTERVAL '30 days',
    true
) ON CONFLICT (id) DO NOTHING;

-- Mission 2: Comment Mission
INSERT INTO public.missions (id, creator_id, type, title, description, points_base, points_bonus, starts_at, ends_at, is_active)
VALUES (
    '20000000-0000-0000-0000-000000000002'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'comment',
    'Instagram Postuma Yorum Yap',
    'Son Instagram postuma yaratıcı bir yorum yap. En az 10 kelime olmalı ve emoji kullan!',
    15,
    5,
    NOW(),
    NOW() + INTERVAL '14 days',
    true
) ON CONFLICT (id) DO NOTHING;

-- Mission 3: Quiz Mission
INSERT INTO public.missions (id, creator_id, type, title, description, points_base, points_bonus, starts_at, ends_at, is_active)
VALUES (
    '20000000-0000-0000-0000-000000000003'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'quiz',
    'Beni Ne Kadar Tanıyorsun?',
    'Kanalım hakkında 5 soruluk quizi tamamla ve puanını kazan!',
    30,
    15,
    NOW(),
    NOW() + INTERVAL '60 days',
    true
) ON CONFLICT (id) DO NOTHING;

-- Mission 4: Raid Mission
INSERT INTO public.missions (id, creator_id, type, title, description, points_base, points_bonus, starts_at, ends_at, is_active)
VALUES (
    '20000000-0000-0000-0000-000000000004'::uuid,
    '10000000-0000-0000-0000-000000000001'::uuid,
    'raid',
    'Canlı Yayına Katıl',
    'Bugün saat 20:00\'de yapacağım canlı yayına katıl ve en az 5 dakika izle!',
    50,
    25,
    NOW(),
    NOW() + INTERVAL '7 days',
    true
) ON CONFLICT (id) DO NOTHING;

-- Add some initial ledger entries for demo fan
INSERT INTO public.ledger_entries (profile_id, kind, direction, amount, reason, ref_type)
VALUES
    ('00000000-0000-0000-0000-000000000002'::uuid, 'points', 'credit', 100, 'Welcome bonus', 'system'),
    ('00000000-0000-0000-0000-000000000002'::uuid, 'points', 'credit', 50, 'First mission completed', 'mission_attempt'),
    ('00000000-0000-0000-0000-000000000002'::uuid, 'coins', 'credit', 20, 'Welcome bonus', 'system');

/*
MANUAL SETUP REQUIRED:

1. Create auth users in Supabase Dashboard:
   - Go to Authentication > Users
   - Click "Add User"
   
   User 1 (Creator):
   - Email: demo_creator@rankio.test
   - Password: Demo12345!
   - Auto Confirm User: YES
   - Copy the generated UUID
   
   User 2 (Fan):
   - Email: demo_fan@rankio.test
   - Password: Demo12345!
   - Auto Confirm User: YES
   - Copy the generated UUID

2. Update this SQL script:
   - Replace '00000000-0000-0000-0000-000000000001' with Creator's UUID
   - Replace '00000000-0000-0000-0000-000000000002' with Fan's UUID

3. Run this updated SQL script in Supabase SQL Editor

4. Test login with both accounts:
   - Creator should redirect to /studio/dashboard
   - Fan should redirect to /app/dashboard
*/

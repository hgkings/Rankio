-- Demo Creator and Missions Seed
-- Note: Replace USER_ID with a valid auth.uid() if running manually for a specific user.
-- This script provides the SQL structure for demo data.

DO $$
DECLARE
    demo_creator_id UUID;
BEGIN
    -- 1. Ensure we have a profile to act as a creator
    -- Check if 'Demo Creator' profile exists (assuming we know a user)
    -- For now, we look for any user without a creator role and upgrade them if needed
    -- Better way: Create a separate creator record and link it.

    -- Insert Demo Creator
    INSERT INTO public.creators (name, platform, profile_url, bio)
    VALUES ('Demo Creator', 'tiktok', 'https://tiktok.com/@democreator', 'Oyun ve teknoloji üzerine içerikler üretiyorum.')
    RETURNING id INTO demo_creator_id;

    -- 2. Insert Demo Missions
    -- Comment Mission
    INSERT INTO public.missions (creator_id, title, description, type, points_base, metadata)
    VALUES (
        demo_creator_id, 
        'Son Videoya Yorum Yap', 
        'TikTok''taki son videoma anlamlı bir yorum yap ve ekran görüntüsü at.', 
        'comment', 
        50, 
        '{"url": "https://tiktok.com/@democreator/video/123"}'
    );

    -- Quiz Mission
    INSERT INTO public.missions (creator_id, title, description, type, points_base, metadata)
    VALUES (
        demo_creator_id, 
        'Kanlı Canlı Bilgi Yarışması', 
        'Creator hakkında hazırladığımız 3 soruluk testi çöz.', 
        'quiz', 
        75, 
        '{"questions": [{"q": "Hangi şehirde yaşıyor?", "a": "İstanbul"}]}'
    );

    -- Screenshot Mission
    INSERT INTO public.missions (creator_id, title, description, type, points_base)
    VALUES (
        demo_creator_id, 
        'Abone Olduğunu Kanıtla', 
        'Youtube kanalıma abone olduğunu gösteren bir ekran görüntüsü yükle.', 
        'screenshot', 
        100
    );

END $$;

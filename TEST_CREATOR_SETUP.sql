-- SQL to correctly setup the test creator account
-- This script fixes the "column email does not exist" error by looking up the ID from auth.users

DO $$ 
DECLARE
    target_user_id UUID;
BEGIN
    -- 1. Find the User ID from the auth schema
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'demo_creator@rankio.test';

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'Kullanıcı bulunamadı. Lütfen önce demo_creator@rankio.test adresiyle kayıt olun.';
    ELSE
        -- 2. Update the profile role
        UPDATE public.profiles 
        SET role = 'creator' 
        WHERE id = target_user_id;

        -- 3. Insert or Update Creators table
        INSERT INTO public.creators (owner_profile_id, name, platform, profile_url, is_active)
        VALUES (target_user_id, 'Demo Creator Channel', 'tiktok', 'https://tiktok.com/@democreator', true)
        ON CONFLICT (owner_profile_id) DO UPDATE 
        SET name = EXCLUDED.name, platform = EXCLUDED.platform, profile_url = EXCLUDED.profile_url;

        -- 4. Linking back creator_id to profile
        UPDATE public.profiles 
        SET creator_id = (SELECT id FROM public.creators WHERE owner_profile_id = target_user_id)
        WHERE id = target_user_id;

        RAISE NOTICE 'Demo Creator hesabı başarıyla bağlandı! 🚀';
    END IF;
END $$;

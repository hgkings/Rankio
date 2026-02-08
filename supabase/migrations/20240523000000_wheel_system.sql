-- Daily Wheel Spins Table
CREATE TABLE IF NOT EXISTS public.wheel_spins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('points', 'coins')),
    reward_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for checking daily limit
CREATE INDEX IF NOT EXISTS idx_wheel_spins_user_date ON public.wheel_spins (user_id, (created_at::date));

-- Enable RLS
ALTER TABLE public.wheel_spins ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own spins" ON public.wheel_spins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spins" ON public.wheel_spins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Simple function to check if user can spin today
CREATE OR REPLACE FUNCTION can_spin_today(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    last_spin TIMESTAMP;
BEGIN
    SELECT created_at INTO last_spin
    FROM public.wheel_spins
    WHERE user_id = check_user_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF last_spin IS NULL THEN
        RETURN TRUE;
    END IF;

    -- Return TRUE if last spin was more than 24 hours ago
    RETURN last_spin < (now() - INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

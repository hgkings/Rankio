-- Add Role to Profiles if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'fan' CHECK (role IN ('fan', 'creator', 'admin'));
    END IF;
END $$;

-- Table for tracking manual/demo upgrades
CREATE TABLE IF NOT EXISTS public.system_configs (
    key TEXT PRIMARY KEY,
    value JSONB
);

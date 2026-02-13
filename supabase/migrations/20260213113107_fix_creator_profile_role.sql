/*
  # Fix Creator Profile Role Issue

  Updates the user creation trigger to properly extract and store the role from user metadata when profiles are created.
  
  Previously, when creators signed up, their role was set in auth metadata but not reflected in the profiles table, 
  causing login redirection issues. This migration ensures the role is correctly transferred from auth metadata to the profiles table.
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'fan')
  );
  
  INSERT INTO wallets (profile_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/*
 * SQL function to duplicate information from the auth.user metadata column to public.users
 * Designed to be triggered by trigger_sync_auth_to_public for create and update operations
 */ 
CREATE OR REPLACE FUNCTION public.sync_auth_to_public() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    user_uuid,
    email,
    preferred_name,
    country_id,
    locale
  )
  VALUES (
    new.id,
    new.email,
    (new.raw_user_meta_data ->> 'preferred_name')::text,
    (new.raw_user_meta_data ->> 'country_id')::bigint,
    (new.raw_user_meta_data ->> 'locale')::text
  )
  ON CONFLICT (user_uuid)
  DO UPDATE SET
    email = new.email,
    preferred_name = (new.raw_user_meta_data ->> 'preferred_name')::text,
    country_id = (new.raw_user_meta_data ->> 'country_id')::bigint,
    locale = (new.raw_user_meta_data ->> 'locale')::text;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
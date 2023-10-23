/*
 * SQL function to duplicate information from the auth.user metadata column to public.users
 * Designed to be triggered by trigger_sync_auth_to_public for create and update operations
 */ 
CREATE OR REPLACE FUNCTION public.sync_auth_to_public() 
RETURNS TRIGGER AS $$
DECLARE
  iso_code text;
BEGIN
  SELECT countries.iso_code
  INTO iso_code
  FROM public.countries
  WHERE countries.country_id = (new.raw_user_meta_data ->> 'country_id')::bigint;

  INSERT INTO public.users (
    user_uuid,
    email,
    preferred_name,
    country_id,
    locale,
    preferences_units,
    preferences_region
  )
  VALUES (
    new.id,
    new.email,
    (new.raw_user_meta_data ->> 'preferred_name')::text,
    (new.raw_user_meta_data ->> 'country_id')::bigint,
    (new.raw_user_meta_data ->> 'locale')::text,
    jsonb_build_object('speed', 'ms', 'temperature', 'c'),
    jsonb_build_object('locale_formatting', 'en-' || iso_code)
  )
  ON CONFLICT (user_uuid)
  DO UPDATE SET
    email = new.email,
    preferred_name = (new.raw_user_meta_data ->> 'preferred_name')::text,
    country_id = (new.raw_user_meta_data ->> 'country_id')::bigint,
    locale = (new.raw_user_meta_data ->> 'locale')::text,
    preferences_units = COALESCE(
      public.users.preferences_units,
      jsonb_build_object(
        'speed', 'ms',
        'temperature', 'c'
      )
    ),
    preferences_region = COALESCE(
      public.users.preferences_region,
      jsonb_build_object('locale_formatting', 'en-' || iso_code)
    );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
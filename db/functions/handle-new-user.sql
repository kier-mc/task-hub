/*
 * SQL trigger to copy information in the signup process to the public.users table
 * Currently duplicating: UUID, email address and preferred name
 */ 
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (
    user_uuid,
    email,
    preferred_name
    )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name'
    );
  return new;
end;
$$ language plpgsql security definer;

/*
 * Trigger creation
 * Only required once
 */
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
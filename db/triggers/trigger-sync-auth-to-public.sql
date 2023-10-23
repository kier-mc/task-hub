/*
 * SQL trigger for sync_auth_to_public() function
 */
CREATE OR REPLACE TRIGGER trigger_sync_auth_to_public
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_auth_to_public();
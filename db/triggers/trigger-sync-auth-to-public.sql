/*
 * SQL trigger for sync_auth_to_public() function
 */
CREATE TRIGGER trigger_sync_auth_to_public
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_auth_to_public();
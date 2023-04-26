/* Type definitions */
import { User } from "@supabase/gotrue-js";
/*
 * IMPORTANT
 * Passwords need hashing here before submission
 * Native argon2 needs C++ compilation tools
 * Not necessarily straightforward on Windows
 */

/*
 * async loginUser(ref, credentials)
 * Attempts login via SupabaseAuthClient
 * @param credentials: object containing data to pass
 */
export async function loginUser(
  credentials: Ref<LoginCredentialsDataObject>
): Promise<void> {
  const notificationsStore = useNotificationsStore();
  const { data, error } = await useSupabaseAuthClient().auth.signInWithPassword(
    {
      email: credentials.value.email,
      password: credentials.value.password,
    }
  );
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage(
    `Logged in as ${(data.user as User).user_metadata.name}`,
    "success"
  );
}
/*
 * async createUser(ref, credentials)
 * Attempts account creation via SupabaseAuthClient
 * @param credentials: object containing data to pass
 */
export async function createUser(credentials: Ref<NewAccountDataObject>) {
  const notificationsStore = useNotificationsStore();
  const { data, error } = await useSupabaseAuthClient().auth.signUp({
    email: credentials.value.email,
    password: credentials.value.password,
    options: {
      data: {
        name: credentials.value.name,
      },
    },
  });
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  // Supabase doesn't notify if the email address is already registered
  // https://github.com/supabase/supabase-js/issues/296#issuecomment-1372552875
  if (data.user?.identities?.length === 0) {
    notificationsStore.setMessage(
      "Email address is already registered",
      "error"
    );
    return;
  }
  notificationsStore.setMessage("Account created successfully", "success");
}

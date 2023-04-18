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
 * @param ref: carrier element for messages to notify user
 * @param credentials: object containing data to pass
 */
export async function loginUser(
  ref: Ref<HTMLElement>,
  credentials: Ref<LoginCredentialsDataObject>
): Promise<void> {
  const { data, error } = await useSupabaseAuthClient().auth.signInWithPassword(
    {
      email: credentials.value.email,
      password: credentials.value.password,
    }
  );
  if (error) {
    ref.value.textContent = error.message;
    return;
  }
  ref.value.textContent = `Logged in as ${
    (data.user as User).user_metadata.name
  }`;
}
/*
 * async createUser(ref, credentials)
 * Attempts account creation via SupabaseAuthClient
 * @param ref: carrier element for messages to notify user
 * @param credentials: object containing data to pass
 */
export async function createUser(
  ref: Ref<HTMLElement>,
  credentials: Ref<NewAccountDataObject>
) {
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
    ref.value.textContent = error.message;
    return;
  }
  // Supabase doesn't notify if the email address is already registered
  // https://github.com/supabase/supabase-js/issues/296#issuecomment-1372552875
  if (data.user?.identities?.length === 0) {
    ref.value.textContent = "This email is already registered";
    return;
  }
  ref.value.textContent = "Account created successfully";
}

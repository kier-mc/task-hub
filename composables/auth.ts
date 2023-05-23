/*
 * AUTH.TS
 * Contains functions related to user auth i.e login, logout, create account etc.
 * Hashing not required: https://github.com/orgs/supabase/discussions/437
 * notificationsStore will fail if declared globally as it will init prior to Pinia
 * Declared at start of each function instead, which can only be called after init
 */

/**
 * Helper function to wipe credentials object once login/account creation submissions occur.
 * @param credentials {Ref<LoginCredentialsDataObject>} object containing data to erase; inherited from parent function
 */
function clearCredentials(credentials: Ref<LoginCredentialsDataObject>): void {
  credentials.value.email = "";
  credentials.value.password = "";
}
/**
 * Attempts login via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and redirects to hub page.
 * @param credentials {Ref<LoginCredentialsDataObject>} object containing data (username, password) to pass to backend
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
  if (data.user) {
    notificationsStore.setMessage(
      `Logged in as ${
        data.user.user_metadata.name
          ? data.user.user_metadata.name
          : data.user.email
      }`,
      "success"
    );
    clearCredentials(credentials);
    navigateTo("/hub");
  }
}
/**
 * Attempts account creation via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and redirects to login page.
 * @param credentials {Ref<LoginCredentialsDataObject>} object containing data (username, password) to pass to backend
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
  clearCredentials(credentials);
  navigateTo("/login");
}
/**
 * Attemps logout via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and redirects to root page.
 */
export async function logoutUser(): Promise<void> {
  const notificationsStore = useNotificationsStore();
  const request = await useSupabaseAuthClient().auth.getUser();
  if (!request.data.user) {
    notificationsStore.setMessage("No user currently logged in", "error");
    return;
  }
  const { error } = await useSupabaseAuthClient().auth.signOut();
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  notificationsStore.setMessage("Logged out successfully", "success");
  navigateTo("/");
}

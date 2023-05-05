/*
 * AUTH.TS
 * Contains functions related to user auth i.e login, logout, create account etc.
 * Hashing not required: https://github.com/orgs/supabase/discussions/437
 * notificationsStore will fail if declared globally as it will init prior to Pinia
 * Declared at start of each function instead, which can only be called after init
 */

/*
 * function clearCredentials(credentials)
 * Helper function to wipe credentials object once login/creation submissions occur
 * @param credentials: object containing data to erase; inherited from parent function
 */
function clearCredentials(credentials: Ref<LoginCredentialsDataObject>) {
  credentials.value.email = "";
  credentials.value.password = "";
}
/*
 * async loginUser(ref, credentials)
 * Attempts login via SupabaseAuthClient
 * Updates notificationsStore and redirects to home page
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
  clearCredentials(credentials);
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
    navigateTo("/");
  }
}
/*
 * async createUser(ref, credentials)
 * Attempts account creation via SupabaseAuthClient
 * Updates notificationsStore and redirects to home page
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
  clearCredentials(credentials);
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
  navigateTo("/");
}
/*
 * async logoutUser()
 * Attemps logout via SupabaseAuthClient
 * Updates notificationsStore and redirects to home page
 */
export async function logoutUser() {
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

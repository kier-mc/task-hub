/*
 * AUTH.TS
 * Contains functions related to user auth i.e login, logout, create account etc.
 * Hashing not required: https://github.com/orgs/supabase/discussions/437
 * notificationsStore will fail if declared globally as it will init prior to Pinia
 * Declared at start of each function instead, which can only be called after init
 */

import { allCredentialFieldsArePopulated } from "./auth.helper";

/**
 * Helper function to wipe credentials object once login/account creation submissions occur.
 * Iterates over all key/value pairs in the supplied parameter and sets the values to undefined.
 * @param credentials {Ref<LoginCredentialsDataObject>} object containing data to erase; inherited from parent function
 */
function clearCredentials(
  credentials: Ref<NewAccountDataObject> | Ref<LoginCredentialsDataObject>
): void {
  for (let [key, value] of Object.entries(credentials.value)) {
    if (key) {
      value = undefined;
    }
  }
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
  if (!allCredentialFieldsArePopulated(credentials)) {
    notificationsStore.setMessage(
      "Login failed. Please ensure all fields are filled in.",
      "error"
    );
    return;
  }
  const userStore = useUserStore();
  const { data, error } = await useSupabaseAuthClient().auth.signInWithPassword(
    {
      email: credentials.value.email as string,
      password: credentials.value.password as string,
    }
  );
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  if (data.user) {
    notificationsStore.setMessage(
      `Logged in as ${
        data.user.user_metadata.preferred_name
          ? data.user.user_metadata.preferred_name
          : data.user.email
      }!`,
      "success"
    );
    await userStore.fetchData();
    clearCredentials(credentials);
    await navigateTo("/hub");
  }
}
/**
 * Attempts account creation via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and redirects to login page.
 * @param credentials {Ref<LoginCredentialsDataObject>} object containing data (username, password) to pass to backend
 */
export async function createUser(credentials: Ref<NewAccountDataObject>) {
  const notificationsStore = useNotificationsStore();
  if (!allCredentialFieldsArePopulated(credentials)) {
    notificationsStore.setMessage(
      "Account creation failed. Please ensure all fields are filled in.",
      "error"
    );
    return;
  }
  const countryID = convertCountry(
    credentials.value.country as CountryName
  ) as CountryID;
  const { data, error } = await useSupabaseAuthClient().auth.signUp({
    email: credentials.value.email as string,
    password: credentials.value.password as string,
    options: {
      data: {
        preferred_name: credentials.value.preferred_name as string,
        country_id: countryID,
        locale: credentials.value.locale as string,
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
      "Email address is already registered.",
      "error"
    );
    return;
  }
  notificationsStore.setMessage("Account created successfully!", "success");
  clearCredentials(credentials);
  await navigateTo("/login");
}
/**
 * Attemps logout via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and redirects to root page.
 */
export async function logoutUser(): Promise<void> {
  const notificationsStore = useNotificationsStore();
  const userStore = useUserStore();
  const request = await useSupabaseAuthClient().auth.getUser();
  if (!request.data.user) {
    notificationsStore.setMessage("No user currently logged in.", "error");
    return;
  }
  const { error } = await useSupabaseAuthClient().auth.signOut();
  if (error) {
    notificationsStore.setMessage(error.message, "error");
    return;
  }
  userStore.clearData();
  notificationsStore.setMessage("Logged out successfully!", "success");
  await navigateTo("/");
}

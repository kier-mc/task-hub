// Types
import type {
  LoginCredentialData,
  NewAccountCredentialData,
} from "~/types/credentials";

/**
 * Attempts login via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and returns a boolean to indicate whether the request was successful.
 * @param credentials {Ref<LoginCredentialData>}
 * Object containing data (username, password) to pass to the back end.
 * @returns {Promise<boolean>} A boolean that determines whether the login attempt was successful or not.
 */
export async function loginUser(
  credentials: Ref<LoginCredentialData>
): Promise<boolean> {
  const notificationsStore = useNotificationsStore();
  if (!$app.allRefValuesArePopulated(credentials)) {
    notificationsStore.push(
      "Error",
      "Login failed. Please ensure all fields are filled in."
    );
    return false;
  }
  const userStore = useUserStore();
  const { data, error } = await useSupabaseClient().auth.signInWithPassword({
    email: credentials.value.email!,
    password: credentials.value.password!,
  });
  if (error) {
    notificationsStore.push("Error", error.message);
    return false;
  }
  if (data.user) {
    await userStore.fetchData();
    notificationsStore.push("Success", `Logged in as ${userStore.getName}!`);
    await navigateTo("/hub");
    return true;
  }
  return false;
}
/**
 * Attempts account creation via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user and returns a boolean to indicate whether the request was successful.
 * Credentials are cleared where the function is called, as it accepts a
 * computed ref as a parameter and only its constituents can be modified.
 * @param credentials {ComputedRef<CompleteNewAccountCredentialData>}
 * Object containing data to pass to the back end.
 */
export async function createUser(
  credentials: Ref<NewAccountCredentialData>
): Promise<boolean> {
  const notificationsStore = useNotificationsStore();
  if (!$app.allRefValuesArePopulated(credentials)) {
    notificationsStore.push("Error", "Please ensure all fields are filled in.");
    return false;
  }
  const { data, error } = await useSupabaseClient().auth.signUp({
    email: credentials.value.email!,
    password: credentials.value.password!,
    options: {
      data: {
        preferred_name: credentials.value.name,
        country_id: credentials.value.location?.country_id,
        locale: credentials.value.locale,
      },
    },
  });
  if (error) {
    notificationsStore.push("Error", error.message);
    return false;
  }
  // Supabase doesn't notify if the email address is already registered
  // https://github.com/supabase/supabase-js/issues/296#issuecomment-1372552875
  if (data.user?.identities?.length === 0) {
    notificationsStore.push("Error", "Email address is already registered.");
    return false;
  }
  notificationsStore.push("Success", "Account created successfully!");
  return true;
}
/**
 * Attemps logout via SupabaseAuthClient (@nuxtjs/supabase).
 * Pushes a notification to the user to inform them whether the request was successful.
 */
export async function logoutUser(): Promise<void> {
  const notificationsStore = useNotificationsStore();
  const userStore = useUserStore();
  const { error } = await useSupabaseClient().auth.signOut();
  if (error) throw new Error(error.message);
  userStore.$reset();
  notificationsStore.push("Success", "Logged out successfully!");
  await navigateTo("/");
}

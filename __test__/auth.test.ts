// @vitest-environment nuxt

/*
 * At the end of testing, a 404 error is returned referencing api/_supabase/session
 * Tests and live Supabase-related functions all execute without issue
 * Many hours spent searching for solution but nothing concrete exists
 * Edited @nuxtjs/supabase/dist/runtime/plugins/supabase.client.mjs with a try/catch block to silence the issue
 * No observable difference in functionality with the edit but should seek a better solution/raise an issue on Github
 *
 */
/* supabase.client.mjs edit (for reference) */
// const setServerSession = async (event, session) => {
//   try {
//     return await $fetch("/api/_supabase/session", {
//     method: "POST",
//     body: { event, session }
//     });
//   }
//   catch (error) {
//     console.log(error)
//   }
// };

import type { User, Session, AuthError } from "@supabase/supabase-js";

// Types
import type {
  LoginCredentialData,
  NewAccountCredentialData,
} from "types/credentials";
/* Vitest imports */
import { vi, describe, test, expect, beforeEach } from "vitest";
/* Pinia imports */
import { setActivePinia, createPinia } from "pinia";
/* Functions to be tested */
import { loginUser, createUser, logoutUser } from "~/composables/auth";

/* Module/function mocking */
vi.mock("@nuxtjs/supabase");
vi.mock("nuxt/app", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...(mod as any),
    // TODO: figure out how to test the route
    navigateTo: vi.fn(),
  };
});

/* Instantiate Pinia and the notification store */
setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();
const userStore = useUserStore();

describe("Tests related to logging in", () => {
  // Mock login credentials object
  const loginCredentials: Ref<LoginCredentialData> = ref({
    email: null,
    password: null,
  });
  // Reset values, notification store data and mocks
  beforeEach(() => {
    loginCredentials.value.email = null;
    loginCredentials.value.password = null;
    notificationsStore.$reset();
    vi.resetAllMocks();
  });
  test("Blank credentials fail and push an error notification", async () => {
    await loginUser(ref(loginCredentials));
    expect(notificationsStore.message).toBe(
      "Login failed. Please ensure all fields are filled in."
    );
  });
  test("Invalid credentials fail and push an error notification", async () => {
    // Data
    loginCredentials.value.email = "invalidemail@domain.com";
    loginCredentials.value.password = "invalidpassword";
    // Mocks
    const mockData = {
      error: { message: "Invalid login credentials" },
    };
    const mocksignInWithPassword = vi.spyOn(
      useSupabaseAuthClient().auth,
      "signInWithPassword"
    );
    //@ts-ignore
    mocksignInWithPassword.mockResolvedValueOnce(mockData);
    // Calls
    await loginUser(ref(loginCredentials));
    // Assertions
    expect(mocksignInWithPassword).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Invalid login credentials");
  });
  test("Valid credentials succeed and push a success notification referencing the user's name", async () => {
    // Data
    loginCredentials.value.email = "validemail@domain.com";
    loginCredentials.value.password = "validpassword";
    // Mocks
    const mockData = {
      user: true,
      session: true,
    };
    const [mockSignInWithPassword, mockFetchData, mockGetName] = [
      vi.spyOn(useSupabaseAuthClient().auth, "signInWithPassword"),
      vi.spyOn(userStore, "fetchData"),
      vi.spyOn(userStore, "getName"),
    ];
    //@ts-ignore
    mockSignInWithPassword.mockResolvedValueOnce({ data: mockData });
    mockFetchData.mockResolvedValueOnce();
    mockGetName.mockReturnValueOnce("User");
    // Calls
    await loginUser(ref(loginCredentials));
    // Assertions
    expect(mockSignInWithPassword).toHaveBeenCalledOnce();
    expect(mockFetchData).toHaveBeenCalledOnce();
    expect(mockGetName).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Logged in as User!");
  });
});

describe("Tests related to creating an account", () => {
  // Mock new user credentials object
  const newAccountCredentials: Ref<NewAccountCredentialData> = ref({
    email: null,
    password: null,
    name: null,
    country: {
      country_id: null,
      name: null,
      iso_code: null,
    },
    locale: null,
  });
  // Reset values, notification store data and mocks
  beforeEach(() => {
    clearAllFields(newAccountCredentials);
    notificationsStore.$reset();
    vi.resetAllMocks();
  });
  test("Empty credentials fail and push an error notification", async () => {
    // Calls
    await createUser(newAccountCredentials);
    // Assertions
    expect(notificationsStore.message).toBe(
      "Please ensure all fields are filled in."
    );
  });
  test("An invalid email fails and pushes an error notification", async () => {
    // Data
    const { email, password, name, country, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "invalidemail@domain.com";
    password.value = "validpassword";
    name.value = "User";
    country.value = {
      country_id: 235,
      name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockData = {
      message: "Unable to validate email address: invalid format",
    };
    const mockSignUp = vi.spyOn(useSupabaseAuthClient().auth, "signUp");
    //@ts-ignore
    mockSignUp.mockResolvedValueOnce({ error: mockData });
    // Calls
    await createUser(newAccountCredentials);
    // Assertions
    expect(mockSignUp).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "Unable to validate email address: invalid format"
    );
  });
  test("A password of less than 12 characters fails and pushes an error notification", async () => {
    // Data
    const { email, password, name, country, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "validemail@domain.com";
    password.value = "tooshort";
    name.value = "User";
    country.value = {
      country_id: 235,
      name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockData = {
      message: "Password should be at least 12 characters",
    };
    const mockSignUp = vi.spyOn(useSupabaseAuthClient().auth, "signUp");
    //@ts-ignore
    mockSignUp.mockResolvedValueOnce({ error: mockData });
    // Calls
    await createUser(newAccountCredentials);
    // Assertions
    expect(mockSignUp).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "Password should be at least 12 characters"
    );
  });
  test("Valid credentials succeed and push a success notification", async () => {
    // Data
    const { email, password, name, country, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "validemail@domain.com";
    password.value = "validpassword";
    name.value = "User";
    country.value = {
      country_id: 235,
      name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockSignUp = vi.spyOn(useSupabaseAuthClient().auth, "signUp");
    //@ts-ignore
    mockSignUp.mockResolvedValueOnce({ data: true });
    // Calls
    await createUser(newAccountCredentials);
    // Assertions
    expect(mockSignUp).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Account created successfully!");
  });
  test("Using a preexisting email fails and pushes an error notification", async () => {
    // Data
    const { email, password, name, country, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "validemail@domain.com";
    password.value = "validpassword";
    name.value = "User";
    country.value = {
      country_id: 235,
      name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockData = { user: { identities: [] } };
    const mockSignUp = vi.spyOn(useSupabaseAuthClient().auth, "signUp");
    //@ts-ignore
    mockSignUp.mockResolvedValueOnce({ data: mockData });
    // Calls
    await createUser(newAccountCredentials);
    // Assertions
    expect(mockSignUp).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "Email address is already registered."
    );
  });
});

describe("Tests related to logging out", () => {
  // Reset notification store data and mocks
  beforeEach(() => {
    notificationsStore.$reset();
    vi.resetAllMocks();
  });
  test("Attempting to logout with no active user fails and throws an error", async () => {
    // Mocks
    const mockSignOut = vi.spyOn(useSupabaseAuthClient().auth, "signOut");
    mockSignOut.mockResolvedValueOnce({
      //@ts-ignore
      error: { message: "Error" },
    });
    // Assertions
    await expect(logoutUser()).rejects.toThrowError("Error");
    expect(mockSignOut).toHaveBeenCalledOnce();
  });
  test("Attempting to logout with an active user succeeds and pushes a success notification", async () => {
    // Mocks

    const mockSignOut = vi.spyOn(useSupabaseAuthClient().auth, "signOut");
    mockSignOut.mockResolvedValueOnce({
      //@ts-ignore
      data: { user: true },
    });

    // Calls
    await logoutUser();
    // Assertions
    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Logged out successfully!");
  });
});

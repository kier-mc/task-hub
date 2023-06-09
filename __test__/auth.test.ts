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

describe("Tests related to logging in", () => {
  // Mock login credentials object
  const loginCredentials: LoginCredentialsDataObject = reactive({
    email: undefined,
    password: undefined,
  });
  // Reset values, notification store data and mocks
  beforeEach(() => {
    loginCredentials.email = undefined;
    loginCredentials.password = undefined;
    notificationsStore.clearAll();
    vi.resetAllMocks();
  });
  test("Blank credentials fail and push an error notification", async () => {
    await loginUser(ref(loginCredentials));
    expect(notificationsStore.message).toBe(
      "Login failed. Please ensure all fields are filled in."
    );
    expect(notificationsStore.type).toBe("error");
  });
  test("Invalid credentials fail and push an error notification", async () => {
    // Data
    loginCredentials.email = "invalidemail@domain.com";
    loginCredentials.password = "invalidpassword";
    // Mocks
    const mockData = {
      message: "Invalid login credentials",
    };
    const mock = vi.fn().mockResolvedValueOnce({ error: mockData });
    useSupabaseAuthClient().auth.signInWithPassword = mock;
    // Calls
    await loginUser(ref(loginCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Invalid login credentials");
    expect(notificationsStore.type).toBe("error");
  });
  test("Valid credentials succeed and push a success notification referencing the user's email", async () => {
    // Data
    loginCredentials.email = "validemail@domain.com";
    loginCredentials.password = "validpassword";
    // Mocks
    const mockData = {
      user: {
        email: "validemail@domain.com",
        user_metadata: { preferred_name: undefined },
      },
    };
    const mock = vi.fn().mockResolvedValueOnce({ data: mockData });
    useSupabaseAuthClient().auth.signInWithPassword = mock;
    useUserStore().fetchData = mock;
    // Calls
    await loginUser(ref(loginCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledTimes(2);
    expect(notificationsStore.message).toBe(
      "Logged in as validemail@domain.com!"
    );
    expect(notificationsStore.type).toBe("success");
  });
  test("Valid credentials succeed and push a success notification which favours the user's preferred name over their email when it is present", async () => {
    // Data
    loginCredentials.email = "validemail@domain.com";
    loginCredentials.password = "validpassword";
    // Mocks
    const mockData = {
      user: {
        email: "validemail@domain.com",
        user_metadata: { preferred_name: "User" },
      },
    };
    const mock = vi.fn().mockResolvedValueOnce({ data: mockData });
    useSupabaseAuthClient().auth.signInWithPassword = mock;
    useUserStore().fetchData = mock;
    // Calls
    await loginUser(ref(loginCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledTimes(2);
    expect(notificationsStore.message).toBe("Logged in as User!");
    expect(notificationsStore.type).toBe("success");
  });
});

describe("Tests related to creating an account", () => {
  // Mock new user credentials object
  const newAccountCredentials: NewAccountDataObject = reactive({
    email: undefined,
    password: undefined,
    preferred_name: undefined,
    country: undefined,
    locale: undefined,
  });
  // Reset values, notification store data and mocks
  beforeEach(() => {
    newAccountCredentials.email = undefined;
    newAccountCredentials.password = undefined;
    newAccountCredentials.preferred_name = undefined;
    newAccountCredentials.country = undefined;
    newAccountCredentials.locale = undefined;
    notificationsStore.clearAll();
    vi.resetAllMocks();
  });
  test("Empty credentials fail and push an error notification", async () => {
    // Calls
    await createUser(ref(newAccountCredentials));
    // Assertions
    expect(notificationsStore.message).toBe(
      "Account creation failed. Please ensure all fields are filled in."
    );
    expect(notificationsStore.type).toBe("error");
  });
  test("An invalid email fails and pushes an error notification", async () => {
    // Data
    newAccountCredentials.email = "invalidemail";
    newAccountCredentials.password = "validpassword";
    newAccountCredentials.preferred_name = "User";
    newAccountCredentials.country = "United Kingdom";
    newAccountCredentials.locale = "Halton";
    // Mocks
    const mockData = {
      message: "Unable to validate email address: invalid format",
    };
    const mock = vi.fn().mockResolvedValueOnce({ error: mockData });
    useSupabaseAuthClient().auth.signUp = mock;
    // Calls
    await createUser(ref(newAccountCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "Unable to validate email address: invalid format"
    );
    expect(notificationsStore.type).toBe("error");
  });
  test("A password of less than 12 characters fails and pushes an error notification", async () => {
    // Data
    newAccountCredentials.email = "validemail@domain.com";
    newAccountCredentials.password = "tooshort";
    newAccountCredentials.preferred_name = "User";
    newAccountCredentials.country = "United Kingdom";
    newAccountCredentials.locale = "Halton";
    // Mocks
    const mockData = {
      message: "Password should be at least 12 characters",
    };
    const mock = vi.fn().mockResolvedValueOnce({ error: mockData });
    useSupabaseAuthClient().auth.signUp = mock;
    // Calls
    await createUser(ref(newAccountCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "Password should be at least 12 characters"
    );
    expect(notificationsStore.type).toBe("error");
  });
  test("Valid credentials succeed and push a success notification", async () => {
    // Data
    newAccountCredentials.email = "validemail@domain.com";
    newAccountCredentials.password = "validpassword";
    newAccountCredentials.preferred_name = "User";
    newAccountCredentials.country = "United Kingdom";
    newAccountCredentials.locale = "Halton";
    // Mocks
    const mock = vi.fn().mockResolvedValueOnce({ data: {} });
    useSupabaseAuthClient().auth.signUp = mock;
    // Calls
    await createUser(ref(newAccountCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Account created successfully!");
    expect(notificationsStore.type).toBe("success");
  });
  test("Using a preexisting email fails and pushes an error notification", async () => {
    // Data
    newAccountCredentials.email = "alreadyregisteredemail@domain.com";
    newAccountCredentials.password = "validpassword";
    newAccountCredentials.preferred_name = "User";
    newAccountCredentials.country = "United Kingdom";
    newAccountCredentials.locale = "Halton";
    // Mocks
    const mockData = { user: { identities: [] } };
    const mock = vi.fn().mockResolvedValueOnce({ data: mockData });
    useSupabaseAuthClient().auth.signUp = mock;
    // Calls
    await createUser(ref(newAccountCredentials));
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "Email address is already registered."
    );
    expect(notificationsStore.type).toBe("error");
  });
});

describe("Tests related to logging out", () => {
  // Reset notification store data and mocks
  beforeEach(() => {
    notificationsStore.clearAll();
    vi.resetAllMocks();
  });
  test("Attempting to logout with no active user fails and pushes an error notification", async () => {
    // Mocks
    const mockData = { error: "error" };
    const mock = vi.fn().mockResolvedValueOnce({ data: mockData });
    useSupabaseAuthClient().auth.getUser = mock;
    // Calls
    await logoutUser();
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("No user currently logged in.");
    expect(notificationsStore.type).toBe("error");
  });
  test("Attempting to logout with an active user succeeds and pushes a success notification", async () => {
    // Mocks
    const mockData = { user: {} };
    const mock = vi.fn().mockResolvedValueOnce({ data: mockData });
    useSupabaseAuthClient().auth.getUser = mock;
    // Calls
    await logoutUser();
    // Assertions
    expect(mock).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Logged out successfully!");
    expect(notificationsStore.type).toBe("success");
  });
  test("Receiving an error message from the endpoint pushes an error notification", async () => {
    // Mocks
    const mockUser = { user: {} };
    const mockErrorResponse = {
      message: "An error message from the endpoint.",
    };
    const mockGetUser = vi.fn().mockResolvedValueOnce({ data: mockUser });
    const mockSignOut = vi
      .fn()
      .mockResolvedValueOnce({ error: mockErrorResponse });
    useSupabaseAuthClient().auth.getUser = mockGetUser;
    useSupabaseAuthClient().auth.signOut = mockSignOut;
    // Calls
    await logoutUser();
    // Assertions
    expect(mockGetUser).toHaveBeenCalledOnce();
    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe(
      "An error message from the endpoint."
    );
    expect(notificationsStore.type).toBe("error");
  });
});

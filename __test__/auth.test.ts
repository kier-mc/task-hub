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
import { vi, describe, test, expect, beforeAll, beforeEach } from "vitest";
/* Pinia imports */
import { setActivePinia, createPinia } from "pinia";
/* Functions to be tested */
import { loginUser, createUser, logoutUser } from "~/composables/auth";

/* Module/function mocking */
const mocked = vi.fn();
vi.mock("@nuxtjs/supabase");

// Create a new Pinia instance, reset the notifications and reset all mocks
beforeAll(() => {
  setActivePinia(createPinia());
});

describe("Tests related to logging in", () => {
  const loginCredentials: LoginCredentialsDataObject = reactive({
    email: "",
    password: "",
  });
  // Reset credentials to empty strings
  beforeEach(() => {
    loginCredentials.email = "";
    loginCredentials.password = "";
    useNotificationsStore().$reset;
    vi.resetAllMocks();
  });
  /*
   * Calls auth.ts > loginUser()
   * Should update notifications.message with an error
   * Should update notifications.type as "error"
   */
  test("Blank credentials fail and push an error notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock an error response from the endpoint via auth.signInWithPassword()
    const mock = { message: "Invalid login credentials" };
    useSupabaseAuthClient().auth.signInWithPassword =
      mocked.mockResolvedValueOnce({ error: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Invalid login credentials");
    expect(notifications.type).toBe("error");
  });
  /*
   * Calls auth.ts > loginUser()
   * Should update notifications.message with a success message
   * Should update notifications.type as "success"
   */
  test("Valid credentials succeed and push a success notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Fake credentials to supply to the endpoint
    loginCredentials.email = "validemail@domain.com";
    loginCredentials.password = "validpassword";
    // Mock a response from the endpoint via auth.signInWithPassword() when no user.user_metadata.name is present
    const mock = {
      user: { email: "validemail@domain.com", user_metadata: { name: "" } },
    };
    useSupabaseAuthClient().auth.signInWithPassword =
      mocked.mockResolvedValueOnce({ data: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Logged in as validemail@domain.com");
    expect(notifications.type).toBe("success");
    // Mock a response from the endpoint via auth.signInWithPassword() when user.user_metadata.name is present
    // Reset all mocks and update the user.user_metadata with a truthy value
    vi.resetAllMocks();
    mock.user.user_metadata.name = "User";
    useSupabaseAuthClient().auth.signInWithPassword =
      mocked.mockResolvedValueOnce({ data: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Logged in as User");
    expect(notifications.type).toBe("success");
  });
});

describe("Tests related to creating an account", () => {
  const newUserCredentials: NewAccountDataObject = reactive({
    email: "",
    password: "",
    name: "",
  });
  beforeEach(() => {
    newUserCredentials.email = "";
    newUserCredentials.password = "";
    newUserCredentials.name = "";
    useNotificationsStore().$reset;
    vi.resetAllMocks();
  });
  /*
   * Calls auth.ts > createUser()
   * Should update notifications.message with an error message
   * Should update notifications.type as "error"
   */
  test("Empty credentials fail and push an error notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock an error response from the endpoint via auth.signUp()
    const mock = { message: "Signup requires a valid password" };
    useSupabaseAuthClient().auth.signUp = mocked.mockResolvedValueOnce({
      error: mock,
    });
    // Call the createUser function as it is used and create assertions
    await createUser(ref(newUserCredentials));
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Signup requires a valid password");
    expect(notifications.type).toBe("error");
  });
  /*
   * Calls auth.ts > createUser()
   * Should update notifications.message with a success message
   * Should update notifications.type as "success"
   */
  test("Valid credentials succeed and push a success notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Fake credentials to supply to the endpoint
    newUserCredentials.email = "validemail@domain.com";
    newUserCredentials.password = "validpassword";
    newUserCredentials.name = "User";
    // Mock a valid response from the endpoint via auth.signUp()
    const mock = {};
    useSupabaseAuthClient().auth.signUp = mocked.mockResolvedValueOnce({
      data: mock,
    });
    // Call the createUser function as it is used and create assertions
    await createUser(ref(newUserCredentials));
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Account created successfully");
    expect(notifications.type).toBe("success");
  });
  /*
   * Calls auth.ts > createUser()
   * Should update notifications.message with an error message
   * Should update notifications.type as "error"
   */
  test("Using a preexisting email fails and pushes an error notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Fake credentials to supply to the endpoint
    newUserCredentials.email = "alreadyregisteredemail@domain.com";
    newUserCredentials.password = "validpassword";
    newUserCredentials.name = "User";
    // Mock a response lacking user.identities from the endpoint via auth.signUp()
    const mock = { user: { identities: [] } };
    useSupabaseAuthClient().auth.signUp = mocked.mockResolvedValueOnce({
      data: mock,
    });
    // Call the createUser function as it is used and create assertions
    await createUser(ref(newUserCredentials));
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Email address is already registered");
    expect(notifications.type).toBe("error");
  });
});

describe("Tests related to logging out", () => {
  beforeEach(() => {
    useNotificationsStore().$reset;
    vi.resetAllMocks();
  });
  /*
   * Calls auth.ts > logoutUser()
   * Should update notifications.message with an error message
   * Should update notifications.type as "error"
   */
  test("Attempting to logout with no active user fails and pushes an error notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock an error response from the endpoint via auth.getUser()
    const mock = { error: "error" };
    useSupabaseAuthClient().auth.getUser = mocked.mockResolvedValueOnce({
      data: mock,
    });
    // Call the logoutUser function as it is used and create assertions
    await logoutUser();
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("No user currently logged in");
    expect(notifications.type).toBe("error");
  });
  /*
   * Calls auth.ts > logoutUser()
   * Should update notifications.message with a success message
   * Should update notifications.type as "success"
   */
  test("Attempting to logout with an active user succeeds and pushes a success notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock a valid response from the endpoint via auth.getUser()
    const mock = { user: {} };
    useSupabaseAuthClient().auth.getUser = mocked.mockResolvedValueOnce({
      data: mock,
    });
    // Call the logoutUser function as it is used and create assertions
    await logoutUser();
    expect(mocked).toHaveBeenCalledOnce();
    expect(notifications.message).toBe("Logged out successfully");
    expect(notifications.type).toBe("success");
  });
  /*
   * Calls auth.ts > logoutUser()
   * Should update notifications.message with an error message
   * Should update notifications.type as "error"
   */
  test("Receiving an error message from the endpoint pushes an error notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock a valid response from the endpoint via auth.getUser()
    // ...but mock an error response from the auth.signOut() endpoint
    const mockUser = { user: {} };
    const mockErrorResponse = { message: "An error message from the endpoint" };
    useSupabaseAuthClient().auth.getUser = mocked.mockResolvedValueOnce({
      data: mockUser,
    });
    useSupabaseAuthClient().auth.signOut = mocked.mockResolvedValueOnce({
      error: mockErrorResponse,
    });
    // Call the logoutUser function as it is used and create assertions
    await logoutUser();
    expect(mocked).toHaveBeenCalledTimes(2);
    expect(notifications.message).toBe("An error message from the endpoint");
    expect(notifications.type).toBe("error");
  });
});

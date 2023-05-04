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
import {
  vi,
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";
/* Pinia imports */
import { setActivePinia, createPinia } from "pinia";
/* Functions to be tested */
import { loginUser, createUser, logoutUser } from "~/composables/auth";

/* Module/function mocking */
const mocked = vi.fn();
vi.mock("@nuxtjs/supabase");

// Create a new Pinia instance
beforeAll(() => {
  setActivePinia(createPinia());
});
// Reset all mock values and the notifications store
afterAll(() => {
  useNotificationsStore().$reset;
  vi.resetAllMocks();
});

describe("Tests related to logging in", () => {
  const loginCredentials: LoginCredentialsDataObject = reactive({
    email: "",
    password: "",
  });
  // Reset credentials to empty strings
  afterEach(() => {
    loginCredentials.email = "";
    loginCredentials.password = "";
  });
  /*
   * Calls auth.ts > loginUser()
   * Should update notifications.message with an error
   * Should update notifications.type as "error"
   */
  test("Blank credentials push an error message as a notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock a fake error message and intercept the auth client login function
    const mock = { message: "Invalid login credentials" };
    useSupabaseAuthClient().auth.signInWithPassword =
      mocked.mockResolvedValueOnce({ error: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(notifications.message).toBe("Invalid login credentials");
    expect(notifications.type).toBe("error");
  });
  /*
   * Calls auth.ts > loginUser()
   * Should update notifications.message with a success message
   * Should update notifications.type as "success"
   */
  test("Valid credentials push a success message as a notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Fake credentials to supply to the endpoint
    loginCredentials.email = "validemail@domain.com";
    loginCredentials.password = "validpassword";
    // Mock the expected success message and intercept the auth client login function
    const mock = {
      user: { email: "validemail@domain.com", user_metadata: { name: "" } },
    };
    useSupabaseAuthClient().auth.signInWithPassword =
      mocked.mockResolvedValueOnce({ data: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(notifications.message).toBe("Logged in as validemail@domain.com");
    expect(notifications.type).toBe("success");
    // Reset all mocks, update the name value in the user_metadata and remock
    vi.resetAllMocks();
    mock.user.user_metadata.name = "User";
    useSupabaseAuthClient().auth.signInWithPassword =
      mocked.mockResolvedValueOnce({ data: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
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
  afterEach(() => {
    newUserCredentials.email = "";
    newUserCredentials.password = "";
    newUserCredentials.name = "";
  });
  /*
   * Calls auth.ts > createUser()
   * Should update notifications.message with an error message
   * Should update notifications.type as "error"
   */
  test("Using empty credentials should push an error message as a notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Mock a fake error message and intercept the auth client create account function
    const mock = { message: "Signup requires a valid password" };
    useSupabaseAuthClient().auth.signUp = mocked.mockResolvedValueOnce({
      error: mock,
    });
    // Call the createUser function as it is used and create assertions
    await createUser(ref(newUserCredentials));
    expect(notifications.message).toBe("Signup requires a valid password");
    expect(notifications.type).toBe("error");
  });
  /*
   * Calls auth.ts > createUser()
   * Should update notifications.message with a success message
   * Should update notifications.type as "success"
   */
  test("Using valid credentials should push a success message as a notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Fake credentials to supply to the endpoint
    newUserCredentials.email = "validemail@domain.com";
    newUserCredentials.password = "validpassword";
    newUserCredentials.name = "User";
    // Mock a fake success message and intercept the auth client create account function
    const mock = {};
    useSupabaseAuthClient().auth.signUp = mocked.mockResolvedValueOnce({
      data: mock,
    });
    // Call the createUser function as it is used and create assertions
    await createUser(ref(newUserCredentials));
    expect(notifications.message).toBe("Account created successfully");
    expect(notifications.type).toBe("success");
  });
  /*
   * Calls auth.ts > createUser()
   * Should update notifications.message with an error message
   * Should update notifications.type as "error"
   */
  test("Using a preexisting email should push an error message as a notification", async () => {
    // Instantiate the notification store
    const notifications = useNotificationsStore();
    // Fake credentials to supply to the endpoint
    newUserCredentials.email = "alreadyregisteredemail@domain.com";
    newUserCredentials.password = "validpassword";
    newUserCredentials.name = "User";
    // Mock a fake success message and intercept the auth client create account function
    const mock = { user: { identities: [] } };
    useSupabaseAuthClient().auth.signUp = mocked.mockResolvedValueOnce({
      data: mock,
    });
    // Call the createUser function as it is used and create assertions
    await createUser(ref(newUserCredentials));
    expect(notifications.message).toBe("Email address is already registered");
    expect(notifications.type).toBe("error");
  });
});

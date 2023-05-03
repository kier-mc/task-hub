// @vitest-environment nuxt
/*
 * At the end of testing, a 404 error is returned referencing api/_supabase/session
 * Doesn't appear to affect tests as all execute with no issues
 * Need to look further into why
 */
/* Vitest imports */
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
/* Pinia imports */
import { setActivePinia, createPinia } from "pinia";
/* Functions to be tested */
import { loginUser, createUser, logoutUser } from "~/composables/auth";

/* Module/function mocking */
const signInWithPasswordMock = vi.fn();
vi.mock("@nuxtjs/supabase");
/* Datatype mocking */
const loginCredentials: LoginCredentialsDataObject = reactive({
  email: "",
  password: "",
});

describe("Tests related to logging in", () => {
  // Create a new Pinia instance and reset the loginCredentials object
  beforeEach(() => {
    setActivePinia(createPinia());
    loginCredentials.email = "";
    loginCredentials.password = "";
  });
  // Reset all mock values after each test
  afterEach(() => {
    vi.resetAllMocks();
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
      signInWithPasswordMock.mockResolvedValueOnce({ error: mock });
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
      signInWithPasswordMock.mockResolvedValueOnce({ data: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(notifications.message).toBe("Logged in as validemail@domain.com");
    expect(notifications.type).toBe("success");
    // Reset all mocks, update the name value in the user_metadata and remock
    vi.resetAllMocks();
    mock.user.user_metadata.name = "User";
    useSupabaseAuthClient().auth.signInWithPassword =
      signInWithPasswordMock.mockResolvedValueOnce({ data: mock });
    // Call the loginUser function as it is used and create assertions
    await loginUser(ref(loginCredentials));
    expect(notifications.message).toBe("Logged in as User");
    expect(notifications.type).toBe("success");
  });
});

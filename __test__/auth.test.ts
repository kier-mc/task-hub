// @vitest-environment nuxt
/*
 * At the end of testing, a 404 error is returned referencing api/_supabase/session
 * Doesn't appear to affect tests as all execute with no issues
 * Need to look further into why
 */
/* Vitest imports */
import { vi, describe, test, expect, beforeEach } from "vitest";
/* Pinia imports */
import { setActivePinia, createPinia } from "pinia";
/* Functions to be tested */
import { loginUser, createUser, logoutUser } from "~/composables/auth";

/* Module mocking */
const signInWithPasswordMock = vi.fn();
vi.mock("@nuxtjs/supabase", () => {
  useSupabaseAuthClient: () => ({
    auth: {
      signInWithPassword: signInWithPasswordMock(),
    },
  });
});

/* Datatype mocking */
const loginCredentials: LoginCredentialsDataObject = reactive({
  email: "",
  password: "",
});

describe("Tests related to logging in", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  test("Blank credentials raise an error message as a notification", async () => {
    const notifications = useNotificationsStore();
    const loginErrorMock = { message: "Invalid login credentials" };
    signInWithPasswordMock.mockResolvedValueOnce({ error: loginErrorMock });
    await loginUser(ref(loginCredentials));
    expect(notifications.message).toBe("Invalid login credentials");
  });
});

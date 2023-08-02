// @vitest-environment nuxt

// Types
import type {
  LoginCredentialData,
  NewAccountCredentialData,
} from "types/credentials";

// Testing functions
import { setActivePinia, createPinia } from "pinia";
import { vi, describe, test, expect, beforeEach } from "vitest";

// Functions to be tested
import { loginUser, createUser, logoutUser } from "~/composables/auth";

/* Module/function mocking */
vi.mock("@nuxtjs/supabase");
vi.mock("nuxt/app", async (importOriginal) => {
  const copy = await importOriginal();
  return {
    ...(copy as any),
    // TODO: figure out how to test the route
    navigateTo: vi.fn(),
  };
});

// Pinia test environment and instantiations
setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();
const userStore = useUserStore();

describe("Tests related to logging in", () => {
  // Mock login credentials object
  const loginCredentials: Ref<LoginCredentialData> = ref({
    email: null,
    password: null,
  });
  // Reset values, active Pinia and mocks
  beforeEach(() => {
    loginCredentials.value.email = null;
    loginCredentials.value.password = null;
    notificationsStore.$reset;
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
      useSupabaseClient().auth,
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
    const [mockSignInWithPassword, mockFetchData] = [
      vi.spyOn(useSupabaseClient().auth, "signInWithPassword"),
      vi.spyOn(userStore, "fetchData"),
    ];
    //@ts-ignore
    mockSignInWithPassword.mockResolvedValueOnce({ data: mockData });
    mockFetchData.mockResolvedValueOnce();
    userStore.name = "User";
    // Calls
    await loginUser(ref(loginCredentials));
    // Assertions
    expect(mockSignInWithPassword).toHaveBeenCalledOnce();
    expect(mockFetchData).toHaveBeenCalledOnce();
    expect(notificationsStore.message).toBe("Logged in as User!");
  });
});

describe("Tests related to creating an account", () => {
  // Mock new user credentials object
  const newAccountCredentials: Ref<NewAccountCredentialData> = ref({
    email: null,
    password: null,
    name: null,
    location: {
      country_id: null,
      country_name: null,
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
    const { email, password, name, location, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "invalidemail@domain.com";
    password.value = "validpassword";
    name.value = "User";
    location.value = {
      country_id: 235,
      country_name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockData = {
      message: "Unable to validate email address: invalid format",
    };
    const mockSignUp = vi.spyOn(useSupabaseClient().auth, "signUp");
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
    const { email, password, name, location, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "validemail@domain.com";
    password.value = "tooshort";
    name.value = "User";
    location.value = {
      country_id: 235,
      country_name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockData = {
      message: "Password should be at least 12 characters",
    };
    const mockSignUp = vi.spyOn(useSupabaseClient().auth, "signUp");
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
    const { email, password, name, location, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "validemail@domain.com";
    password.value = "validpassword";
    name.value = "User";
    location.value = {
      country_id: 235,
      country_name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockSignUp = vi.spyOn(useSupabaseClient().auth, "signUp");
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
    const { email, password, name, location, locale } = toRefs(
      newAccountCredentials.value
    );
    email.value = "validemail@domain.com";
    password.value = "validpassword";
    name.value = "User";
    location.value = {
      country_id: 235,
      country_name: "United Kingdom",
      iso_code: "GB",
    };
    locale.value = "Halton";
    // Mocks
    const mockData = { user: { identities: [] } };
    const mockSignUp = vi.spyOn(useSupabaseClient().auth, "signUp");
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
    const mockSignOut = vi.spyOn(useSupabaseClient().auth, "signOut");
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

    const mockSignOut = vi.spyOn(useSupabaseClient().auth, "signOut");
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

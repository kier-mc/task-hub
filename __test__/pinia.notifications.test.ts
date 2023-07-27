/* Vitest imports */
import { describe, test, expect, beforeAll, beforeEach } from "vitest";
/* Pinia imports */
import { setActivePinia, createPinia } from "pinia";
/* Functions to be tested */
import { useNotificationsStore } from "~/stores/notifications";

beforeAll(() => {
  setActivePinia(createPinia());
});

describe("Tests related to notification store default state", () => {
  beforeEach(() => {
    useNotificationsStore().$reset;
  });
  test("When the store is instantiated, 'title' should be null", () => {
    const notificationsStore = useNotificationsStore();
    expect(notificationsStore.title).toBe(null);
  });
  test("When the store is instantiated, 'message' should be null", () => {
    const notificationsStore = useNotificationsStore();
    expect(notificationsStore.message).toBe(null);
  });
});
describe("Tests related to notification store methods", () => {
  beforeEach(() => {
    useNotificationsStore().$reset;
  });
  test("The push method should update the state title and message with the specified parameters", () => {
    const notificationsStore = useNotificationsStore();
    notificationsStore.push("Test", "This is a test message");
    expect(notificationsStore.title).toBe("Test");
    expect(notificationsStore.message).toBe("This is a test message");
  });
});

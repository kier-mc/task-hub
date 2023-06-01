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
  test("When the store is instantiated, 'message' should be null", () => {
    const notificationsStore = useNotificationsStore();
    expect(notificationsStore.message).toBe(null);
  });
  test("When the store is instantiated, 'type' should be null", () => {
    const notificationsStore = useNotificationsStore();
    expect(notificationsStore.type).toBe(null);
  });
});
describe("Tests related to notification store methods", () => {
  beforeEach(() => {
    useNotificationsStore().$reset;
  });
  test("The setMessage method should update the stored message and type with the specified parameters", () => {
    const notificationsStore = useNotificationsStore();
    notificationsStore.setMessage("This is a test message", "test");
    expect(notificationsStore.message).toBe("This is a test message");
    expect(notificationsStore.type).toBe("test");
  });
  test("The clearAll method should reset 'message' and 'type' to null", () => {
    const notificationsStore = useNotificationsStore();
    notificationsStore.setMessage("This is a test message", "test");
    notificationsStore.clearAll();
    expect(notificationsStore.message).toBe(null);
    expect(notificationsStore.type).toBe(null);
  });
});

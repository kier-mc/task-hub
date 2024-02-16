// Vitest
import { describe, test, expect } from "vitest";

// Functions to be tested
import { $app } from "~/composables/helper.app";

describe("Tests related to the ref value helper", () => {
  test("Return false when all values are falsy", () => {
    const data = ref({
      key_1: null,
      key_2: null,
    });
    expect($app.allRefValuesArePopulated(data)).toBe(false);
  });
  test("Return false when at least one value is falsy", () => {
    const data = ref({
      key_1: "value",
      key_2: null,
    });
    expect($app.allRefValuesArePopulated(data)).toBe(false);
  });
  test("Return true when all values are truthy", () => {
    const data = ref({
      key_1: "value",
      key_2: "another value",
    });
    expect($app.allRefValuesArePopulated(data)).toBe(true);
  });
});

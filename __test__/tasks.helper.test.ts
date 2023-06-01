/* Vitest imports */
import { describe, test, expect } from "vitest";
/* Functions to be tested */
import { convertFrequency } from "~/composables/tasks.helper";

describe("Tests related to frequencyConverter basic return types", () => {
  test("Entering a valid number returns a string", () => {
    expect(typeof convertFrequency(1)).toBe("string");
  });
  test("Entering a valid string returns a number", () => {
    expect(typeof convertFrequency("daily")).toBe("number");
  });
});
describe("Tests related to frequencyConverter error handling", () => {
  test("Entering an invalid number throws an error", () => {
    //@ts-ignore
    expect(() => convertFrequency(100)).toThrowError(
      "Parameter is not a valid 'frequency_id' value"
    );
  });
  test("Entering an invalid string throws an error", () => {
    //@ts-ignore
    expect(() => convertFrequency("millennially")).toThrowError(
      "Parameter is not a valid 'repeats_every' value"
    );
  });
  test("Entering an array of values throws an error", () => {
    expect(() =>
      //@ts-ignore
      convertFrequency(["daily", "weekly", "fortnightly"])
    ).toThrowError(
      "Parameter must be either a string or a number that matches a value dictated by either 'frequency_id' or 'repeats_every'"
    );
  });
  test("Entering an empty object throws an error", () => {
    expect(() =>
      //@ts-ignore
      convertFrequency({})
    ).toThrowError(
      "Parameter must be either a string or a number that matches a value dictated by either 'frequency_id' or 'repeats_every'"
    );
  });
  test("Entering a valid number as a string type throws an error", () => {
    //@ts-ignore
    expect(() => convertFrequency("1")).toThrowError(
      "Parameter is not a valid 'repeats_every' value"
    );
  });
});
/*
 * Unit testing for all 14 bidirectional outcomes
 * This function is critical to data being written correctly
 */
describe("Tests related to frequencyConverter expected behaviours", () => {
  // Number => String conversions
  test("Entering a value of 1 returns the string value 'daily'", () => {
    expect(convertFrequency(1)).toBe("daily");
  });
  test("Entering a value of 2 returns the string value 'weekly'", () => {
    expect(convertFrequency(2)).toBe("weekly");
  });
  test("Entering a value of 3 returns the string value 'fortnightly'", () => {
    expect(convertFrequency(3)).toBe("fortnightly");
  });
  test("Entering a value of 4 returns the string value 'monthly'", () => {
    expect(convertFrequency(4)).toBe("monthly");
  });
  test("Entering a value of 5 returns the string value 'triannually'", () => {
    expect(convertFrequency(5)).toBe("triannually");
  });
  test("Entering a value of 6 returns the string value 'biannually'", () => {
    expect(convertFrequency(6)).toBe("biannually");
  });
  test("Entering a value of 7 returns the string value 'annually'", () => {
    expect(convertFrequency(7)).toBe("annually");
  });
  // String => Number conversions
  test("Entering a value of 'daily' returns the number 1", () => {
    expect(convertFrequency("daily")).toBe(1);
  });
  test("Entering a value of 'weekly' returns the number 2", () => {
    expect(convertFrequency("weekly")).toBe(2);
  });
  test("Entering a value of 'fortnightly' returns the number 3", () => {
    expect(convertFrequency("fortnightly")).toBe(3);
  });
  test("Entering a value of 'monthly' returns the number 4", () => {
    expect(convertFrequency("monthly")).toBe(4);
  });
  test("Entering a value of 'triannually' returns the number 5", () => {
    expect(convertFrequency("triannually")).toBe(5);
  });
  test("Entering a value of 'biannually' returns the number 6", () => {
    expect(convertFrequency("biannually")).toBe(6);
  });
  test("Entering a value of 'annually' returns the number 7", () => {
    expect(convertFrequency("annually")).toBe(7);
  });
});

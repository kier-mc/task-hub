// Vitest
import { vi, describe, test, expect, beforeEach } from "vitest";
// Pinia
import { setActivePinia, createPinia } from "pinia";
// Functions to be tested
import { $units } from "~/composables/helper.units";

// Initialise Pinia; conversion functions call it for locales data
setActivePinia(createPinia());

describe("Tests related to temperature conversion", () => {
  const cases = [0, 273.15, 298.15, 373.15, 311, 200, 250, 350, 400, 500];
  const expected = {
    celsius: [
      "-273.2 °C",
      "0.0 °C",
      "25.0 °C",
      "100.0 °C",
      "37.9 °C",
      "-73.1 °C",
      "-23.1 °C",
      "76.9 °C",
      "126.9 °C",
      "226.9 °C",
    ],
    fahrenheit: [
      "-459.4 °F",
      "32.3 °F",
      "77.3 °F",
      "212.3 °F",
      "100.4 °F",
      "-99.4 °F",
      "-9.4 °F",
      "170.6 °F",
      "260.6 °F",
      "440.6 °F",
    ],
  };
  test("Units are correctly converted to celsius, formatted and returned", () => {
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.temperature.format(number, "c");
      expect(result).toEqual(expected.celsius[i]);
    }
  });
  test("Units are correctly converted to fahrenheit, formatted and returned", () => {
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.temperature.format(number, "f");
      expect(result).toEqual(expected.fahrenheit[i]);
    }
  });
  test("Units are correctly formatted and returned when kelvin is specified", () => {
    const format = / K$/;
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.temperature.format(number, "k");
      expect(format.test(result)).toEqual(true);
    }
  });
});

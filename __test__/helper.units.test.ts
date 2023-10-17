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

describe("Tests related to speed conversion", () => {
  const cases = [72.35, 41, 89.76, 6.24, 93, 17.51, 50, 28.93, 4.62, 81];
  const expected = {
    kmh: [
      "260.5 km/h",
      "147.6 km/h",
      "323.1 km/h",
      "22.5 km/h",
      "334.8 km/h",
      "63.0 km/h",
      "180.0 km/h",
      "104.1 km/h",
      "16.6 km/h",
      "291.6 km/h",
    ],
    kn: [
      "140.6 kn",
      "79.7 kn",
      "174.5 kn",
      "12.1 kn",
      "180.8 kn",
      "34.0 kn",
      "97.2 kn",
      "56.2 kn",
      "9.0 kn",
      "157.5 kn",
    ],
    mph: [
      "161.8 mph",
      "91.7 mph",
      "200.8 mph",
      "14.0 mph",
      "208.0 mph",
      "39.2 mph",
      "111.8 mph",
      "64.7 mph",
      "10.3 mph",
      "181.2 mph",
    ],
  };
  test("Units are correctly converted to km/h, formatted and returned", () => {
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.speed.format(number, "kmh");
      expect(result).toEqual(expected.kmh[i]);
    }
  });
  test("Units are correctly converted to kn, formatted and returned", () => {
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.speed.format(number, "kn");
      expect(result).toEqual(expected.kn[i]);
    }
  });
  test("Units are correctly converted to mph, formatted and returned", () => {
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.speed.format(number, "mph");
      expect(result).toEqual(expected.mph[i]);
    }
  });
  test("Units are correctly formatted and returned when m/s is specified", () => {
    const format = / m\/s$/;
    for (let i = 0; i < cases.length; i++) {
      const number = cases[i];
      const result = $units.speed.format(number, "ms");
      expect(format.test(result)).toEqual(true);
    }
  });
});

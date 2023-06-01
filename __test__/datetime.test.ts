/* Vitest imports */
import { describe, test, expect, beforeAll, beforeEach } from "vitest";
/* Functions to be tested */
import { convertDate, convertTime } from "composables/datetime";

/*
 * All array items contain the same date (yyyy/mm/dd), with increasing granularity
 * Times are marked with ascending numbers that correspond to each different unit of time for legibility
 * Each should evaluate to the same date and time
 *
 * 1) Date
 * 2) Date and time (hh/mm)
 * 3) Date and time (hh/mm/ss)
 * 4) Date and time (hh/mm/ss/SSS to millisecond precision)
 * 5) Date and time (hh/mm/ss/SSS to microsecond precision)
 * 6) Date and time (hh/mm/ss/SSS to microsecond precision) with timezone (+00:00 / UTC)
 * 7) Date and time (hh/mm/ss/SSS to microsecond precision) with timezone designator (Z / UTC)
 */
const compliantISO8601StringDates = [
  "2023-01-10",
  "2023-01-10T00:10",
  "2023-01-10T00:10:20",
  "2023-01-10T00:10:20.300",
  "2023-01-10T00:10:20.300000",
  "2023-01-10T00:10:20.300000+00:00",
  "2023-01-10T00:10:20.300000Z",
];

describe("Tests related to date conversion types", () => {
  compliantISO8601StringDates.forEach((date) => {
    test("Valid ISO 8601 strings return a string", () => {
      expect(typeof convertDate(date)).toBe("string");
    });
  });
  compliantISO8601StringDates.forEach((date) => {
    test("Valid ISO 8601 Date objects return a string", () => {
      const dateObject = new Date(date);
      expect(typeof convertDate(dateObject)).toBe("string");
    });
  });
  compliantISO8601StringDates.forEach((date) => {
    test("Different string representations of the same valid ISO 8601 date string return the same output string", () => {
      expect(convertDate(date)).toBe("2023-01-10");
    });
  });
  compliantISO8601StringDates.forEach((date) => {
    test("Different Date object representations of the same valid ISO 8601 date string return the same output string", () => {
      const dateObject = new Date(date);
      expect(convertDate(dateObject)).toBe("2023-01-10");
    });
  });
});

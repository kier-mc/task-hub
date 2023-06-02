/* Vitest imports */
import { describe, test, expect, beforeAll, beforeEach } from "vitest";
/* Functions to be tested */
import { convertDate, convertTime } from "composables/datetime";

/*
 * All array items contain the same date (yyyy/mm/dd), with increasing granularity
 * Times are marked with ascending numbers that correspond to each different unit of time for legibility
 * Each should evaluate to the same date, with different times
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
/*
 * Contains BCP 47 codes that use different formatting for their dates
 * Each test section that uses these locale codes contains a matching array that contains the expected assertions
 */
const exampleBCP47Countries = ["en-GB", "en-US", "de-DE", "ja-JP", "ar-SA"];

describe("Tests related to calling convertDate with no optional arguments", () => {
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
describe("Tests related to calling convertDate with different locales", () => {
  const dateString = compliantISO8601StringDates[0];
  /*
   * 1) dd/mm/yyyy - English, Great Britain
   * 2) mm/dd/yyyy - English, United States
   * 3) dd.mm.yyyy - German, Germany
   * 4) yyyy/mm/dd - Japanese, Japan
   * 5) yyyy/mm/dd - Arabic, Saudi Arabia
   *
   * The Saudi Arabian date is expected in the Islamic Hirji calendar format
   * 2023-01-10 will become 17/6/1444, returned in Arabic
   */
  const expectedDates = [
    "10/01/2023",
    "1/10/2023",
    "10.1.2023",
    "2023/1/10",
    "١٧‏/٦‏/١٤٤٤ هـ",
  ];
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("Identical string representations of the same valid ISO 8601 date string return localised output strings", () => {
      const locale = exampleBCP47Countries[i];
      const assertion = expectedDates[i];
      expect(convertDate(dateString, locale)).toBe(assertion);
    });
  }
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("Identical Date object representations of the same valid ISO 8601 date string return localised output strings", () => {
      const dateObject = new Date(dateString);
      const locale = exampleBCP47Countries[i];
      const assertion = expectedDates[i];
      expect(convertDate(dateObject, locale)).toBe(assertion);
    });
  }
});
describe("Tests related to calling convertDate with different Intl.DateTimeFormatOptions arguments", () => {
  const dateString = compliantISO8601StringDates[0];
  const expectedWeekdays = [
    "Tuesday",
    "Tuesday",
    "Dienstag",
    "火曜日",
    "الثلاثاء",
  ];
  const expectedMonths = [
    "January",
    "January",
    "Januar",
    "1月",
    "جمادى الآخرة",
  ];
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("The correct weekday string is established from the ISO 8601 date string for different locales", () => {
      const locale = exampleBCP47Countries[i];
      const assertion = expectedWeekdays[i];
      expect(convertDate(dateString, locale, { weekday: "long" })).toBe(
        assertion
      );
    });
  }
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("The correct month string is established from the ISO 8601 date string for different locales", () => {
      const locale = exampleBCP47Countries[i];
      const assertion = expectedMonths[i];
      expect(convertDate(dateString, locale, { month: "long" })).toBe(
        assertion
      );
    });
  }
});
describe("Tests related to calling convertTime with no optional arguments", () => {
  // Milliseconds and smaller fractional units are expected to be cropped from the return string when no additional arguments are specified
  const expectedTimes = [
    "00:00:00",
    "00:10:00",
    "00:10:20",
    "00:10:20",
    "00:10:20",
    "00:10:20",
    "00:10:20",
  ];
  compliantISO8601StringDates.forEach((time) => {
    test("Valid ISO 8601 strings return a string", () => {
      expect(typeof convertTime(time)).toBe("string");
    });
  });
  compliantISO8601StringDates.forEach((time) => {
    test("Valid ISO 8601 Date objects return a string", () => {
      const dateObject = new Date(time);
      expect(typeof convertTime(dateObject)).toBe("string");
    });
  });
  for (let i = 0; i < compliantISO8601StringDates.length; i++) {
    const time = compliantISO8601StringDates[i];
    const assertion = expectedTimes[i];
    test("Valid ISO 8601 strings return different times depending on degrees of precision", () => {
      expect(convertTime(time)).toBe(assertion);
    });
  }
  for (let i = 0; i < compliantISO8601StringDates.length; i++) {
    const time = new Date(compliantISO8601StringDates[i]);
    const assertion = expectedTimes[i];
    test("Valid ISO 8601 Date objects return different times depending on degrees of precision", () => {
      expect(convertTime(time)).toBe(assertion);
    });
  }
});
describe("Tests related to calling convertTime with different locales", () => {
  const expectedTimes = [
    "00:00:00",
    "12:10:00 AM",
    "00:10:20",
    "0:10:20",
    "١٢:١٠:٢٠ ص",
  ];
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("Identical string representations of the same valid ISO 8601 date string return localised output strings", () => {
      const timeString = compliantISO8601StringDates[i];
      const locale = exampleBCP47Countries[i];
      const assertion = expectedTimes[i];
      expect(convertTime(timeString, locale)).toBe(assertion);
    });
  }
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("Identical Date object representations of the same valid ISO 8601 date string return localised output strings", () => {
      const timeString = new Date(compliantISO8601StringDates[i]);
      const locale = exampleBCP47Countries[i];
      const assertion = expectedTimes[i];
      expect(convertTime(timeString, locale)).toBe(assertion);
    });
  }
});
describe("Tests related to calling convertTime with different Intl.DateTimeFormatOptions arguments", () => {
  const expectedHours = ["00", "12 AM", "00 Uhr", "0時", "١٢ ص"];
  const expectedMinutes = ["0", "10", "10", "10", "١٠"];
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("The correct hour string is established from the ISO 8601 date string for different locales", () => {
      const timeString = compliantISO8601StringDates[i];
      const locale = exampleBCP47Countries[i];
      const assertion = expectedHours[i];
      expect(convertTime(timeString, locale, { hour: "numeric" })).toBe(
        assertion
      );
    });
  }
  for (let i = 0; i < exampleBCP47Countries.length; i++) {
    test("The correct minute string is established from the ISO 8601 date string for different locales", () => {
      const timeString = compliantISO8601StringDates[i];
      const locale = exampleBCP47Countries[i];
      const assertion = expectedMinutes[i];
      expect(convertTime(timeString, locale, { minute: "numeric" })).toBe(
        assertion
      );
    });
  }
});

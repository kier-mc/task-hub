/**
 * Helper function to determine if a string is a valid ISO 8601 timestamp.
 * Leverages [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
 * to parse the date string and asserts its validity.
 * If the parsed result is NaN, the timestamp is deemed invalid.
 * @param dateString {string} - ISO 8601 timestamp to be tested
 * @returns {boolean} - "true" if the input string is a valid ISO 8601 timestamp, otherwise "false"
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse}
 */
function isISO8601(dateString: string): boolean {
  return !isNaN(Date.parse(dateString));
}
/**
 * Accepts an ISO 8601 timestamp and returns only the date.
 * Calls {@link isISO8601()} to validate the dateString parameter, and leverages
 * [Date.prototype.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) to format the returned string.
 * @param dateString {string|Date} - ISO 8601 timestamp to be converted. Can be a string or a Date object.
 * @param {Intl.LocalesArgument} [locale] - An optional [locales argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument),
 * which will be passed to [Date.prototype.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString)
 * to determine the formatting of the return value. If this parameter isn't supplied, the format will default to the ISO 8601 standard (YYYY/MM/DD).
 * @param {Intl.DateTimeFormatOptions} [dateTimeFormatOptions] - An optional object that contains
 * [dateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options)
 * which will be passed to [Date.prototype.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString).
 * @returns {(void|string)} - The date portion of the timestamp only.
 * This will default to the ISO 8601 standard (YYYY/MM/DD) if no other parameters are supplied. Returns void if the input cannot be parsed.
 */
export function convertDate(
  dateString: string | Date,
  locale?: Intl.LocalesArgument,
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions
): void | string {
  if (typeof dateString === "string") {
    if (!isISO8601(dateString)) return;
  }
  const date = new Date(dateString);
  if (locale) {
    if (dateTimeFormatOptions) {
      return date.toLocaleDateString(locale, dateTimeFormatOptions);
    }
    return date.toLocaleDateString(locale);
  }
  // Swedish dates are ISO 8601 compliant 🇸🇪
  return date.toLocaleDateString("sv-SE");
}
/**
 * Accepts an ISO 8601 timestamp and returns only the time.
 * Calls {@link isISO8601()} to validate the dateString parameter, and leverages
 * [Date.prototype.toLocaleTimeString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString) to format the returned string.
 * @param dateString {string|Date} - ISO 8601 timestamp to be converted. Can be a string or a Date object.
 * @param {Intl.LocalesArgument} [locale] - An optional [locales argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument),
 * which will be passed to [Date.prototype.toLocaleTimeString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString)
 * to determine the formatting of the return value. If this parameter isn't supplied, the format will default to the ISO 8601 standard (HH/mm).
 * @param {Intl.DateTimeFormatOptions} [dateTimeFormatOptions] - An optional object that contains
 * [dateTimeFormatOptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options)
 * which will be passed to [Date.prototype.toLocaleTimeString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString).
 * @returns {(void|string)} - The time portion of the timestamp only.
 * This will default to the ISO 8601 standard (HH/mm) if no other parameters are supplied. Returns void if the input cannot be parsed.
 */
export function convertTime(
  dateString: string | Date,
  locale?: Intl.LocalesArgument,
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions
): void | string {
  if (typeof dateString === "string") {
    if (!isISO8601(dateString)) return;
  }
  const date = new Date(dateString);
  if (locale) {
    if (dateTimeFormatOptions) {
      return date.toLocaleTimeString(locale, dateTimeFormatOptions);
    }
    return date.toLocaleTimeString(locale);
  }
  // Swedish time is ISO 8601 compliant 🇸🇪
  return date.toLocaleTimeString("sv-SE");
}

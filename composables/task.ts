/**
 * Converts between string/numeric representations of database frequencies
 * i.e. "1" becomes "daily" and "daily" becomes "1".
 * Ensures values make sense to either the database or the user, depending on who is reading.
 * @param value {number|string} number or string to be converted
 * @returns {string|number} a string or a number, depending on param
 */
export function convertFrequency(value: number | string): string | number {
  // Lookup label via ID
  const frequencyLabels: Record<
    Database["frequency"]["frequency_id"],
    Database["frequency"]["repeats_every"]
  > = {
    1: "daily",
    2: "weekly",
    3: "fortnightly",
    4: "monthly",
    5: "triannually",
    6: "biannually",
    7: "annually",
  };
  // Lookup ID via label
  const frequencyIDs: Record<
    Database["frequency"]["repeats_every"],
    Database["frequency"]["frequency_id"]
  > = {
    daily: 1,
    weekly: 2,
    fortnightly: 3,
    monthly: 4,
    triannually: 5,
    biannually: 6,
    annually: 7,
  };
  if (typeof value === "number") {
    return frequencyLabels[value as keyof typeof frequencyLabels];
  } else if (typeof value === "string") {
    return frequencyIDs[value as keyof typeof frequencyIDs];
  } else {
    throw new Error("Parameter must be either a string or a number");
  }
}

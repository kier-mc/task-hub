/**
 * Converts between string/numeric representations of database frequencies
 * i.e. "1" becomes "daily" and "daily" becomes "1".
 * Ensures inputs make sense to either the database or the user, depending on who is reading.
 * @param input {number|string} number or string to be converted
 * @returns {string|number} a string or a number, depending on param
 */
export function convertFrequency(
  input: FrequencyID | FrequencyRepetition
): FrequencyRepetition | FrequencyID {
  // Lookup label via ID
  const frequencyLabels: Record<FrequencyID, FrequencyRepetition> = {
    1: "daily",
    2: "weekly",
    3: "fortnightly",
    4: "monthly",
    5: "triannually",
    6: "biannually",
    7: "annually",
  };
  // Lookup ID via label
  const frequencyIDs: Record<FrequencyRepetition, FrequencyID> = {
    daily: 1,
    weekly: 2,
    fortnightly: 3,
    monthly: 4,
    triannually: 5,
    biannually: 6,
    annually: 7,
  };

  if (typeof input === "number") {
    if (input in frequencyLabels) {
      return frequencyLabels[input as keyof typeof frequencyLabels];
    } else throw new Error("Parameter is not a valid 'frequency_id' value");
  } else if (typeof input === "string") {
    if (input in frequencyIDs) {
      return frequencyIDs[input as keyof typeof frequencyIDs];
    } else throw new Error("Parameter is not a valid 'repeats_every' value");
  } else {
    throw new Error(
      "Parameter must be either a string or a number that matches a value dictated by either 'frequency_id' or 'repeats_every'"
    );
  }
}

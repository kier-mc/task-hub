/**
 * Auth helper function that iterates through all values of an object and ensures
 * that the value is not falsy. If any value is falsy, it has not been populated
 * by the user and thus is guaranteed to be invalid. Utilised as part of a guard
 * clause to avoid pointless calls to the Supabase endpoint when failure is
 * guaranteed.
 * @param credentials {Ref<NewAccountDataObject>|Ref<LoginCredentialsDataObject>}
 * The credentials to iterate over and check for truthiness.
 * @returns {boolean} A boolean response based on whether or not all fields are
 * populated.
 */
export function allCredentialFieldsArePopulated(
  credentials:
    | Ref<PartialNewAccountCredentialData>
    | Ref<PartialTaskData>
    | Ref<EmitData>
    | Ref<EmitTaskFrequencyData>
    | Ref<EmitCountryData>
    | Ref<LoginCredentialsData>
    | (
        | Ref<PartialNewAccountCredentialData>
        | Ref<PartialTaskData>
        | Ref<EmitData>
        | Ref<EmitTaskFrequencyData>
        | Ref<EmitCountryData>
        | Ref<LoginCredentialsData>
      )[]
): boolean {
  const checkFields = (object: any): boolean => {
    if (Array.isArray(object)) {
      for (const item of object) {
        if (!checkFields(item)) {
          return false;
        }
      }
    } else {
      for (const value of Object.values(object)) {
        if (typeof value === "object" && value !== null) {
          if (!checkFields(value)) {
            return false;
          }
        } else {
          if (!value) {
            return false;
          }
        }
      }
    }
    return true;
  };
  if (Array.isArray(credentials)) {
    for (const credential of credentials) {
      if (!checkFields(credential.value)) {
        return false;
      }
    }
  } else {
    return checkFields(credentials.value);
  }
  return true;
}

/**
 * Helper function to wipe credentials object once login/account creation submissions occur.
 * Iterates over all key/value pairs in the supplied parameter and sets the values to undefined.
 * Uses recursion to traverse deeply-nested structures. Can iterate over either an individual
 * object or an array of objects.
 * @param credentials {
 *    | Ref<RawNewAccountCredentialData>
 *    | Ref<AutocompleteCountryData>
 *    | Ref<LoginCredentialsData>
 *    | (
 *      | Ref<RawNewAccountCredentialData>
 *      | Ref<AutocompleteCountryData>
 *      | Ref<LoginCredentialsData>
 *    )[]
 * }
 * Object or array of objects containing data to erase.
 */
export function clearCredentials(
  credentials:
    | Ref<PartialNewAccountCredentialData>
    | Ref<PartialTaskData>
    | Ref<EmitData>
    | Ref<EmitTaskFrequencyData>
    | Ref<EmitCountryData>
    | Ref<LoginCredentialsData>
    | (
        | Ref<PartialNewAccountCredentialData>
        | Ref<PartialTaskData>
        | Ref<EmitData>
        | Ref<EmitTaskFrequencyData>
        | Ref<EmitCountryData>
        | Ref<LoginCredentialsData>
      )[]
): void {
  const clearObject = (object: Record<string, any>): void => {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (typeof value === "object" && value !== null) {
          clearObject(value);
        }
        object[key] = undefined;
      }
    }
  };
  if (Array.isArray(credentials)) {
    for (const credential of credentials) {
      clearObject(credential.value);
    }
  } else {
    clearObject(credentials.value);
  }
}

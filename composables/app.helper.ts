/**
 * A helper function that iterates over an array of all countries (countriesHelper) and
 * adds the values to an object. The object mimics part of the prop data that would be
 * supplied to the FormHandler component to generate either a select element (with the
 * countries as option elements), or to generate an autocomplete custom element.
 * @returns {Array<CompFormOptionsObject>} An array containing individual options in a
 * format that is parsable by the FormHandler component.
 */
export function generateCountryData(): Array<FormHandlerOptionsData> {
  const payload = [];
  for (let i = 0; i < countriesHelper.length; i++) {
    const dataObject: FormHandlerOptionsData = {
      value: "",
      label: "",
    };
    dataObject.value = countriesHelper[i];
    dataObject.label = countriesHelper[i];
    payload.push(dataObject);
  }
  return payload;
}

/**
 * Auth helper function that iterates through all values of an object and ensures
 * that the value is not falsy. If any value is falsy, it has not been populated
 * by the user and thus is guaranteed to be invalid. Utilised as part of a guard
 * clause to avoid pointless calls to the Supabase endpoint when failure is
 * guaranteed.
 * @param inputRef {Ref<any> | Ref<any>[]}
 * The inputRef to iterate over and check for truthiness.
 * @returns {boolean} A boolean response based on whether or not all fields are
 * populated.
 */
export function allFieldsArePopulated(
  inputRef: Ref<any> | Ref<any>[]
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
  if (Array.isArray(inputRef)) {
    for (const credential of inputRef) {
      if (!checkFields(credential.value)) {
        return false;
      }
    }
  } else {
    return checkFields(inputRef.value);
  }
  return true;
}

/**
 * Helper function to wipe inputRef object once login/account creation submissions occur.
 * Iterates over all key/value pairs in the supplied parameter and sets the values to undefined.
 * Uses recursion to traverse deeply-nested structures. Can iterate over either an individual
 * object or an array of objects.
 * @param inputRef {Ref<any> | Ref<any>[]}
 * Object or array of objects containing data to erase.
 */
export function clearAllFields(inputRef: Ref<any> | Ref<any>[]): void {
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
  if (Array.isArray(inputRef)) {
    for (const credential of inputRef) {
      clearObject(credential.value);
    }
  } else {
    clearObject(inputRef.value);
  }
}

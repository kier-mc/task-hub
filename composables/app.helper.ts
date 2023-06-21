/**
 * A helper function that iterates over an array of all countries (countriesHelper) and
 * adds the values to an object. The object mimics part of the prop data that would be
 * supplied to the FormHandler component to generate either a select element (with the
 * countries as option elements), or to generate an autocomplete custom element.
 * @returns {Array<CompFormOptionsObject>} An array containing individual options in a
 * format that is parsable by the FormHandler component.
 */
export function generateCountryData(): Array<CompFormOptionsObject> {
    const payload = [];
    for (let i = 0; i < countriesHelper.length; i++) {
      const dataObject: CompFormOptionsObject = {
        value: "",
        label: "",
      };
      dataObject.value = countriesHelper[i];
      dataObject.label = countriesHelper[i];
      payload.push(dataObject);
    }
    return payload;
  }
export const $app = {
  /**
   * Iterates through all values of a reactive object and checks for any value
   * that is falsy.
   * @param inputRef {Ref<any> | Ref<any>[]}
   * The a ref or array of refs to iterate over and check for truthiness.
   * @returns {boolean}
   * A boolean response based on whether or not a falsy value was detected.
   */
  allRefValuesArePopulated: (inputRef: Ref<any> | Ref<any>[]): boolean => {
    const checkValues = (object: any): boolean => {
      if (Array.isArray(object)) {
        for (const item of object) {
          if (!checkValues(item)) {
            return false;
          }
        }
      } else {
        for (const value of Object.values(object)) {
          if (typeof value === "object" && value !== null) {
            if (!checkValues(value)) {
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
        if (!checkValues(credential.value)) {
          return false;
        }
      }
    } else {
      return checkValues(inputRef.value);
    }
    return true;
  },
};

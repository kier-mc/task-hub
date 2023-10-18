export const $app = {
  /**
   * Iterates through all values of a reactive object and checks for any value
   * that is falsy. Will return true if no falsy values were detected.
   * @param inputRef {Ref<any>}
   * The a ref object to iterate over and check for truthiness.
   * @returns {boolean}
   * A boolean response based on the evaluation.
   */
  allRefValuesArePopulated: (input: Ref<any>) => {
    const data = input.value;
    const test = (value: any) => !value;
    return !Object.values(data).some(test);
  },
};

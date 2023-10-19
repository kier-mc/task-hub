// Vitest
import { describe, test, expect, expectTypeOf } from "vitest";

// Functions to be tested
import { $countries, COUNTRY_DATA } from "~/composables/helper.countries";

describe("Tests related to searching through COUNTRY_DATA", () => {
  // Selected at random
  const cases = [
    { ...COUNTRY_DATA[34] }, // Bulgaria
    { ...COUNTRY_DATA[53] }, // Costa Rica
    { ...COUNTRY_DATA[127] }, // Liechtenstein
    { ...COUNTRY_DATA[191] }, // Samoa
    { ...COUNTRY_DATA[203] }, // Solomon Islands
  ];
  test("Searching with a valid country ID returns the expected data", () => {
    for (let i = 0; i < cases.length; i++) {
      const id = cases[i].country_id;
      const name = cases[i].country_name;
      const code = cases[i].iso_code;

      const data = $countries.searchByID(id);

      expect(data.country_id).toBe(id);
      expect(data.country_name).toBe(name);
      expect(data.iso_code).toBe(code);
    }
  });
  test("Searching with an invalid country ID throws an exception", () => {
    const badID = -1;
    expect(() =>
      $countries
        // TS will warn because an valid IDs are union typed
        // @ts-ignore
        .searchByID(badID)
    ).toThrowError(`Cannot locate data using country ID '${badID}'`);
  });
  test("Searching with a valid country name returns the expected data", () => {
    for (let i = 0; i < cases.length; i++) {
      const id = cases[i].country_id;
      const name = cases[i].country_name;
      const code = cases[i].iso_code;

      const data = $countries.searchByCountryName(name);

      expect(data.country_id).toBe(id);
      expect(data.country_name).toBe(name);
      expect(data.iso_code).toBe(code);
    }
  });
  test("Searching with an invalid country name throws an exception", () => {
    const badName = "Nonexistent Country";
    expect(() =>
      $countries
        // TS will warn because an valid names are union typed
        // @ts-ignore
        .searchByCountryName(badName)
    ).toThrowError(`Cannot locate data using country name '${badName}'`);
  });
  test("Searching with a valid country iso code returns the expected data", () => {
    for (let i = 0; i < cases.length; i++) {
      const id = cases[i].country_id;
      const name = cases[i].country_name;
      const code = cases[i].iso_code;

      const data = $countries.searchByISOCode(code);

      expect(data.country_id).toBe(id);
      expect(data.country_name).toBe(name);
      expect(data.iso_code).toBe(code);
    }
  });
  test("Searching with an invalid ISO code throws an exception", () => {
    const badCode = "AA";
    expect(() =>
      $countries
        // TS will warn because an valid names are union typed
        // @ts-ignore
        .searchByISOCode(badCode)
    ).toThrowError(`Cannot locate data using ISO code '${badCode}'`);
  });
});

describe("Tests related to generating autocomplete data", () => {
  // Selected at random
  const cases = [
    { ...COUNTRY_DATA[16] }, // Bahamas
    { ...COUNTRY_DATA[66] }, // El Salvador
    { ...COUNTRY_DATA[81] }, // Georgia
    { ...COUNTRY_DATA[135] }, // Maldives
    { ...COUNTRY_DATA[218] }, // Tajikistan
  ];
  const cache: number[] = [];
  /**
   * Scoped helper function to generate random integers between zero and the
   * length of the TAG_DATA array. Used to produce random combinations of tags
   * for the test suite.
   * @returns {number}
   * A random integer between 0 and TAG.DATA.length
   */
  function getRandomInt(): number {
    const length = COUNTRY_DATA.length - 1;
    let number: number = 0;
    while (true) {
      number = Math.floor(Math.random() * (length + 1));
      if (!cache.includes(number)) {
        cache.push(number);
        break;
      }
    }
    return number;
  }
  test("The return format contains correctly-shaped data", () => {
    const data = $countries.generateAutocompleteData();
    const index = getRandomInt();
    expect(data[index]).toHaveProperty("term");
    expect(data[index]).toHaveProperty("data");
    expect(data[index].data).toHaveProperty("country_id");
    expect(data[index].data).toHaveProperty("country_name");
    expect(data[index].data).toHaveProperty("iso_code");
  });
  test("The return format contains the correct data", () => {
    const data = $countries.generateAutocompleteData();
    for (let i = 0; i < cases.length; i++) {
      const index = cases[i].country_id - 1;

      const term = data[index].term;
      const id = data[index].data?.country_id;
      const name = data[index].data?.country_name;
      const code = data[index].data?.iso_code;

      expect(cases[i].country_name).toBe(term);
      expect(cases[i].country_id).toBe(id);
      expect(cases[i].country_name).toBe(name);
      expect(cases[i].iso_code).toBe(code);
    }
  });
});

describe("Tests related to getters", () => {
  const cache: number[] = [];
  /**
   * Scoped helper function to generate random integers between zero and the
   * length of the TAG_DATA array. Used to produce random combinations of tags
   * for the test suite.
   * @returns {number}
   * A random integer between 0 and TAG.DATA.length
   */
  function getRandomInt(): number {
    const length = COUNTRY_DATA.length - 1;
    let number: number = 0;
    while (true) {
      number = Math.floor(Math.random() * (length + 1));
      if (!cache.includes(number)) {
        cache.push(number);
        break;
      }
    }
    return number;
  }
  test("getData returns the complete data set", () => {
    expect($countries.getData.length).toBe(COUNTRY_DATA.length);
  });
  test("getIDs returns only the country IDs as an array", () => {
    expectTypeOf($countries.getIDs).toBeArray();
  });
  test("A randomly sampled value returned via getIDs is of type 'number'", () => {
    const index = getRandomInt();
    expectTypeOf($countries.getIDs[index]).toBeNumber();
  });
  test("An ID returned via getIDs correlates with COUNTRY_DATA", () => {
    const index = getRandomInt();
    expect($countries.getIDs[index]).toBe(COUNTRY_DATA[index].country_id);
  });
  test("getNames returns only the country names as an array", () => {
    expectTypeOf($countries.getNames).toBeArray();
  });
  test("A randomly sampled value returned via getNames is of type 'string'", () => {
    const index = getRandomInt();
    expectTypeOf($countries.getNames[index]).toBeString();
  });
  test("A country name returned via getNames correlates with COUNTRY_DATA", () => {
    const index = getRandomInt();
    expect($countries.getNames[index]).toBe(COUNTRY_DATA[index].country_name);
  });
  test("getISOCodes returns only the ISO codes as an array", () => {
    expectTypeOf($countries.getISOCodes).toBeArray();
  });
  test("A randomly sampled value returned via getISOCodes is of type 'string'", () => {
    const index = getRandomInt();
    expectTypeOf($countries.getISOCodes[index]).toBeString();
  });
  test("A country ISO code returned via getISOCodes correlates with COUNTRY_DATA", () => {
    const index = getRandomInt();
    expect($countries.getISOCodes[index]).toBe(COUNTRY_DATA[index].iso_code);
  });
});

// Vitest
import { describe, test, expect, expectTypeOf, beforeEach } from "vitest";
// Functions for testing
import {
  $tasks,
  FREQUENCY_DATA,
  FREQUENCY_TERMS,
  TAG_DATA,
} from "~/composables/helper.tasks";

describe("Tests related to constant declarations", () => {
  test("FREQUENCY_DATA and FREQUENCY_TERMS should be identical in length", () => {
    expect(Object.keys(FREQUENCY_DATA).length).toEqual(FREQUENCY_TERMS.length);
  });
  test("FREQUENCY_DATA should return a string value for each key", () => {
    const length = Object.keys(FREQUENCY_DATA).length + 1;
    for (let i = 1; i < length; i++) {
      // @ts-ignore
      expectTypeOf(FREQUENCY_DATA[i]).toBeString();
    }
  });
  test("FREQUENCY_TERMS should return a string value for each index", () => {
    for (let i = 0; i < FREQUENCY_TERMS.length; i++) {
      expectTypeOf(FREQUENCY_TERMS[i]).toBeString();
    }
  });
  test("TAG_DATA should return an array of objects", () => {
    for (let i = 1; i < TAG_DATA.length; i++) {
      expectTypeOf(TAG_DATA[i]).toBeObject();
    }
  });
  test("TAG_DATA object keys should all have assigned values", () => {
    for (let i = 1; i < TAG_DATA.length; i++) {
      expect(TAG_DATA[i].tag_id).toBeTruthy();
      expect(TAG_DATA[i].label).toBeTruthy();
      expect(TAG_DATA[i].type).toBeTruthy();
    }
  });
});

describe("Tests related to generating frequency autocomplete data", () => {
  test("The return type should be an array", () => {
    expectTypeOf($tasks.frequency.generateAutocompleteData()).toBeArray();
  });
  test("Data inside the returned array should be objects", () => {
    const data = $tasks.frequency.generateAutocompleteData();
    for (let i = 0; i < data.length; i++) {
      expectTypeOf(data[i]).toBeObject();
    }
  });
  test("All fields should be populated inside the data", () => {
    const data = $tasks.frequency.generateAutocompleteData();
    for (let i = 0; i < data.length; i++) {
      expect(data[i].term).toBeTruthy();
      expect(data[i].data!.frequency_id).toBeTruthy();
      expect(data[i].data!.repeats_every).toBeTruthy();
    }
  });
});

describe("Tests related to frequency data lookup", () => {
  test("Searching with a valid ID returns the expected label", () => {
    const length = Object.keys(FREQUENCY_DATA).length + 1;
    for (let i = 1; i < length; i++) {
      // @ts-ignore
      expect($tasks.frequency.getLabel(i)).toEqual(FREQUENCY_DATA[i]);
    }
  });
  test("Searching with a valid label returns the expected ID", () => {
    const length = Object.keys(FREQUENCY_DATA).length + 1;
    for (let i = 1; i < length; i++) {
      // @ts-ignore
      expect($tasks.frequency.getID(FREQUENCY_DATA[i])).toEqual(i);
    }
  });
});

describe("Tests related to generating tag prop data", () => {
  test("The return type should be an array", () => {
    expectTypeOf($tasks.tags.getPropData()).toBeArray();
  });
  test("Data inside the returned array should be objects", () => {
    const data = $tasks.tags.getPropData();
    for (let i = 0; i < data.length; i++) {
      expectTypeOf(data[i]).toBeObject();
    }
  });
  test("All fields should be populated inside the data", () => {
    const data = $tasks.tags.getPropData();
    for (let i = 0; i < data.length; i++) {
      expect(data[i].tag_id).toBeTruthy();
      expect(data[i].label).toBeTruthy();
      expect(data[i].type).toBeTruthy();
    }
  });
});

describe("Tasks related to generating database-ready tag data", () => {
  const cache: number[] = [];
  /**
   * Scoped helper function to generate random integers between zero and the
   * length of the TAG_DATA array. Used to produce random combinations of tags
   * for the test suite.
   * @returns {number}
   * A random integer between 0 and TAG.DATA.length
   */
  function getRandomInt(): number {
    const length = TAG_DATA.length - 1;
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
  beforeEach(() => {
    cache.splice(0, cache.length);
  });
  test("The return type should be an array", () => {
    const data = {
      taskID: 1,
      tags: [
        TAG_DATA[getRandomInt()],
        TAG_DATA[getRandomInt()],
        TAG_DATA[getRandomInt()],
      ],
    };
    expectTypeOf(
      $tasks.tags.prepareDataForDBInsert(data.taskID, data.tags)
    ).toBeArray();
  });
  test("Data inside the returned array should be objects", () => {
    const data = {
      taskID: 1,
      tags: [
        TAG_DATA[getRandomInt()],
        TAG_DATA[getRandomInt()],
        TAG_DATA[getRandomInt()],
      ],
    };
    const length = Object.keys(data).length;
    for (let i = 1; i < length; i++) {
      // @ts-ignore
      expectTypeOf(
        $tasks.tags.prepareDataForDBInsert(data.taskID, data.tags)[i]
      ).toBeObject();
    }
  });
  test("All fields should be populated inside the data", () => {
    const data = {
      taskID: 1,
      tags: [
        TAG_DATA[getRandomInt()],
        TAG_DATA[getRandomInt()],
        TAG_DATA[getRandomInt()],
      ],
    };
    const result = $tasks.tags.prepareDataForDBInsert(data.taskID, data.tags);
    for (let i = 0; i < result.length; i++) {
      expect(result[i].task_id).toBeTruthy();
      expect(result[i].tag_id).toBeTruthy();
    }
  });
});

describe("Tests related to tag data lookup", () => {
  const cache: number[] = [];
  /**
   * Scoped helper function to generate random integers between zero and the
   * length of the TAG_DATA array. Used to produce random combinations of tags
   * for the test suite.
   * @returns {number}
   * A random integer between 0 and TAG.DATA.length
   */
  function getRandomInt(): number {
    const length = TAG_DATA.length - 1;
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
  beforeEach(() => {
    cache.splice(0, cache.length);
  });
  test("Searching with a valid ID returns the expected data", () => {
    const length = Object.keys(TAG_DATA).length + 1;
    for (let i = 1; i < length; i++) {
      // @ts-ignore
      const data = $tasks.tags.searchByID(i);
      expect(data.tag_id).toEqual(i);
      expect(data.label).toEqual(TAG_DATA[i - 1].label);
      expect(data.type).toEqual(TAG_DATA[i - 1].type);
    }
  });
  test("Searching with a valid label returns the expected data", () => {
    const length = Object.keys(TAG_DATA).length + 1;
    for (let i = 1; i < length; i++) {
      const label = TAG_DATA[i - 1].label;
      // @ts-ignore
      const data = $tasks.tags.searchByLabel(label);
      expect(data.tag_id).toEqual(i);
      expect(data.label).toEqual(label);
      expect(data.type).toEqual(TAG_DATA[i - 1].type);
    }
  });
});

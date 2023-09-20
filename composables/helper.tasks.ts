// Types
import type { TagsTable, TagData } from "~/types/schema";
import type {
  FormTagPropData,
  AutocompleteEmitFrequencyData,
} from "~/types/components/forms";
import type {
  FrequencyID,
  FrequencyRepetition,
} from "~/types/unions/schema.frequency";
import type { TagID, TagLabel, TagType } from "~/types/unions/schema.tags";
import type { TaskObject } from "~/types/components/tasks";

const TAG_DATA = <Omit<TagsTable, "created_at">[]>[
  {
    tag_id: 1,
    label: "low priority",
    type: "priority",
  },
  {
    tag_id: 2,
    label: "high priority",
    type: "priority",
  },
  {
    tag_id: 3,
    label: "urgent",
    type: "priority",
  },
  {
    tag_id: 4,
    label: "personal",
    type: "context",
  },
  {
    tag_id: 5,
    label: "home",
    type: "context",
  },
  {
    tag_id: 6,
    label: "family",
    type: "context",
  },
  {
    tag_id: 7,
    label: "work",
    type: "context",
  },
  {
    tag_id: 8,
    label: "health",
    type: "category",
  },
  {
    tag_id: 9,
    label: "shopping",
    type: "category",
  },
  {
    tag_id: 10,
    label: "finance",
    type: "category",
  },
  {
    tag_id: 11,
    label: "study",
    type: "category",
  },
  {
    tag_id: 12,
    label: "social",
    type: "category",
  },
  {
    tag_id: 13,
    label: "travel",
    type: "category",
  },
];

const FREQUENCY_DATA = <Record<FrequencyID, FrequencyRepetition>>{
  1: "daily",
  2: "weekly",
  3: "fortnightly",
  4: "monthly",
  5: "triannually",
  6: "biannually",
  7: "annually",
};

const FREQUENCY_TERMS = [
  "Daily",
  "Weekly",
  "Fortnightly",
  "Monthly",
  "Every four months",
  "Every six months",
  "Yearly",
];

/**
 * A baseline filter function, intended for extension via other functions.
 * Iterates through all tags associated with a task and returns true if
 * the predicate is found.
 * @param task {TaskObject}
 * The current task is that being queried.
 * @param predicate {TagID}
 * A number (matching a predefined TagID) to search for.
 * @returns {TaskObject | undefined}
 * Any task that matches the predicate, or undefined if no matches are found.
 */
function tagFilter(task: TaskObject, predicate: TagID): TaskObject | undefined {
  if (!task.tags) return;
  for (let i = 0; i < task.tags.length; i++) {
    if (Object.values(task.tags).includes(predicate)) {
      return task;
    }
  }
  return;
}

export const $tasks = {
  frequency: {
    generateAutocompleteData: (): AutocompleteEmitFrequencyData[] => {
      const payload: AutocompleteEmitFrequencyData[] = [];
      for (const [key, value] of Object.entries(FREQUENCY_DATA)) {
        const id = parseInt(key);
        const item: AutocompleteEmitFrequencyData = {
          term: null,
          data: null,
        };
        item.term = FREQUENCY_TERMS[id - 1];
        item.data = {
          frequency_id: id as FrequencyID,
          repeats_every: value,
        };
        payload.push(item);
      }
      return payload;
    },
    getLabel: (id: FrequencyID): FrequencyRepetition => {
      if (!(id in FREQUENCY_DATA)) {
        throw new Error("Invalid frequency ID supplied");
      }
      return FREQUENCY_DATA[id];
    },
    getID: (label: FrequencyRepetition): FrequencyID => {
      for (const key in FREQUENCY_DATA) {
        const id = parseInt(key) as FrequencyID;
        if (FREQUENCY_DATA[id] === label) {
          return id;
        }
      }
      throw new Error("Invalid frequency label supplied");
    },
  },
  tags: {
    searchByID: (predicate: TagID): Omit<TagData, "created_at"> => {
      const payload: Omit<TagData, "created_at"> = {
        tag_id: null,
        label: null,
        type: null,
      };
      let start = 0;
      let end = TAG_DATA.length - 1;
      while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        if (TAG_DATA[mid].tag_id === predicate) {
          payload.tag_id = TAG_DATA[mid].tag_id;
          payload.label = TAG_DATA[mid].label;
          payload.type = TAG_DATA[mid].type;
          return payload;
        } else if (TAG_DATA[mid].tag_id < predicate) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }
      return payload;
    },
    searchByLabel: (predicate: TagLabel): Omit<TagData, "created_at"> => {
      const payload: Omit<TagData, "created_at"> = {
        tag_id: null,
        label: null,
        type: null,
      };
      for (let i = 0; i < TAG_DATA.length; i++) {
        const data = TAG_DATA[i];
        if (data.label === predicate) {
          payload.tag_id = data.tag_id;
          payload.label = data.label;
          payload.type = data.type;
        }
      }
      return payload;
    },
    searchByType: (predicate: TagType): Omit<TagData, "created_at"> => {
      const payload: Omit<TagData, "created_at"> = {
        tag_id: null,
        label: null,
        type: null,
      };
      for (let i = 0; i < TAG_DATA.length; i++) {
        const data = TAG_DATA[i];
        if (data.type === predicate) {
          payload.tag_id = data.tag_id;
          payload.label = data.label;
          payload.type = data.type;
        }
      }
      return payload;
    },
    getPropData: (): FormTagPropData[] => {
      const payload: FormTagPropData[] = [];
      for (let i = 0; i < TAG_DATA.length; i++) {
        const tag = TAG_DATA[i];
        payload.push({
          index: i,
          tag_id: tag.tag_id,
          label: tag.label,
          type: tag.type,
        });
      }
      return payload;
    },
    prepareDataForDBInsert: (taskID: number, tags: FormTagPropData[]) => {
      const payload = [];
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        if (tag.label) {
          payload.push({
            task_id: taskID,
            tag_id: $tasks.tags.searchByLabel(tag.label).tag_id,
          });
        }
      }
      return payload;
    },
  },
};

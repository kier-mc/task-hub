// Types
import type { TagData, TasksTagsJoinTable } from "~/types/schema";
import type { AutocompleteEmitFrequencyData } from "~/types/components/forms";
import type {
  FrequencyID,
  FrequencyRepetition,
} from "~/types/unions/schema.frequency";
import type { TagID, TagLabel, TagType } from "~/types/unions/schema.tags";

export const TAG_DATA: TagData[] = [
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

export const FREQUENCY_DATA = <Record<FrequencyID, FrequencyRepetition>>{
  1: "daily",
  2: "weekly",
  3: "fortnightly",
  4: "monthly",
  5: "triannually",
  6: "biannually",
  7: "annually",
};

export const FREQUENCY_TERMS = [
  "Daily",
  "Weekly",
  "Fortnightly",
  "Monthly",
  "Every four months",
  "Every six months",
  "Yearly",
];

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
    searchByID: (predicate: TagID): TagData => {
      const payload: TagData = {
        tag_id: null,
        label: null,
        type: null,
      };
      for (let i = 0; i < TAG_DATA.length; i++) {
        const data = TAG_DATA[i];
        if (data.tag_id === predicate) {
          payload.tag_id = data.tag_id;
          payload.label = data.label;
          payload.type = data.type;
          return payload;
        }
      }
      return payload;
    },
    searchByLabel: (predicate: TagLabel): TagData => {
      const payload: TagData = {
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
          return payload;
        }
      }
      return payload;
    },
    searchByType: (predicate: TagType): TagData => {
      const payload: TagData = {
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
          return payload;
        }
      }
      return payload;
    },
    getPropData: (): TagData[] => {
      const payload: TagData[] = [];
      for (let i = 0; i < TAG_DATA.length; i++) {
        const tag = TAG_DATA[i];
        payload.push({
          tag_id: tag.tag_id,
          label: tag.label,
          type: tag.type,
        });
      }
      return payload;
    },
    prepareDataForDBInsert: (
      taskID: number,
      tags: TagData[]
    ): TasksTagsJoinTable[] => {
      const payload = [];
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        if (tag.tag_id) {
          payload.push({
            task_id: taskID,
            tag_id: tag.tag_id,
          });
        }
      }
      return payload;
    },
  },
};

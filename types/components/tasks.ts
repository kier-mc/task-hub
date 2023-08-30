// Types
import type { FormTagPropData } from "~/types/components/forms";
import type {
  FrequencyID,
  FrequencyRepetition,
} from "~/types/unions/schema.frequency";
import type { TagData } from "~/types/schema";

export type NewTask = {
  label: string;
  description: string | null;
  frequency: FrequencyID;
  tags: FormTagPropData[] | null;
};

export type NewTaskData = {
  [key in keyof NewTask]: NewTask[key] | null;
};

export type TaskObject = {
  task_id: number;
  task: string;
  description: string | null;
  frequency: TaskObjectFrequencyData;
  timestamp: TaskObjectTimestampData;
  tags?: TaskObjectTagData[];
};

export type TaskObjectFrequencyData = {
  frequency_id: FrequencyID;
  label: FrequencyRepetition;
};

export type TaskObjectTimestampData = {
  created_at: string;
  edited_at: string | null;
};

export type TaskObjectTagData = NonNullable<TagData["tag_id"]>;

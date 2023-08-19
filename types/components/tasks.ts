// Types
import type { FormTagPropData } from "types/components/forms";
import type { FrequencyID } from "types/unions/schema.frequency";

export type NewTask = {
  label: string;
  description: string | null;
  frequency: FrequencyID;
  tags: FormTagPropData[] | null;
};

export type NewTaskData = {
  [key in keyof NewTask]: NewTask[key] | null;
};

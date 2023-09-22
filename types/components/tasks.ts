// Types
import type { FrequencyID, FrequencyRepetition } from "~/types/unions/schema.frequency";
import type { FrequencyData, TagData, TimestampData } from "~/types/schema";

export type TaskData = {
  task_id: number;
  task: string;
  description?: string;
  frequency: FrequencyData;
  timestamp: TimestampData;
  tags?: TagData[];
};

export type TaskObjectFrequencyData = {
  frequency_id: FrequencyID;
  repeats_every: FrequencyRepetition;
};

export type TaskObjectTimestampData = {
  created_at: string;
  edited_at: string | null;
};

export type NewTaskData = {
  [key in keyof Omit<TaskData, "task_id" | "timestamp">]:TaskData[key] | null
}
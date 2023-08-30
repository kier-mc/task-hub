import type { TasksTable, TagData, TasksTagsJoinTable } from "~/types/schema";
import type { TaskObject } from "./components/tasks";

export interface TaskStoreState {
  tasks: TaskObject[] | null;
}

export type TaskStoreFetchResponse = Omit<TasksTable, "author_id"> & {
  tasks_tags: TasksTagsJoinTable[];
};

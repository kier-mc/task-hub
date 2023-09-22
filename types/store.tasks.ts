import type { TasksTable, TasksTagsJoinTable } from "~/types/schema";
import type { TaskData } from "./components/tasks";

export interface TaskStoreState {
  response: TaskData[] | null;
}

export type TaskStoreFetchResponse = Omit<TasksTable, "author_id"> & {
  tasks_tags: TasksTagsJoinTable[];
};

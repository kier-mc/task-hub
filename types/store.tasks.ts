import type { TasksTable } from "~/types/schema";

export interface TaskStoreState {
  tasks: TasksTable[] | null;
}

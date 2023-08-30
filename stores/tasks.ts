// Types
import type { Database, TasksTable } from "~/types/schema";
import type {
  TaskStoreState,
  TaskStoreFetchResponse,
} from "~/types/store.tasks";
import type { NewTask, TaskObject } from "~/types/components/tasks";

// Pinia stores
import { useNotificationsStore } from "./notifications";
import { setActivePinia, createPinia } from "pinia";

// Instantiate Pinia and notifications store
setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();

/**
 * Remotely queries the database for all tasks associated with the currently logged in user.
 * Permissions are handled via PGSQL RLS policies. If no user is found, will throw an error.
 * @returns {Promise<TaskObject[] | null>}
 * An array containing all tasks associated with the current user. If no data response is
 * received, will return null instead.
 */
async function fetchFromEndpoint(): Promise<TaskObject[] | null> {
  const request = await useSupabaseClient().auth.getUser();
  if (!request.data.user) {
    throw new Error(
      "Unable to fetch data from remote server. Check your connection and ensure that you are logged in"
    );
  }
  const { data, error } = await useSupabaseClient<Database>().from("tasks")
    .select(`
    task_id,
    created_at,
    task,
    description,
    frequency_id,
    edited_at,
    tasks_tags (
      task_id,
      tag_id
    )
    `);
  if (error) {
    notificationsStore.push("Error", error.message);
    return null;
  }
  if (data) {
    const tasks: TaskObject[] = [];
    for (let i = 0; i < data.length; i++) {
      const response: TaskStoreFetchResponse = data[i];
      const task: TaskObject = parseResponseData(response);
      tasks.push(task);
    }
    return tasks;
  }
  return null;
}
/**
 * Processes the raw data received from the database into the preferred format
 * for local usage.
 * @param data {TaskStoreFetchResponse}
 * The data to be parsed. This must be synchronised with the request performed
 * by {@link fetchFromEndpoint()}.
 * @returns {TaskObject}
 * A data object ready for use in the store tasks array.
 */
function parseResponseData(data: TaskStoreFetchResponse): TaskObject {
  const payload: TaskObject = {
    task_id: data.task_id,
    task: data.task,
    description: data.description,
    frequency: {
      frequency_id: data.frequency_id,
      label: $tasks.frequency.getLabel(data.frequency_id),
    },
    timestamp: {
      created_at: data.created_at,
      edited_at: data.edited_at,
    },
  };
  if (data.tasks_tags.length > 0) {
    payload.tags = [...data.tasks_tags.map((tag) => tag.tag_id)];
  }
  return payload;
}

/**
 * Performs a remote COUNT(*) operation to determine the number of tasks
 * @returns {Promise<number>}
 * A number indicating the number of tasks associated with the user. If no tasks are found,
 * will return 0.
 */
async function countRemoteTasks(): Promise<number> {
  const request = await useSupabaseClient().auth.getUser();
  if (!request.data.user) throw new Error("No user found");
  const { count, error } = await useSupabaseClient<Database>()
    .from("tasks")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  if (count) {
    return count;
  }
  return 0;
}
/**
 * A Pinia store for handling tasks.
 * Can fetch tasks asynchronously from the database.
 * Stores them in an array and makes several methods available for interacting with them.
 */
export const useTaskStore = defineStore("tasks", {
  state: (): TaskStoreState => ({
    tasks: null,
  }),
  actions: {
    /**
     * Fetches task data from the store. If the store has not been queried previously (or
     * is not available in local storage), the data will be fetched remotely.
     * If a local storage copy exists, its length will be checked against a remote COUNT(*)
     * and, if the counts aren't equal, a remote copy will be fetched.
     * @param forceUpdate {boolean}
     * If set to true, the function will fetch data from the API endpoint,even if local
     * data is available. The default value is false.
     */
    async fetchData(forceUpdate?: boolean): Promise<void> {
      // If pre-existing task data is found in local storage
      if (localStorage.getItem("taskData")) {
        const local = localStorage.getItem("taskData");
        const data: TaskObject[] = JSON.parse(local!);
        const count = {
          local: () => data.length,
          remote: async () => await countRemoteTasks(),
        };
        // Fetch new data if the local array length is less than the remote COUNT(*)
        if ((await count.remote()) !== count.local() || forceUpdate) {
          const response = await fetchFromEndpoint();
          if (!response) return;
          this.tasks = response;
          localStorage.setItem("taskData", JSON.stringify(response));
          return;
        }
        // Otherwise, use the local copy
        this.tasks = data;
        return;
      }
      // If no previous response was found, fetch data
      if (!this.tasks || forceUpdate) {
        const response = await fetchFromEndpoint();
        if (!response) return;
        this.tasks = response;
      }
    },
    async createTask(taskData: NewTask) {
      const request = await useSupabaseClient().auth.getUser();
      if (!request.data.user) {
        throw new Error("Unable to find user. Check that you are logged in.");
      }
      const [task, description, frequency_id, tags] = [
        taskData.label,
        taskData.description,
        taskData.frequency,
        taskData.tags,
      ];
      const { data, error } = await useSupabaseClient<Database>()
        .from("tasks")
        .insert({
          author_id: request.data.user.id,
          task: task,
          description: description,
          frequency_id: frequency_id,
        })
        .select();
      if (error) {
        notificationsStore.push(
          "Error",
          "An error occurred whilst creating the task"
        );
        return;
      }
      if (data) {
        if (tags) {
          const id = data[0].task_id;
          const { error } = await useSupabaseClient<Database>()
            .from("tasks_tags")
            .insert($tasks.tags.prepareInsert(id, tags));
          if (error) {
            notificationsStore.push(
              "Error",
              "An error occurred whilst setting the tags"
            );
            return;
          }
        }
        notificationsStore.push("Success", "Task created successfully");
      }
      return;
    },
  },
  getters: {
    /**
     * Returns the number of tasks present in the store.
     * If the database hasn't been queried yet or the store is empty, returns null.
     * Can be used to evaluate whether or not data is available based on this.
     * @returns {number | null}
     */
    getTaskCount(): number | null {
      return this.tasks ? this.tasks.length : null;
    },
    /**
     * Returns the complete set of task data as received. If no data is available,
     * returns null.
     * @returns {TaskObject[] | null}
     */
    getTasks(): TaskObject[] | null {
      return this.tasks;
    },
    /**
     * Not implemented, do not use yet.
     * @returns
     */
    getUrgentTasks(): TaskObject[] | null {
      if (!this.tasks) return null;
      return this.tasks.map((task) => {
        return task;
      });
    },
  },
});

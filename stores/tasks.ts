// Types
import type { Database } from "~/types/schema";
import type {
  TaskStoreState,
  TaskStoreFetchResponse,
} from "~/types/store.tasks";
import type { NewTaskData, TaskData } from "~/types/components/tasks";

/**
 * Remotely queries the database for all tasks associated with the currently logged in user.
 * Permissions are handled via PGSQL RLS policies. If no user is found, will throw an error.
 * @returns {Promise<TaskData[] | null>}
 * An array containing all tasks associated with the current user. If no data response is
 * received, will return null instead.
 */
async function fetchFromEndpoint(): Promise<TaskData[] | null> {
  const notificationsStore = useNotificationsStore();
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
    const tasks: TaskData[] = [];
    for (let i = 0; i < data.length; i++) {
      const response: TaskStoreFetchResponse = data[i];
      const task: TaskData = parseResponseData(response);
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
 * @returns {TaskData}
 * A data object ready for use in the store tasks array.
 */
function parseResponseData(data: TaskStoreFetchResponse): TaskData {
  const payload: TaskData = {
    task_id: data.task_id,
    task: data.task,
    description: data.description,
    frequency: {
      frequency_id: data.frequency_id,
      repeats_every: $tasks.frequency.getLabel(data.frequency_id),
    },
    timestamp: {
      created_at: data.created_at,
      edited_at: data.edited_at,
    },
  };
  if (data.tasks_tags.length > 0) {
    payload.tags = [
      ...data.tasks_tags.map((tag) => $tasks.tags.searchByID(tag.tag_id)),
    ];
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
    response: null,
  }),
  actions: {
    /**
     * Initialisation function intended to be called when a component that utilises the
     * store is mounted.
     */
    async init() {
      if (!this.response) {
        await this.fetchData();
      }
    },
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
        const data: TaskData[] = JSON.parse(local!);
        const count = {
          local: () => data.length,
          remote: async () => await countRemoteTasks(),
        };
        // Fetch new data if the local array length is less than the remote COUNT(*)
        if ((await count.remote()) !== count.local() || forceUpdate) {
          const response = await fetchFromEndpoint();
          if (!response) return;
          this.response = response;
          localStorage.setItem("taskData", JSON.stringify(response));
          return;
        }
        // Otherwise, use the local copy
        this.response = data;
        return;
      }
      // If no previous response was found, fetch data
      if (!this.response || forceUpdate) {
        const response = await fetchFromEndpoint();
        if (!response) return;
        localStorage.setItem("taskData", JSON.stringify(response));
        this.response = response;
      }
    },
    /**
     * Creates a new task based on the supplied data. If any critical data is absent,
     * an error will be thrown. If an error on the back end occurs, a more generic
     * error message will be provided to the end user via the notification system, and
     * the function will return.
     * @param taskData {NewTaskData}
     * An object containing data to be passed to the back end.
     */
    async createTask(taskData: NewTaskData): Promise<void> {
      const notificationsStore = useNotificationsStore();
      const request = await useSupabaseClient().auth.getUser();
      if (!request.data.user) {
        throw new Error("Unable to find user. Check that you are logged in");
      }
      const [author_id, task, description, frequency_id, tags] = [
        request.data.user.id,
        taskData.task,
        taskData.description,
        taskData.frequency?.frequency_id,
        taskData.tags,
      ];
      if (!task || !frequency_id) {
        throw new Error("Task title and frequency are null");
      }
      const { data, error } = await useSupabaseClient<Database>()
        .from("tasks")
        .insert({
          author_id: author_id,
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
        if (tags && tags.length) {
          const id = data[0].task_id;
          const { error } = await useSupabaseClient<Database>()
            .from("tasks_tags")
            .insert($tasks.tags.prepareDataForDBInsert(id, tags));
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
    /**
     * Deletes the specified task from the database and removes the local copy
     * from the Pinia store. If the task cannot be deleted, a generic error
     * message is pushed to the user via the notifications system.
     * @param id {number}
     * A numerical identifier that should correspond with a database row.
     */
    async deleteTask(id: number): Promise<void> {
      const notificationsStore = useNotificationsStore();
      const { error } = await useSupabaseClient<Database>()
        .from("tasks")
        .delete()
        .eq("task_id", id);
      if (error) {
        notificationsStore.push(
          "An error occurred whilst attempting to delete the task",
          "error"
        );
        return;
      }
      if (this.response) {
        const index = this.response.findIndex((task) => task.task_id === id);
        this.response.splice(index, 1);
      }
      notificationsStore.push(`Task deleted successfully`, "success");
    },
    /**
     * Updates/upserts data related to a pre-existing task. If the task cannot be
     * updated, a generic error message is pushed to the user via the notification
     * system.
     * @param taskData {NewTaskData}
     * An object containing updated data to be passed to the back end.
     * @param taskID {number}
     * A numerical identifier that should correspond with a database row.
     */
    async updateTask(taskData: NewTaskData, taskID: number): Promise<void> {
      const notificationsStore = useNotificationsStore();
      const request = await useSupabaseClient().auth.getUser();
      if (!request.data.user) {
        throw new Error("Unable to find user. Check that you are logged in");
      }
      const [task_id, task, description, frequency_id, tags, timestamp] = [
        taskID,
        taskData.task,
        taskData.description,
        taskData.frequency?.frequency_id,
        taskData.tags,
        new Date().toISOString(),
      ];
      const { error } = await useSupabaseClient<Database>()
        .from("tasks")
        .update({
          task: task,
          description: description,
          frequency_id: frequency_id,
          edited_at: timestamp,
        })
        .eq("task_id", task_id);
      if (error) {
        notificationsStore.push(
          "Error",
          "An error occurred whilst updating the task"
        );
        return;
      }
      if (tags && tags.length) {
        const { error } = await useSupabaseClient<Database>()
          .from("tasks_tags")
          .upsert($tasks.tags.prepareDataForDBInsert(task_id, tags))
          .eq("task_id", task_id);
        if (error) {
          notificationsStore.push(
            "Error",
            "An error occurred whilst updating the tags"
          );
          return;
        }
      }
      notificationsStore.push("Success", "Task updated successfully");
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
      return this.response ? this.response.length : null;
    },
    /**
     * Returns the complete set of task data as received. If no data is available,
     * returns null.
     * @returns {TaskData[] | null}
     */
    getTasks(): TaskData[] | null {
      return this.response;
    },
  },
});

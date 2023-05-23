import { useNotificationsStore } from "./notifications";
import { setActivePinia, createPinia } from "pinia";

setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();

/**
 * A Pinia store for handling tasks.
 * Can fetch tasks asynchronously from the database.
 * Stores them in an array and makes several methods available for interacting with them.
 */
export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Database["tasks"][],
  }),
  actions: {
    /**
     * Returns the number of currently stored tasks.
     */
    taskCount() {
      return this.tasks.length;
    },
    /**
     * Fetches tasks from the database asynchronously and stores them in an array.
     */
    async getTasks() {
      const request = await useSupabaseAuthClient().auth.getUser();
      if (!request.data.user) {
        return navigateTo("/login");
      }
      const { data, error } = await useSupabaseClient<Database>()
        .from("tasks")
        .select("*");
      if (error) {
        notificationsStore.setMessage(error.message, "error");
        return;
      }
      if (data) {
        this.tasks = data as Database["tasks"][];
        return;
      }
    },
    /**
     * Clears all currently stored tasks.
     * Does not clear tasks from the database; only the local copies are deleted.
     */
    clearTasks() {
      this.tasks = [];
    },
  },
});

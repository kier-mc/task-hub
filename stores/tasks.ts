import { useNotificationsStore } from "./notifications";
import { setActivePinia, createPinia } from "pinia";

setActivePinia(createPinia());
const notifications = useNotificationsStore();

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as any,
  }),
  actions: {
    length() {
      return this.tasks.length;
    },
    async getTasks() {
      const { data, error } = await useSupabaseClient<Database>()
        .from("tasks")
        .select("*");
      if (error) {
        notifications.setMessage(error.message, "error");
        return;
      }
      if (data) {
        this.tasks = data;
        return;
      }
    },
    clearTasks() {
      this.tasks = [];
    },
  },
});

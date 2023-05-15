import { useNotificationsStore } from "./notifications";
import { setActivePinia, createPinia } from "pinia";

setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    // Need a better solution here than "any"
    tasks: [] as Database["tasks"][],
  }),
  actions: {
    length() {
      return this.tasks.length;
    },
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
    clearTasks() {
      this.tasks = [];
    },
  },
});

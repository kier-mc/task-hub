import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    message: null as string | null,
    type: null as string | null,
  }),
  actions: {
    setMessage(message: string, type: string) {
      this.message = message;
      this.type = type;
    },
    clearAll() {
      this.message = null;
      this.type = null;
    },
  },
});

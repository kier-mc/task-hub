/**
 * A Pinia store that handles notifications.
 * Used for pushing messages from the system to notify the user of application state;
 * success, errors, warnings etc.
 */
export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    message: null as string | null,
    type: null as string | null,
  }),
  actions: {
    /**
     * Pushes a message to the notification store.
     * @param message {string} - a message to be pushed to the user
     * @param type {string} - a type that best categorises the message, e.g. "error", "success"
     */
    setMessage(message: string, type: string) {
      this.message = message;
      this.type = type;
    },
    /**
     * Clears all data from the notification store by setting the values to null.
     */
    clearAll() {
      this.message = null;
      this.type = null;
    },
  },
});

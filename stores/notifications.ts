/**
 * A Pinia store that handles notifications.
 * Used for pushing messages from the system to notify the user of application state;
 * success, errors, warnings etc.
 */
export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    message: null as string | null,
    title: null as string | null,
  }),
  actions: {
    /**
     * Pushes a message to the notification store.
     * @param title {string} A title to help provide context to the message.
     * @param message {string} A message to notify the user.
     */
    push(title: string, message: string): void {
      [this.title, this.message] = [null, null];
      [this.title, this.message] = [title, message];
    },
  },
});

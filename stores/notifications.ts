// Types
import type { NotificationsStoreState } from "types/store.notifications";

/**
 * A Pinia store that handles notifications.
 * Used for pushing messages from the system to notify the user of application state;
 * success, errors, warnings etc.
 */
export const useNotificationsStore = defineStore("notifications", {
  state: (): NotificationsStoreState => ({
    title: null,
    message: null,
  }),
  actions: {
    /**
     * Pushes a message to the notification store.
     * @param title {string} A title that appears in the header of the toast component.
     * @param message {string} A message which is displayed in the body of the toast component.
     */
    push(title: string, message: string): void {
      [this.title, this.message] = [null, null];
      [this.title, this.message] = [title, message];
    },
  },
});

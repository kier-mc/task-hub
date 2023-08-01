/**
 * Specifically manages the Pinia notifications store.
 */
export interface NotificationsStoreState {
  /**
   * A title that appears in the header of the toast component.
   */
  title: string | null;
  /**
   * A message which is displayed in the body of the toast component.
   */
  message: string | null;
}

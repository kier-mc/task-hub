/**
 * Auth helper function that iterates through all values of an object and ensures
 * that the value is not falsy. If any value is falsy, it has not been populated
 * by the user and thus is guaranteed to be invalid. Utilised as part of a guard
 * clause to avoid pointless calls to the Supabase endpoint when failure is
 * guaranteed.
 * @param credentials {Ref<NewAccountDataObject>|Ref<LoginCredentialsDataObject>}
 * the credentials (login or for a new account) to iterate over and check
 * @returns {boolean} a boolean response based on whether or not all fields are
 * populated.
 */
export function allCredentialFieldsArePopulated(
  credentials: ComputedRef<CompleteNewAccountCredentialData> | Ref<LoginCredentialsData>
): boolean {
  for (const value of Object.values(credentials.value)) {
    if (!value) {
      return false;
    }
  }
  return true;
}

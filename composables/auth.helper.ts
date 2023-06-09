export function allCredentialFieldsArePopulated(
  credentials: Ref<NewAccountDataObject> | Ref<LoginCredentialsDataObject>
): boolean {
  for (const value of Object.values(credentials.value)) {
    if (!value) {
      return false;
    }
  }
  return true;
}

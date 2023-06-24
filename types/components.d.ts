interface FormHandlerData {
  index: number;
  formID: string;
  elementType: "input" | "select" | "autocomplete";
  attrType?: string;
  autocomplete?:
    | "on"
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffix"
    | "nickname"
    | "email"
    | "username"
    | "new-password"
    | "current-password"
    | "one-time-code"
    | "organization-title"
    | "organization"
    | "street-address"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level4"
    | "address-level3"
    | "address-level2"
    | "address-level1"
    | "country"
    | "country-name"
    | "postal-code"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "transaction-currency"
    | "transaction-amount"
    | "language"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "sex"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-area-code"
    | "tel-local"
    | "tel-extension"
    | "impp"
    | "url"
    | "photo"
    | "webauthn";
  labelText: string;
  value?: string;
  hintText?: string;
  options?: FormHandlerOptionsData[];
  default?: string;
}
interface FormHandlerOptionsData {
  value: string;
  label: string;
  isDisabled?: boolean;
}
interface CreateAccountStepperData {
  index: number;
  header: string;
  formData: Array<CompFormObject>;
}
interface LoginCredentialsData {
  [key: string]: string | undefined;
  email: string | undefined;
  password: string | undefined;
}
interface RawNewAccountCredentialData extends LoginCredentialsData {
  [key: string]: string | undefined;
  preferred_name: string | undefined;
  locale: string | undefined;
}
interface AutocompleteCountryData {
  label: string | undefined,
  value: Database["countries"]["name"] | undefined,
}
interface CompleteNewAccountCredentialData extends RawNewAccountCredentialData {
  country: AutocompleteCountryData;
}
interface RawTaskData {
  [key: string]: string | undefined;
  task: string | undefined;
  description: string | undefined;
}
interface AutocompleteTaskFrequencyData {
  label: string | undefined;
  value: Database["frequency"]["repeats_every"] | undefined
}
interface CompleteTaskData extends RawTaskData {
  frequency: AutocompleteTaskFrequencyData;
}
interface LoadingIndicatorData {
  type: "circle" | "dots";
  width: number;
  height: number;
  hue: number;
  saturation: number;
  lightness: number;
}

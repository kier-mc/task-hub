interface CompFormObject {
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
  options?: {
    value: string;
    text: string;
    isDisabled?: boolean;
  }[];
  default?: string;
}
interface CompStepperPropData {
  index: number;
  header: string;
  formData: Array<CompFormObject>;
}
interface LoginCredentialsDataObject {
  [key: string]: string | undefined;
  email: string | undefined;
  password: string | undefined;
}
interface NewAccountDataObject extends LoginCredentialsDataObject {
  [key: string]: string | undefined;
  preferred_name: string | undefined;
  country: Database["countries"]["name"] | undefined;
  locale: string | undefined;
}
interface TaskDataObject {
  [key: string]: string;
  task: string;
  description: string;
  frequency: string;
}
interface LoadingIndicatorDataObject {
  type: "circle" | "dots";
  width: number;
  height: number;
  hue: number;
  saturation: number;
  lightness: number;
}

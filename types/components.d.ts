// Form handler component
interface FormHandlerData {
  index: number;
  formID: string;
  elementType: FormHandlerElementType;
  attrType?: string;
  autocomplete?: AutocompleteAttributeOptions;
  labelText: string;
  value?: string;
  hintText?: string;
  options?: FormHandlerOptionsData[];
  default?: string;
  style?: FormHandlerElementType;
}
interface FormHandlerOptionsData {
  label: string;
  value: string;
  isDisabled?: boolean;
}
// Autocomplete component
interface AutocompleteData<TypeLabel, TypeValue> {
  label: TypeLabel | null;
  value: TypeValue | null;
}
interface AutocompleteEmitData extends AutocompleteData<string, string> {}

interface AutocompleteTaskFrequencyData
  extends AutocompleteData<string, FrequencyRepetition> {}

interface AutocompleteCountryData
  extends AutocompleteData<string, CountryName> {}
// Loading indicator component
interface LoadingIndicatorData {
  type: "circle" | "dots";
  width: number;
  height: number;
  hue: number;
  saturation: number;
  lightness: number;
}
// Login form
interface LoginCredentialsData {
  email: string | null;
  password: string | null;
}
// Account creation form
interface CreateAccountStepperData {
  index: number;
  header: string;
  formData: Array<CompFormObject>;
}
interface PartialNewAccountCredentialData extends LoginCredentialsData {
  [key: string]: string | null;
  preferred_name: string | null;
  locale: string | null;
}
interface CompleteNewAccountCredentialData
  extends PartialNewAccountCredentialData {
  country: AutocompleteCountryData;
}
// Task form
interface PartialTaskData {
  task: string | null;
  description: string | null;
}
interface CompleteTaskData extends PartialTaskData {
  frequency: AutocompleteTaskFrequencyData;
}

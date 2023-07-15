// Form handler component
interface FormHandlerData {
  index: number;
  type: FormHandlerElementType;
  label: string;
  hint?: string;
  default?: string;
  style?: FormHandlerStyle;
  attributes: {
    autocomplete?: HTMLAutocompleteAttributeOptions;
    id: string;
    type?: HTMLInputAttributeOptions;
  };
  options?: FormHandlerOptionsData[];
}
// Form handler emits
interface EmitDataTemplate<TypeLabel, TypeValue> {
  label: TypeLabel | null;
  value: TypeValue | null;
}

interface FormHandlerOptionsData extends EmitDataTemplate<string, string> {
  isDisabled?: boolean;
}

interface EmitData extends EmitDataTemplate<string, string> {}

interface EmitTaskFrequencyData
  extends EmitDataTemplate<string, FrequencyRepetition> {}

interface EmitCountryData extends EmitDataTemplate<string, CountryName> {}
// Loading indicator component
interface LoadingIndicatorData {
  type: "circle" | "dots";
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
  frequency: EmitTaskFrequencyData;
}
interface FormButtonData {
  function: Function;
  label: string;
  icon?: Component;
  attributes: {
    type: HTMLButtonAttributeOptions;
  };
}

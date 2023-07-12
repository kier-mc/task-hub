// Form handler component
interface FormHandlerData {
  index: number;
  type: FormHandlerElementType;
  label: string;
  hint?: string;
  default?: string;
  style?: FormHandlerStyle;
  attributes: {
    autocomplete?: AutocompleteAttributeOptions;
    id: string;
    type?: InputAttributeType;
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
  size: {
    width: number;
    height: number;
  };
  colour: {
    hue: number;
    saturation: number;
    lightness: number;
  };
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

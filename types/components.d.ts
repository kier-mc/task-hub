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

// Task form
interface PartialTaskData {
  task: string | null;
  description: string | null;
}
interface CompleteTaskData extends PartialTaskData {
  frequency: EmitTaskFrequencyData;
}

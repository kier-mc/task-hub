interface CompFormObject {
  index: number;
  formID: string;
  elementType: "input" | "select";
  attrType?: string;
  labelText: string;
  hintText?: string;
  options?: {
    value: string;
    text: string;
  }[];
}
interface CompStepperPropData {
  index: number;
  header: string;
  formData: Array<CompFormObject>;
}
interface LoginCredentialsDataObject {
  [key: string]: string;
  email: string;
  password: string;
}
interface NewAccountDataObject {
  [key: string]: string;
  email: string;
  password: string;
  name: string;
}
interface TodoDataObject {
  [key: string]: string;
  task: string;
  description: string;
  frequency: string;
}

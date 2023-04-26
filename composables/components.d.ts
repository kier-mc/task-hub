interface CompFormObject {
  index: number;
  formID: string;
  attrType: string;
  labelText: string;
  hintText?: string;
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

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

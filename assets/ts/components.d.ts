interface CompFormObject {
  index: number;
  attrType: string;
  labelText: string;
  hintText?: string;
}
interface CompStepperPropData {
  index: number;
  header: string;
  formData: Array<CompFormObject>;
}
// interface CompStepperProps {
//   propData: Array<CompStepperObject>;
// }

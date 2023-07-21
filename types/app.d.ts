interface AppButtonPropData {
  function: Function | null;
  label: string | null;
  icon?: Component;
  attributes: {
    type: HTMLButtonAttributeOptions;
  };
}

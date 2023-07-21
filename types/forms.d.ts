/**
 * A baseline interface that other form component props inherit from.
 */
interface GenericFormPropData {
  /**
   * A unique numerical identifier.
   */
  index: number;
  /**
   * The type of form component to be rendered. Used with conditional/list rendering.
   */
  type: FormElementType;
  /**
   * A label to be displayed to the user. It will directly populate a &lt;label&gt; element.
   */
  label: string | null;
  /**
   * An optional hint label to be displayed to the user. It should provide additional context to the component's purpose.
   */
  hint?: string;
  /**
   * An optional default value to be displayed on the initial render.
   */
  default?: string;
  /**
   * An optional modifier that alters the style of the component.
   */
  style?: FormHandlerStyle;
  /**
   * An optional numerical value that can be used to associate the element with a parent section.
   */
  section?: number;
  /**
   * An object that contains key/value pairs that correspond to element attributes.
   */
  attributes: {
    /**
     * An identifier that must be unique within the document.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id}
     */
    id: string;
  };
}
/**
 * An interface that specifically manages custom &lt;input&gt; element props.
 */
interface FormInputPropData extends GenericFormPropData {
  type: "input";
  attributes: GenericFormPropData["attributes"] & {
    /**
     * An attribute that controls how the user agent/browser handles automated assistance for the input form.
     * If not specified, will default to "on".
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete}
     */
    autocomplete?: HTMLAutocompleteAttributeOptions;
    /**
     * An attribute that specifies the type of control to render.
     * If not specified, will default to "text".
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type}
     */
    type?: HTMLInputAttributeOptions;
  };
}
/**
 * An interface that specifically manages custom autocomplete element props.
 */
interface FormAutocompletePropData extends GenericFormPropData {
  type: "autocomplete";
  /**
   * The options to provide to the autocomplete element. Mimics the structure of a &lt;select&gt; element and its children.
   */
  options: Array<{
    /**
     * The label is the value displayed to the user inside the list.
     */
    label: string | null;
    /**
     * The value is the underlying data attached to the label.
     */
    value: string | null;
  }>;
}
/**
 * An interface that specifically manages prop data for the create-account route.
 */
interface NewAccountSectionPropData {
  /**
   * A unique numerical identifier. Can be used in combination with a child element index to create associations between the two.
   */
  index: number;
  /**
   * A label that provides semantic information about the role of the section.
   */
  label: string;
  /**
   * An array of form items to be iterated over and rendered.
   */
  data: Array<FormInputPropData | FormAutocompletePropData>;
}

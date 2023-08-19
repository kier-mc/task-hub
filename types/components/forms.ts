import type {
  FormElementType,
  FormHandlerStyle,
  HTMLAutocompleteAttributeOptions,
  HTMLInputAttributeOptions,
} from "../unions/forms.options";
import type { CountryData, TagData, FrequencyData } from "../schema";

/**
 * A baseline interface that other form component props inherit from.
 */
export interface GenericFormPropData {
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
 * Specifically manages custom input component props.
 */
export interface FormInputPropData extends GenericFormPropData {
  /**
   * Acts as an internal identifier in scenarios such as list rendering.
   */
  type: "input";
  /**
   * A list of implemented HTML attributes that customise the input element's properties.
   */
  attributes: GenericFormPropData["attributes"] & {
    /**
     * Controls how the user agent/browser handles automated assistance for the input form.
     * If not specified, will default to "on".
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete}
     */
    autocomplete?: HTMLAutocompleteAttributeOptions;
    /**
     * Specifies the type of &lt;input&gt; control to render.
     * If not specified, will default to "text".
     * Not all options are handled by the component.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type}
     */
    type?: HTMLInputAttributeOptions;
  };
}
/**
 * Specifically manages custom autocomplete element props.
 */
export interface FormAutocompletePropData extends GenericFormPropData {
  /**
   * Acts as an internal identifier in scenarios such as list rendering.
   */
  type: "autocomplete";
  /**
   * The options to provide to the autocomplete element. Mimics the structure of a &lt;select&gt; element and its children.
   */
  options: AutocompleteEmitData[] | AutocompleteEmitCountryData[];
}
/**
 * Specifically manages prop data for the create-account route.
 */
export interface NewAccountSectionPropData {
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
/**
 * A template interface that serves as a baseline for more complex emit types.
 */
interface AutocompleteEmitDataTemplate<DataType extends Object> {
  /**
   * A term to match when the user enters a predicate.
   */
  term: string | null;
  /**
   * An object containing data associated with the term.
   */
  data: DataType | null;
}
/**
 * A generic interface that accepts an object with any specified key/value pairs.
 */
export interface AutocompleteEmitData
  extends AutocompleteEmitDataTemplate<Object> {}
/**
 * An interface that specifically manages country emit data.
 */
export interface AutocompleteEmitCountryData
  extends AutocompleteEmitDataTemplate<CountryData> {}
/**
 * An interface that specifically manages frequency emit data.
 */
export interface AutocompleteEmitFrequencyData
  extends AutocompleteEmitDataTemplate<FrequencyData> {}
/**
 * An interface for managing tag prop data.
 */
export type FormTagPropData = Omit<TagData, "tag_id" | "created_at"> & {
  index: number;
};

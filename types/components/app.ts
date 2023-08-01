import type { HTMLButtonAttributeOptions } from "../unions/button.options";
/**
 * Specifically manages button component prop data.
 */
export interface ButtonPropData {
  function: Function | null;
  label: string | null;
  icon?: Component;
  attributes: {
    type: HTMLButtonAttributeOptions;
  };
}
/**
 * Specifically manages loading indicator component prop data.
 */
export interface LoadingIndicatorPropData {
  display: "circle" | "dots";
}
/**
 * Specifically manages app navigation menu prop data.
 */
export interface NavigationPropData {
  index: number;
  label: string;
  icon: Component;
  function: Function;
  requiresAuth: boolean;
}

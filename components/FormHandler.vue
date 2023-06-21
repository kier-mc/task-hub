<template>
  <div class="form-group">
    <!-- If element is input -->
    <template v-if="props.formData.elementType === 'input'">
      <div class="form-group__wrapper">
        <label
          class="form-group__label"
          :class="inputDetermineLabelClass"
          :for="props.formData.formID"
          >{{ props.formData.labelText }}</label
        >
        <input
          ref="input"
          class="form-group__input"
          :type="props.formData.attrType"
          :id="props.formData.formID"
          :name="props.formData.formID"
          :autocomplete="
            props.formData.autocomplete ? props.formData.autocomplete : 'on'
          "
          :value="modelValue"
          @input="emitEvent($event)"
          @focus="inputIsFocused = true"
          @blur="inputIsFocused = false"
        />
      </div>
      <span v-if="props.formData.hintText" class="form-group__hint">{{
        props.formData.hintText
      }}</span>
    </template>
    <!-- If element is select -->
    <template v-else-if="props.formData.elementType === 'select'">
      <label class="form-group__label" :for="props.formData.formID">{{
        props.formData.labelText
      }}</label>
      <select
        class="form-group__select"
        :value="modelValue"
        @input="emitEvent($event)"
      >
        <option
          v-for="option in props.formData.options"
          class="form-group__option"
          :value="option.value"
          :disabled="option.isDisabled ? true : false"
          :selected="option.value === 'unset'"
        >
          {{ option.label }}
        </option>
      </select>
    </template>
    <!-- If element is autocomplete -->
    <template v-else-if="props.formData.elementType === 'autocomplete'">
      <div class="autocomplete" @keyup.escape="autocompleteIsExpanded = false">
        <div class="autocomplete__controls">
          <label
            class="autocomplete__label"
            :class="autocompleteDetermineLabelClass"
            :for="props.formData.formID"
          >
            {{ props.formData.labelText }}
          </label>
          <input
            ref="autocompleteInput"
            class="autocomplete__input"
            tabindex="0"
            :id="props.formData.formID"
            :value="modelValue"
            @click="autocompleteHandleClick($event)"
            @focus="autocompleteFilterData($event)"
            @blur="autocompleteHandleBlur($event)"
            @input="emitEvent($event)"
            @keyup="autocompleteFilterData($event)"
          />
          <button
            class="autocomplete__button"
            tabindex="0"
            @click="autocompleteHandleClick($event)"
          >
            <SVGExpandMore class="autocomplete__icon" />
          </button>
        </div>
        <ul
          class="autocomplete__ul"
          :aria-expanded="autocompleteIsExpanded ? true : false"
          ref="autocompleteMenu"
        >
          <li
            class="autocomplete__li"
            v-for="(data, index) in autocompleteOptions"
            :key="index"
            :data-value="data"
            :tabindex="autocompleteIsExpanded ? 0 : -1"
            @click="autocompleteSelectOption($event)"
            @keyup.enter="autocompleteSelectOption($event)"
            @keyup.space="autocompleteSelectOption($event)"
          >
            {{ data }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
$input-padding: 0.5rem;
.form-group {
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  &__wrapper {
    position: relative;
  }
  &__label {
    pointer-events: none;
    position: absolute;
    top: 50%;
    right: 0rem;
    left: 0.55rem;
    transform: translateY(-50%);
    transition: top 125ms, transform 125ms;
    transform-origin: top left;
    &--focused {
      top: 0.5rem;
      transform: scale(0.75);
    }
  }
  &__input {
    all: unset;
    min-width: 10ch;
    max-width: 25ch;
    min-height: calc(48px - 1rem);
    padding-top: 1rem;
    padding-inline: 0.5rem;
    border: 1px solid hsl(0, 0%, 30%);
    background-color: hsl(0, 0%, 15%);
    cursor: text;
    &:focus {
      outline: 1px solid hsl(0, 0%, 50%);
    }
  }
  &__hint {
    margin-bottom: 0.25rem;
    margin-left: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.5;
  }
  &__select {
    padding: 0.5rem 0.5rem 0.5rem 0.35rem;
    border: 1px solid hsl(0, 0%, 30%);
    font-size: 1rem;
  }
}
.autocomplete {
  position: relative;
  background-color: hsl(0, 0%, 15%);
  &__label {
    pointer-events: none;
    position: absolute;
    top: 50%;
    right: 0rem;
    left: 0.55rem;
    transform: translateY(-50%);
    transition: top 125ms, transform 125ms;
    transform-origin: top left;
    &--focused {
      top: 0.5rem;
      transform: scale(0.75);
    }
  }
  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    border: 1px solid hsl(0, 0%, 30%);
    cursor: text;
  }
  &__input {
    all: unset;
    position: relative;
    width: 100%;
    // Height of the button minus the padding-top value
    height: calc(48px - 1rem);
    padding-inline: 0.5rem;
    padding-top: 1rem;
    border-right: 1px solid hsl(0, 0%, 30%);
    margin-right: 1px;
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    min-width: 48px;
    z-index: 10;
    background-color: hsl(0, 0%, 10%);
    cursor: pointer;
    transition: background-color 125ms;
    &:hover {
      background-color: hsl(0, 0%, 15%);
    }
  }
  &__icon {
    max-width: 32px;
    fill: hsl(0, 0%, 80%);
    transition: fill 125ms;
    &:hover {
      fill: hsl(0, 0%, 90%);
    }
  }
  &__ul {
    all: unset;
    overflow-y: scroll;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    max-height: 17ch;
    border-inline: 1px solid hsl(0, 0%, 30%);
    border-bottom: 1px solid hsl(0, 0%, 30%);
    background-color: hsl(0, 0%, 15%);
    transition: opacity 150ms;
    &[aria-expanded="false"] {
      visibility: hidden;
      opacity: 0;
    }
    &[aria-expanded="true"] {
      visibility: visible;
      opacity: 1;
      z-index: 100;
    }
  }
  &__li {
    all: unset;
    display: block;
    padding-inline: 1rem;
    padding-block: 0.75rem;
    cursor: pointer;
    transition: background-color 100ms;
    &:hover,
    &:focus {
      background-color: hsl(0, 0%, 10%);
    }
  }
  &__input:focus,
  &__button:focus,
  &__li:focus {
    outline: 1px solid hsl(0, 0%, 50%);
  }
}
</style>

<script setup lang="ts">
const props = defineProps({
  formData: { type: Object as PropType<CompFormObject>, required: true },
  modelValue: { type: String },
});

const emit = defineEmits<{
  (event: "update:model-value", value: string): void;
  (event: "input", value: string): void;
}>();

function emitEvent(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const value = target.value;
  emit("update:model-value", value);
  emit("input", value);
}
// Reactive variables
const inputIsFocused: Ref<boolean> = ref(false);
const autocompleteIsFocused: Ref<boolean> = ref(false);
const autocompleteIsExpanded: Ref<boolean> = ref(false);
const autocompleteOptions: Ref<Array<string>> = ref([]);
// Template refs
const input: Ref<HTMLInputElement | null> = ref(null);
const autocompleteInput: Ref<HTMLInputElement | null> = ref(null);
const autocompleteMenu: Ref<HTMLUListElement | null> = ref(null);

const inputDetermineLabelClass = computed((): string | void => {
  if (!input.value) return;
  let result = false;
  const value = input.value.value;
  if (inputIsFocused.value || value.length > 0) {
    result = true;
  }
  return result ? "form-group__label form-group__label--focused" : undefined;
});
/**
 * Handles click events for the autocomplete custom form element.
 * Called on the input element and the button for the dropdown, with slightly
 * different results that depend on the element itself and the "expected"
 * behaviour from a user experience perspective. If the event parameter
 * comes from the input, the menu is opened and subsequent clicks do not
 * toggle it. If the event parameter comes from the button, subsequent
 * clicks will toggle the state, depending on whether the menu was opened
 * or closed when the click was handled. Determines both outcomes via
 * a reactive variable defined elsewhere in the scope.
 * @param event {Event} The DOM event created by the click.
 */
function autocompleteHandleClick(event: Event): void {
  if (!autocompleteMenu.value) return;
  const target = event.target as HTMLElement;
  if (target.closest(".autocomplete__input")) {
    autocompleteIsExpanded.value = true;
  } else if (target.closest(".autocomplete__button")) {
    if (autocompleteIsExpanded.value) {
      autocompleteIsExpanded.value = false;
    } else {
      autocompleteIsExpanded.value = true;
    }
  }
}
/**
 * Handles option selection for the custom autocomplete form element.
 * Calls {@link emit()} to pass the selected value to the parent component,
 * and closes the menu to create an experience that matches end user expectations,
 * determined by the behaviour of a select element. Must await the next tick before
 * closing the menu, otherwise behaviour is erroneous.
 * @param event {Event} The DOM event created by the click.
 */
async function autocompleteSelectOption(event: Event): Promise<void> {
  if (!autocompleteInput.value) return;
  const target = event.target as HTMLLIElement;
  emit("update:model-value", target.textContent ?? "");
  await nextTick();
  autocompleteIsExpanded.value = false;
}
/**
 * Closes the menu (if it is opened) with a click, as long as the click is outside
 * of the parent element with a class of "autocomplete". If the menu is open,
 * closes the menu and removes focus from the input element. Contains a guard clause
 * to exit the function early if the autocomplete menu was closed when the function
 * was called. Must be attached to a document event handler to execute correctly.
 * @param event {Event} The DOM event created by the click.
 */
function closeMenuWithClickOutside(event: Event): void {
  if (
    !autocompleteInput.value ||
    !autocompleteMenu.value ||
    !autocompleteIsExpanded.value
  )
    return;
  const target = event.target as Element;
  const isClickInside = target.closest(".autocomplete");
  if (!isClickInside) {
    autocompleteIsExpanded.value = false;
    autocompleteInput.value.blur();
  }
}
/**
 * Filters through the prop data supplied to the autocomplete element and
 * populates the available options based on the input string. On call, will
 * reset the autocompleteOptions reactive variable array and iterate over the
 * props.formData.label values supplied by the parent element. If the iterated value
 * contains the substring from the input element, it is added to the autocompleteOptions
 * array. Values are given a basic priority by determining whether the substring
 * occurs early in the value and using Array.prototype.unshift to insert if this is
 * true. If the substring combination is not found in any values, the default prop
 * data is returned by calling {@link autocompletePopulateDefaultOptions()} instead.
 * Finally, it will open the menu so that the user can see the results without having
 * to trigger this behaviour themselves.
 * @param event {Event} The DOM event created by entering characters into the input
 * element. The substring is determined by calling HTMLInputElement.prototype.value.
 */
function autocompleteFilterData(event: Event) {
  if (!props.formData.options) return;
  autocompleteOptions.value = [];
  const target = event.target as HTMLInputElement;
  const input = target.value.toLowerCase();
  if (input) {
    for (let i = 0; i < props.formData.options.length; i++) {
      const propValue = props.formData.options[i].label;
      if (propValue.toLowerCase().includes(input)) {
        if (propValue.toLowerCase().startsWith(input)) {
          autocompleteOptions.value.unshift(propValue);
        } else {
          autocompleteOptions.value.push(propValue);
        }
      }
    }
  } else {
    autocompletePopulateDefaultOptions();
  }
  autocompleteIsExpanded.value = true;
}
/**
 * Copies the prop data supplied by the parent element into a reactive variable,
 * autocompleteOptions, which can then be read and written to. Called when the
 * component is mounted, and called again in {@link autocompleteFilterData()} if
 * no valid matches are returned by the user-entered substring.
 */
function autocompletePopulateDefaultOptions(): void {
  if (!props.formData.options) return;
  for (let i = 0; i < props.formData.options.length; i++) {
    const propValue = props.formData.options[i].label;
    autocompleteOptions.value.push(propValue);
  }
}
/**
 * Handles blur events for the  custom autocomplete element. Creates a list of matches
 * by calling Array.prototype.filter on the autocompleteOptions reactive array and, if
 * the array length and input value length is greater than zero, emits the first result
 * at the zero index position and returns. If these conditions are not met, emits an empty
 * string as a value instead.
 * @param event {Event} The DOM event created by the click.
 */
function autocompleteHandleBlur(event: Event) {
  autocompleteIsFocused.value = false;
  const target = event.target as HTMLInputElement;
  const input = target.value.toLowerCase();
  const matches = autocompleteOptions.value.filter((option) =>
    option.toLowerCase().includes(input)
  );
  if (matches.length > 0 && input.length > 0) {
    emit("update:model-value", matches[0]);
    return;
  }
  emit("update:model-value", "");
}
/**
 * Computed function that checks to see if the autocomplete menu is open, if
 * the input element is focused or if the input element value is greater than
 * zero. If any of these conditions are met, returns a string value which is used
 * in the template to set an appropriate class which determines the position of
 * the form floating label. Uses Vue's computed function to manage this. Primarily
 * for brevity in the template.
 * @returns {(string|void)} The class to apply to the label element, or void/undefined
 * if a guard clause is met or none of the prerequisite conditions are met.
 */
const autocompleteDetermineLabelClass = computed((): string | void => {
  if (!autocompleteInput.value) return;
  let result = false;
  const input = autocompleteInput.value.value as string;
  if (
    autocompleteIsFocused.value ||
    autocompleteIsExpanded.value ||
    input.length > 0
  ) {
    result = true;
  }
  return result
    ? "autocomplete__label autocomplete__label--focused"
    : undefined;
});
/*
 * If the component is called with "autocomplete" as the specified type,
 * attach an event handler to the window to manage click events outside of
 * the autocomplete element and populate the autocompleteOptions reactive
 * variable with the supplied prop data.
 */
onMounted(() => {
  if (props.formData.elementType !== "autocomplete") return;
  document.addEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
  autocompletePopulateDefaultOptions();
});
/*
 * If the component is called with "autocomplete" as the specified type,
 * destroy all associated event handlers bound to the document.
 */
onUnmounted(() => {
  if (props.formData.elementType !== "autocomplete") return;
  document.removeEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
});
</script>

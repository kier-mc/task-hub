<template>
  <div class="autocomplete-wrapper">
    <div
      ref="autocompleteElement"
      :class="setParentClass"
      :id="props.data.attributes.id"
      @keyup.escape="isExpanded = false"
    >
      <div :class="setControlsClass">
        <label :class="setLabelClass" :for="props.data.attributes.id">
          {{ props.data.label }}
        </label>
        <input
          ref="inputElement"
          :class="setInputClass"
          :disabled="props.isDisabled"
          :placeholder="props.data.default"
          :value="props.emitTerm"
          @click="isExpanded = true"
          @input="handleInput($event)"
          @keyup.enter="selectFromList($event)"
          @focus="isExpanded = true"
        />
        <button
          :class="setClearButtonClass"
          :disabled="props.isDisabled"
          @click="clearInput()"
          type="button"
        >
          <SVGXMark class="autocomplete__icon--xmark" />
        </button>
        <button
          :class="setDropdownButtonClass"
          :disabled="props.isDisabled"
          @click="isExpanded = !isExpanded"
          type="button"
        >
          <SVGExpandMore class="autocomplete__icon" />
        </button>
      </div>
      <ul
        ref="menuElement"
        :class="setOptionsClass"
        :aria-expanded="setARIAExpandedState"
        tabindex="-1"
      >
        <li
          v-for="(data, index) in options"
          ref="listElements"
          :key="index"
          :class="setOptionClass"
          :tabindex="isExpanded ? 0 : -1"
          @click="selectFromList($event)"
          @keyup.enter="selectFromList($event)"
          @keyup.space="selectFromList($event)"
        >
          {{ data.term }}
        </li>
      </ul>
    </div>
    <span v-if="props.data.hint" class="autocomplete__hint">
      {{ props.data.hint }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
.autocomplete {
  position: relative;
  background-color: colour.$autocomplete-background;
  &:focus-within {
    &::before {
      opacity: 1;
    }
  }
  &::before {
    content: "";
    opacity: 0;
    position: absolute;
    inset: 0;
    z-index: -10;
    margin: -1px;
    background-color: colour.$input-border-focus;
    transition: opacity 200ms;
  }
  &__label {
    pointer-events: none;
    user-select: none;
    position: absolute;
    top: 50%;
    right: 0rem;
    left: 0rem;
    padding-inline: 0.75rem;
    font-size: 0.875rem;
    color: colour.$autocomplete-label;
    transform: translateY(-50%);
    transition: top 125ms, transform 125ms;
    transform-origin: top left;
    &--focused {
      top: 0.5rem;
      transform: scale(0.75);
    }
    &--mini {
      left: -5000px;
      overflow: hidden;
      width: 0;
      height: 0;
    }
  }
  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 3rem;
    border: 1px solid colour.$autocomplete-border;
    cursor: text;
    &--mini {
      min-height: 1.5rem;
    }
  }
  &__input {
    all: unset;
    position: relative;
    width: 100%;
    height: calc(3rem - 1rem);
    padding-inline: 0.5rem;
    padding-top: 1rem;
    margin-right: 1px;
    &--mini {
      padding: 0.25rem;
      height: 1.25rem;
    }
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    min-width: 3rem;
    background-color: colour.$button-background;
    cursor: pointer;
    transition: background-color 125ms;
    &:focus {
      outline: 1px solid colour.$autocomplete-border-focus;
    }
    &:focus,
    &:hover {
      background-color: colour.$button-background-hover;
    }
    &--clear {
      min-width: 1.5rem;
      border-radius: 50%;
      margin-inline: 0.5rem;
      &:hover {
        background-color: colour.$button-background-hover;
      }
    }
    &--dropdown {
      border-left: colour.$autocomplete-border;
    }
    &--mini {
      // Desired width plus inline input padding * 2
      min-width: calc(1.25rem + 0.5rem);
    }
    &--clear.autocomplete__button--mini {
      min-width: calc(0.75rem + 0.5rem);
    }
  }
  &__icon {
    max-width: 2rem;
    fill: colour.$button-font;
    &--xmark {
      max-width: 1rem;
      fill: colour.$button-font;
    }
  }
  &__options {
    all: unset;
    visibility: hidden;
    overflow-y: scroll;
    text-overflow: ellipsis;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    height: 0;
    z-index: 100;
    border-inline: 1px solid colour.$autocomplete-border;
    border-bottom: 1px solid transparent;
    margin-top: 1px;
    background-color: colour.$autocomplete-options-background;
    box-shadow: effect.$drop-shadow-2;
    font-size: 0.925rem;
    transition: height 175ms ease-in-out, visibility 200ms;
    &[aria-expanded="true"] {
      visibility: visible;
      height: min(v-bind(optionsMinimumHeight), 11rem);
      border-bottom: 1px solid colour.$autocomplete-border;
      z-index: 100;
      .autocomplete::before {
        opacity: 1;
      }
    }
    &[aria-expanded="true"] .autocomplete__option {
      opacity: 1;
    }
  }
  &__option {
    all: unset;
    opacity: 0;
    display: flex;
    align-items: center;
    height: 2.5rem;
    padding-inline: calc(0.5rem - 2px);
    border: 2px solid transparent;
    background-color: colour.$autocomplete-option-background-a;
    cursor: pointer;
    transition: background-color 100ms ease-in-out, opacity 150ms ease-in-out;
    &:nth-child(even) {
      background-color: colour.$autocomplete-option-background-b;
    }
    &:focus {
      border: 2px solid colour.$autocomplete-background;
    }
    &:focus,
    &:hover {
      background-color: colour.$autocomplete-option-background-hover;
    }
  }
  &__hint {
    display: flex;
    align-items: center;
    height: 1rem;
    padding-inline: 0.25rem;
    margin-top: 0.125rem;
    font-size: 0.75rem;
    color: colour.$font-dark-translucent;
  }
}
</style>

<script setup lang="ts">
// Types
import type {
  AutocompleteEmitData,
  FormAutocompletePropData,
} from "types/forms";

// Prop definitions
const props = defineProps({
  data: {
    type: Object as PropType<FormAutocompletePropData>,
    required: true,
  },
  isDisabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  emitTerm: {
    type: [String, null] as PropType<string | null>,
    required: true,
  },
  emitData: {
    type: [Object, null] as PropType<object | null>,
    required: true,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-term", data: string | null): void;
  (event: "update:emit-data", data: Object | null): void;
}>();

// Emit handler
function emitHandler(term: string | null, data: Object | null): void {
  emit("update:emit-term", term);
  emit("update:emit-data", data);
}

// Nonreactive variables
let timeout: NodeJS.Timeout | undefined;

// Reactive variables
const isExpanded: Ref<boolean> = ref(false);
const options: Ref<Array<AutocompleteEmitData>> = ref([]);
const forceRefresh: Ref<number> = ref(0);

// Template refs
const autocompleteElement: Ref<HTMLDivElement | null> = ref(null);
const inputElement: Ref<HTMLInputElement | null> = ref(null);
const menuElement: Ref<HTMLUListElement | null> = ref(null);
const listElements: Ref<Array<HTMLLIElement | null>> = ref([]);

// Computed properties
const setParentClass = computed(() => {
  return props.data.style
    ? `autocomplete autocomplete--${props.data.style}`
    : "autocomplete";
});

const setControlsClass = computed(() => {
  return props.data.style
    ? `autocomplete__controls autocomplete__controls--${props.data.style}`
    : "autocomplete__controls";
});

const setLabelClass = computed((): string | void => {
  if (!inputElement.value) return;
  forceRefresh.value;
  const element = inputElement.value;
  const input = element.value;
  let result = false;
  if (isExpanded.value || input.length > 0) {
    result = true;
  }
  if (props.data.style) {
    return result
      ? `autocomplete__label--${props.data.style} autocomplete__label--focused--${props.data.style}`
      : `autocomplete__label--${props.data.style}`;
  }
  return result
    ? "autocomplete__label autocomplete__label--focused"
    : "autocomplete__label";
});

const setInputClass = computed(() => {
  return props.data.style
    ? `autocomplete__input autocomplete__input--${props.data.style}`
    : "autocomplete__input";
});

const setClearButtonClass = computed(() => {
  return props.data.style
    ? `autocomplete__button autocomplete__button--clear autocomplete__button--${props.data.style}`
    : "autocomplete__button autocomplete__button--clear";
});

const setDropdownButtonClass = computed(() => {
  return props.data.style
    ? `autocomplete__button autocomplete__button--dropdown autocomplete__button--${props.data.style}`
    : "autocomplete__button autocomplete__button--dropdown";
});

const setOptionsClass = computed(() => {
  return props.data.style
    ? `autocomplete__options autocomplete__options--${props.data.style}`
    : "autocomplete__options";
});

const setOptionClass = computed(() => {
  return props.data.style
    ? `autocomplete__option autocomplete__option--${props.data.style}`
    : "autocomplete__option";
});

const setARIAExpandedState = computed(() => {
  if (options.value.length === 0) return false;
  return isExpanded.value;
});

const optionsMinimumHeight = computed(() => {
  const multiplier = options.value.length * 0.25;
  return `${options.value.length * 2.5 + multiplier}rem`;
});

// Logic
function populateDefaultOptions() {
  if (!props.data.options) return;
  options.value = [...props.data.options];
}

async function handleInput(event: Event): Promise<void> {
  if (!props.data.options) return;
  const target = event.target as HTMLInputElement;
  const propOptions = props.data.options;
  const searchValue = target.value;
  let dataValue: Object | null = null;
  if (propOptions) {
    for (let i = 0; i < propOptions.length; i++) {
      const item = propOptions[i];
      if (searchValue.toLocaleLowerCase() === item.term?.toLocaleLowerCase()) {
        dataValue = item.data;
        break;
      }
    }
  }
  emitHandler(searchValue, dataValue);
  await nextTick();
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(filterData, 400);
}

function filterData(): void {
  if (!props.data.options) {
    console.warn("No options provided to autocomplete component!");
    return;
  }
  // Reset current options list
  options.value = [];
  // Create an array for partial substring matches
  const partialMatches = [];
  // Get search string
  const target = inputElement.value as HTMLInputElement;
  const predicate = target.value;
  // Filter results by substring, or return default prop data if no matches detected
  if (predicate) {
    for (let i = 0; i < props.data.options.length; i++) {
      const term = props.data.options[i].term;
      const data = props.data.options[i].data;
      const result: AutocompleteEmitData = {
        term: null,
        data: null,
      };
      const regex = new RegExp(`^${predicate.toLocaleLowerCase()}`);
      // Matching the beginning of the string takes precedent
      if (term) {
        if (regex.test(term.toLocaleLowerCase())) {
          result.term = term;
          result.data = data;
          options.value.push(result);
        }
        // Substrings are returned as partial matches at the end of the array
        else if (
          term.toLocaleLowerCase().includes(predicate.toLocaleLowerCase())
        ) {
          result.term = term;
          result.data = data;
          partialMatches.push(result);
        }
      }
    }
  } else {
    populateDefaultOptions();
  }
  options.value = [...options.value, ...partialMatches];
}

async function clearInput() {
  emitHandler(null, null);
  await nextTick();
  filterData();
  forceRefresh.value++;
}

function findOptionData(predicate: string): AutocompleteEmitData {
  let start = 0;
  let end = options.value.length - 1;
  const payload = <AutocompleteEmitData>{
    term: null,
    data: null,
  };
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const normalisedTerm = options.value[mid].term // https://claritydev.net/blog/diacritic-insensitive-string-comparison-javascript
      ?.normalize("NFD") // Convert to unicode
      .replace(/[\u0300-\u036f]/g, "") // Remove all diacritic characters
      .toLowerCase(); // Convert to lowercase
    const normalisedPredicate = predicate
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (normalisedTerm === normalisedPredicate) {
      payload.term = options.value[mid].term;
      payload.data = options.value[mid].data;
      return payload;
    } else if (normalisedTerm! < normalisedPredicate) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return payload;
}

async function selectFromList(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | HTMLLIElement;
  let { term, data } = <AutocompleteEmitData>{
    term: null,
    data: null,
  };
  if (target === inputElement.value) {
    term = options.value[0].term;
    data = options.value[0].data;
  } else if (listElements.value.includes(target as HTMLLIElement)) {
    const option = findOptionData(target.textContent!);
    term = option.term;
    data = option.data;
  }
  emitHandler(term, data);
  await nextTick();
  isExpanded.value = false;
  filterData();
}

onClickOutside(autocompleteElement, () => {
  isExpanded.value = false;
});

onMounted(async () => {
  filterData();
});
</script>
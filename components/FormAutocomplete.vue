<template>
  <div
    :class="setParentClass"
    :id="props.formData.formID"
    @keyup.escape="isExpanded = false"
  >
    <div :class="setControlsClass">
      <label :class="setLabelClass" :for="props.formData.formID">
        {{ props.formData.labelText }}
      </label>
      <input
        ref="inputElement"
        :class="setInputClass"
        :value="props.emitLabel"
        @click="isExpanded = true"
        @input="handleInput($event)"
        @keyup.enter="selectFromList($event)"
      />
      <button :class="setClearButtonClass" @click="clearInput()" type="button">
        <SVGXMark class="autocomplete__icon" />
      </button>
      <button
        :class="setDropdownButtonClass"
        @click="isExpanded = !isExpanded"
        type="button"
      >
        <SVGExpandMore class="autocomplete__icon" />
      </button>
    </div>
    <ul
      ref="menuElement"
      :class="setULClass"
      :aria-expanded="setARIAExpandedState"
      tabindex="-1"
    >
      <li
        v-for="(data, index) in options"
        ref="listElements"
        :key="index"
        :data-value="data.value"
        :class="setLIClass"
        :tabindex="isExpanded ? 0 : -1"
        @click="selectFromList($event)"
        @keyup.enter="selectFromList($event)"
        @keyup.space="selectFromList($event)"
      >
        {{ data.label }}
      </li>
    </ul>
  </div>
  <span v-if="props.formData.hintText" class="autocomplete__hint">
    {{ props.formData.hintText }}
  </span>
</template>

<style scoped lang="scss">
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
    min-height: 48px;
    border: 1px solid hsl(0, 0%, 30%);
    cursor: text;
    &--mini {
      min-height: 24px;
    }
  }
  &__input {
    all: unset;
    position: relative;
    width: 100%;
    // Height of the button minus the padding-top value
    height: calc(48px - 1rem);
    padding-inline: 0.5rem;
    padding-top: 1rem;
    margin-right: 1px;
    &--mini {
      padding: 0.25rem;
      height: 24px;
    }
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    min-width: 48px;
    background-color: hsl(0, 0%, 10%);
    cursor: pointer;
    transition: background-color 125ms;
    &:hover {
      background-color: hsl(0, 0%, 15%);
    }
    &--clear {
      min-width: 24px;
      border-radius: 50%;
      margin-inline: 0.5rem;
      &:hover {
        background-color: hsl(0, 0%, 20%);
      }
    }
    &--dropdown {
      border-left: 1px solid hsl(0, 0%, 30%);
    }
    &--mini {
      // Desired width plus inline input padding * 2
      min-width: calc(24px + 0.5rem);
    }
    &--clear.autocomplete__button--mini {
      min-width: calc(12px + 0.5rem);
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
    padding-inline: 0.5rem;
    padding-block: 0.75rem;
    cursor: pointer;
    transition: background-color 100ms;
    &:hover,
    &:focus {
      background-color: hsl(0, 0%, 10%);
    }
  }
  &__hint {
    margin-bottom: 0.25rem;
    margin-left: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.5;
  }
  &__input:focus,
  &__button:focus,
  &__li:focus {
    outline: 1px solid hsl(0, 0%, 50%);
  }
}
</style>

<script setup lang="ts">
// Prop definitions
const props = defineProps({
  formData: {
    type: Object as PropType<FormHandlerData>,
    required: true,
  },
  emitLabel: {
    type: [String, null] as PropType<string | null>,
    required: true,
  },
  emitValue: {
    type: [String, null] as PropType<string | null>,
    required: true,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-label", data: string | null): void;
  (event: "update:emit-value", data: string | null): void;
}>();

// Emit handler
function emitData(label: string | null, value: string | null): void {
  emit("update:emit-label", label);
  emit("update:emit-value", value);
}

// Reactive variables
const isExpanded: Ref<boolean> = ref(false);
const options: Ref<Array<AutocompleteEmitData>> = ref([]);
const forceRefresh: Ref<number> = ref(0);

// Template refs
const inputElement: Ref<HTMLInputElement | null> = ref(null);
const menuElement: Ref<HTMLUListElement | null> = ref(null);
const listElements: Ref<Array<HTMLLIElement | null>> = ref([]);

// Computed properties
const setParentClass = computed(() => {
  return props.formData.style
    ? `autocomplete autocomplete--${props.formData.style}`
    : "autocomplete";
});

const setControlsClass = computed(() => {
  return props.formData.style
    ? `autocomplete__controls autocomplete__controls--${props.formData.style}`
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
  if (props.formData.style) {
    return result
      ? `autocomplete__label--${props.formData.style} autocomplete__label--focused--${props.formData.style}`
      : `autocomplete__label--${props.formData.style}`;
  }
  return result
    ? "autocomplete__label autocomplete__label--focused"
    : "autocomplete__label";
});

const setInputClass = computed(() => {
  return props.formData.style
    ? `autocomplete__input autocomplete__input--${props.formData.style}`
    : "autocomplete__input";
});

const setClearButtonClass = computed(() => {
  return props.formData.style
    ? `autocomplete__button autocomplete__button--clear autocomplete__button--${props.formData.style}`
    : "autocomplete__button autocomplete__button--clear";
});

const setDropdownButtonClass = computed(() => {
  return props.formData.style
    ? `autocomplete__button autocomplete__button--dropdown autocomplete__button--${props.formData.style}`
    : "autocomplete__button autocomplete__button--dropdown";
});

const setULClass = computed(() => {
  return props.formData.style
    ? `autocomplete__ul autocomplete__ul--${props.formData.style}`
    : "autocomplete__ul";
});

const setLIClass = computed(() => {
  return props.formData.style
    ? `autocomplete__li autocomplete__li--${props.formData.style}`
    : "autocomplete__li";
});

const setARIAExpandedState = computed(() => {
  if (options.value.length === 0) return false;
  return isExpanded.value;
});

// Logic
function populateDefaultOptions() {
  if (!props.formData.options) return;
  options.value = [...props.formData.options];
}

async function handleInput(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const label = target.value as string;
  emitData(label, null);
  await nextTick();
  filterData();
}

function filterData(): void {
  if (!props.formData.options) return;
  // Reset current options list
  options.value = [];
  // Create an array for partial substring matches
  const partialMatches = [];
  // Get search string
  const target = inputElement.value as HTMLInputElement;
  const string = target.value;
  // Filter results by substring, or return default prop data if no matches detected
  if (string) {
    for (let i = 0; i < props.formData.options.length; i++) {
      const label = props.formData.options[i].label;
      const value = props.formData.options[i].value;
      const result = {
        label: "",
        value: "",
      };
      const regex = new RegExp(`^${string.toLocaleLowerCase()}`);
      if (regex.test(label.toLocaleLowerCase())) {
        result.label = label;
        result.value = value;
        options.value.push(result);
      } else if (
        label.toLocaleLowerCase().includes(string.toLocaleLowerCase())
      ) {
        result.label = label;
        result.value = value;
        partialMatches.push(result);
      }
    }
  } else {
    populateDefaultOptions();
  }
  options.value = [...options.value, ...partialMatches];
}

async function clearInput() {
  emitData(null, null);
  await nextTick();
  filterData();
  forceRefresh.value++;
}

async function selectFromList(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | HTMLLIElement;
  let { label, value } = <AutocompleteEmitData>{
    label: null,
    value: null,
  };
  if (target === inputElement.value) {
    label = options.value[0].label;
    value = options.value[0].value;
  } else if (listElements.value.includes(target as HTMLLIElement)) {
    label = target.textContent;
    value = target.getAttribute("data-value");
  }
  emitData(label, value);
  await nextTick();
  isExpanded.value = false;
  filterData();
}

async function handleBlur(event: Event) {
  if (!inputElement.value) return;
  const target = event.target as Element;
  const isClickInside = target.closest(`#${props.formData.formID}`);
  if (isClickInside) return;
  let label = "";
  let value = "";
  const input = inputElement.value;
  if (options.value.length > 0 && input.value.length > 0) {
    label = options.value[0].label as string;
    value = options.value[0].value as string;
  }
  emitData(label, value);
  await nextTick();
  isExpanded.value = false;
  filterData();
}

function closeMenuWithClickOutside(event: Event): void {
  if (!isExpanded.value) return;
  const target = event.target as Element;
  const isClickInside = target.closest(`#${props.formData.formID}`);
  if (!isClickInside) {
    isExpanded.value = false;
  }
}

onMounted(async () => {
  // Attach event handlers
  document.addEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
  // Populate local options with prop data
  filterData();
});

onUnmounted(() => {
  // Destroy event handler
  document.removeEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
});
</script>

<template>
  <div class="form-group">
    <!-- If element is input -->
    <template v-if="props.formData.elementType === 'input'">
      <label class="form-group__label" :for="props.formData.formID">{{
        props.formData.labelText
      }}</label>
      <input
        class="form-group__input"
        :type="props.formData.attrType"
        :id="props.formData.formID"
        :name="props.formData.formID"
        :autocomplete="
          props.formData.autocomplete ? props.formData.autocomplete : 'on'
        "
        :value="modelValue"
        @input="emitEvent($event)"
      />
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
          {{ option.text }}
        </option>
      </select>
    </template>
    <!-- If element is autocomplete -->
    <template v-else-if="props.formData.elementType === 'autocomplete'">
      <div class="autocomplete" @keyup.escape="autocompleteIsExpanded = false">
        <div class="autocomplete__controls">
          <div
            class="autocomplete__focusable"
            @click="autocompleteHandleClick($event)"
          >
            <label
              class="autocomplete__label"
              :class="determineLabelClass"
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
              @focus="searchData($event)"
              @blur="handleBlur($event)"
              @input="emitEvent($event)"
              @keyup="searchData($event)"
            />
          </div>
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
            @click="autocompleteAddOption($event)"
            @keyup.enter="autocompleteAddOption($event)"
            @keyup.space="autocompleteAddOption($event)"
          >
            {{ data }}
          </li>
        </ul>
      </div>
      <!-- DEBUG - REMOVE WHEN SATISFIED -->
      {{ props.modelValue }}
    </template>
  </div>
</template>

<style scoped lang="scss">
$input-padding: 0.5rem;
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  &__label {
    margin-bottom: 0.5rem;
    letter-spacing: 0.05rem;
  }
  &__input {
    all: unset;
    padding: $input-padding;
    border: 1px solid hsl(0, 0%, 25%);
    border-radius: 0.25rem;
    background-color: hsl(0, 0%, 10%);
    cursor: text;
  }
  &__hint {
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    opacity: 0.5;
  }
  &__label,
  &__hint {
    margin-left: calc($input-padding / 2);
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
    align-items: center;
    min-height: 48px;
    border: 1px solid hsl(0, 0%, 30%);
    cursor: text;
  }
  &__focusable {
    display: flex;
    height: 48px;
    border-right: 1px solid hsl(0, 0%, 30%);
  }
  &__input {
    all: unset;
    min-width: 256px;
    padding-inline: 0.5rem;
    margin-top: 1rem;
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
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
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
    padding-block: 0.5rem;
    transition: background-color 100ms;
    &:hover {
      background-color: hsl(0, 0%, 10%);
      cursor: pointer;
    }
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
const autocompleteIsFocused: Ref<boolean> = ref(false);
const autocompleteIsExpanded: Ref<boolean> = ref(false);
const autocompleteOptions: Ref<Array<string>> = ref([]);
// Template refs
const autocompleteInput: Ref<HTMLInputElement | null> = ref(null);
const autocompleteMenu: Ref<HTMLUListElement | null> = ref(null);
const autocompleteItems: Ref<HTMLLIElement[] | null[]> = ref([]);
// New functions
function autocompleteHandleClick(event: Event): void {
  if (!autocompleteMenu.value) return;
  const target = event.target as HTMLElement;
  if (target.closest(".autocomplete__focusable")) {
    autocompleteIsExpanded.value = true;
  } else if (target.closest(".autocomplete__button")) {
    if (autocompleteIsExpanded.value) {
      autocompleteIsExpanded.value = false;
    } else {
      autocompleteIsExpanded.value = true;
    }
  }
}

async function autocompleteAddOption(event: Event) {
  if (!autocompleteInput.value) return;
  const target = event.target as HTMLLIElement;
  emit("update:model-value", target.textContent ?? "");
  await nextTick();
  autocompleteIsExpanded.value = false;
}

function closeMenuWithClickOutside(event: Event) {
  if (!autocompleteInput.value || !autocompleteMenu.value) return;
  const target = event.target as Element;
  const isClickInside = target.closest(".autocomplete");
  if (!isClickInside) {
    autocompleteIsExpanded.value = false;
    autocompleteInput.value.blur();
  }
}

function searchData(event: Event) {
  if (!props.formData.options) return;
  autocompleteOptions.value = [];
  const target = event.target as HTMLInputElement;
  const input = target.value.toLowerCase();
  if (input) {
    for (let i = 0; i < props.formData.options.length; i++) {
      const propValue = props.formData.options[i].text;
      if (propValue.toLowerCase().includes(input)) {
        if (propValue.toLowerCase().startsWith(input)) {
          autocompleteOptions.value.unshift(propValue);
        } else {
          autocompleteOptions.value.push(propValue);
        }
      }
    }
  } else {
    populateDefaultOptions();
  }
  autocompleteIsExpanded.value = true;
}

function populateDefaultOptions() {
  if (!props.formData.options) return;
  for (let i = 0; i < props.formData.options.length; i++) {
    const propValue = props.formData.options[i].text;
    autocompleteOptions.value.push(propValue);
  }
}

function handleBlur(event: Event) {
  autocompleteIsFocused.value = false;
  const target = event.target as HTMLInputElement;
  const input = target.value.toLowerCase();
  const matches = autocompleteOptions.value.filter((option) =>
    option.toLowerCase().includes(input)
  );
  if (matches.length > 0 && input.length > 0) {
    emit("update:model-value", matches[0]);
  }
}

const determineLabelClass = computed(() => {
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

onMounted(() => {
  document.addEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
  populateDefaultOptions();
});

onUnmounted(() => {
  document.removeEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
});
</script>

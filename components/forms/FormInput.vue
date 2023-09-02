<template>
  <div class="input-wrapper">
    <div class="input" :aria-disabled="props.isDisabled">
      <label :class="setLabelClass" :for="setIDAttribute">
        {{ props.data.label }}
      </label>
      <input
        ref="inputElement"
        class="input__element"
        :type="setTypeAttribute"
        :id="setIDAttribute"
        :name="setIDAttribute"
        :autocomplete="setAutocompleteAttribute"
        :value="props.emitValue"
        :disabled="props.isDisabled"
        :aria-disabled="props.isDisabled"
        @input="emitHandler()"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <div v-if="props.data.hint" class="input__hint">
      {{ props.data.hint }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";
.input {
  position: relative;
  box-shadow: effect.$drop-shadow-xs;
  &:focus-within {
    &::before {
      opacity: 1;
    }
  }
  &[aria-disabled="true"] {
    opacity: 0.5;
  }
  &::before {
    content: "";
    opacity: 0;
    position: absolute;
    inset: 0;
    margin: -1px;
    background-color: colour.$input-border-focus;
    transition: opacity 500ms easing.$ease-out-quart;
  }
  /* prettier-ignore */
  &__label {
    position: absolute;
    top: 50%;
    right: 0rem;
    left: 0rem;
    z-index: 10;
    padding-inline: 0.75rem;
    font-size: fontsize.$xs;
    user-select: none;
    color: colour.$font-dark;
    cursor: text;
    transform: translateY(-50%);
    transform-origin: top left;
    transition:
      top 250ms easing.$ease-out-quint,
      transform 250ms easing.$ease-out-quint;
    &--focused {
      top: 0.5rem;
      transform: scale(0.75);
    }
  }
  &__element {
    all: unset;
    position: relative;
    width: calc(calc(100% - 1rem) - 2px);
    min-height: calc(48px - 1rem);
    padding-top: 1rem;
    padding-inline: 0.5rem;
    border: 1px solid colour.$input-border;
    font-size: fontsize.$sm;
    background-color: colour.$input-background;
    cursor: text;
    &:disabled {
      cursor: not-allowed;
    }
  }
  &__hint {
    display: flex;
    align-items: center;
    height: 1rem;
    padding-inline: 0.25rem;
    margin-top: 0.125rem;
    font-size: fontsize.$xxxs;
    color: colour.$font-dark-translucent;
  }
}
</style>

<script setup lang="ts">
// Types
import type { FormInputPropData } from "~/types/components/forms";

// Prop definitions
const props = defineProps({
  data: {
    type: Object as PropType<FormInputPropData>,
    required: true,
  },
  emitValue: {
    type: [String, null] as PropType<string | null>,
    default: null,
    required: true,
  },
  isDisabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-value", data: string | null): void;
}>();

// Emit handler
function emitHandler(): void {
  if (!inputElement.value) return;
  const data = inputElement.value.value;
  emit("update:emit-value", data);
}

// Reactive variables
const isFocused: Ref<boolean> = ref(false);

// Template refs
const inputElement: Ref<HTMLInputElement | null> = ref(null);

// Computed properties
const setLabelClass = computed(() => {
  const containsData = props.emitValue;
  return isFocused.value || containsData
    ? "input__label input__label--focused"
    : "input__label";
});
const setTypeAttribute = computed(() => {
  return props.data.attributes.type ? props.data.attributes.type : "text";
});
const setIDAttribute = computed(() => {
  return props.data.attributes.id;
});
const setAutocompleteAttribute = computed(() => {
  return props.data.attributes.autocomplete
    ? props.data.attributes.autocomplete
    : "on";
});
</script>

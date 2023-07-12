<template>
  <div class="input-wrapper">
    <div class="input">
      <label :class="setLabelClass" :for="setIDAttribute">
        {{ props.formData.label }}
      </label>
      <input
        ref="inputElement"
        class="input__element"
        :type="setTypeAttribute"
        :id="setIDAttribute"
        :name="setIDAttribute"
        :autocomplete="setAutocompleteAttribute"
        :value="props.emitLabel"
        @input="emitEvent()"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <span v-if="props.formData.hint" class="input__hint">
      {{ props.formData.hint }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.input {
  position: relative;
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
  &__element {
    all: unset;
    box-sizing: content-box;
    width: calc(calc(100% - 1rem) - 2px);
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
    type: [String, null] as PropType<String | null>,
    required: true,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:emit-label", data: string | null): void;
}>();

// Emit handler
function emitEvent(): void {
  if (!inputElement.value) return;
  const label = inputElement.value.value;
  emit("update:emit-label", label);
}

// Reactive variables
const isFocused: Ref<boolean> = ref(false);

// Template refs
const inputElement: Ref<HTMLInputElement | null> = ref(null);

// Computed properties
const setLabelClass = computed((): string | void => {
  if (!inputElement.value) return;
  let result = false;
  const value = inputElement.value.value;
  if (isFocused.value || value.length > 0) {
    result = true;
  }
  return result ? "input__label input__label--focused" : "input__label";
});

const setTypeAttribute = computed(() => {
  return props.formData.attributes.type;
});
const setIDAttribute = computed(() => {
  return props.formData.attributes.id;
});
const setAutocompleteAttribute = computed(() => {
  return props.formData.attributes.autocomplete
    ? props.formData.attributes.autocomplete
    : "on";
});
</script>

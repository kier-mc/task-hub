<template>
  <div class="form-group">
    <!-- If element is input -->
    <template v-if="props.formData.elementType === 'input'">
      <div class="form-group__wrapper">
        <label :class="inputDetermineLabelClass" :for="props.formData.formID"
          >{{ props.formData.labelText }}
        </label>
        <input
          ref="inputElement"
          class="form-group__input"
          :type="props.formData.attrType"
          :id="props.formData.formID"
          :name="props.formData.formID"
          :autocomplete="
            props.formData.autocomplete ? props.formData.autocomplete : 'on'
          "
          :value="emitValue"
          @input="emitEvent($event)"
          @focus="inputElementIsFocused = true"
          @blur="inputElementIsFocused = false"
        />
      </div>
      <span v-if="props.formData.hintText" class="hint">
        {{ props.formData.hintText }}
      </span>
    </template>
    <!-- If element is select -->
    <!-- <template v-else-if="props.formData.elementType === 'select'">
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
    </template> -->
  </div>
</template>

<style scoped lang="scss">
$input-padding: 0.5rem;
.form-group {
  display: flex;
  flex-direction: column;
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
    box-sizing: content-box;
    width: calc(
      calc(100% - 1rem) - 2px
    ); // Minus inline-padding * 2 minus border
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
  &__select {
    padding: 0.5rem 0.5rem 0.5rem 0.35rem;
    border: 1px solid hsl(0, 0%, 30%);
    font-size: 1rem;
  }
}
.hint {
  margin-bottom: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.5;
}
</style>

<script setup lang="ts">
const props = defineProps({
  formData: {
    type: Object as PropType<FormHandlerData>,
    required: true,
  },
  emitValue: {
    type: [String, null] as PropType<String | null>,
    required: true,
  },
});

const emit = defineEmits<{
  (event: "update:emit-value", value: string | null): void;
}>();

function emitEvent(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const inputValue = target.value;
  emit("update:emit-value", inputValue);
}

// Reactive variables
const inputElementIsFocused: Ref<boolean> = ref(false);

// Template refs
const inputElement: Ref<HTMLInputElement | null> = ref(null);

// Computed properties
const inputDetermineLabelClass = computed((): string | void => {
  if (!inputElement.value) return;
  let result = false;
  const value = inputElement.value.value;
  if (inputElementIsFocused.value || value.length > 0) {
    result = true;
  }
  return result
    ? "form-group__label form-group__label--focused"
    : "form-group__label";
});
</script>

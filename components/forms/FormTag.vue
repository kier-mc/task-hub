<template>
  <button type="button" :class="setTagClass">
    <div class="tag__label">{{ props.data.label }}</div>
  </button>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/fontsize";
/* prettier-ignore */
.tag {
  all: unset;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border: 1px solid colour.$gunmetal-500;
  border-radius: 0.2rem;
  background-color: colour.$gunmetal-600;
  color: colour.$light;
  text-align: center;
  transition:
    background-color easing.$ease-out-quart 500ms,
    transform easing.$ease-out-quart 100ms;
  cursor: v-bind(setCursorType);
  &:hover {
    transform: scale(1.05);
    background-color: colour.$gunmetal-500;
  }
  &--selected {
    border: 1px solid colour.$mint-300;
    background-color: colour.$mint-400;
    &:hover {
      background-color: colour.$mint-400;
    }
  }
  &__label {
    pointer-events: none;
    font-size: fontsize.$xs;
    letter-spacing: 0.0125rem;
    text-transform: capitalize;
  }
}
</style>

<script setup lang="ts">
// Types
import type { FormTagPropData } from "~/types/components/forms";

// Prop definitions
const props = defineProps({
  data: {
    type: Object as PropType<FormTagPropData>,
    required: true,
  },
  isSelected: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  readOnly: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
});

// Computed properties
const setTagClass = computed(() => {
  return props.isSelected ? "tag tag--selected" : "tag";
});

const setCursorType = computed(() => {
  return props.readOnly ? "default" : "pointer";
});
</script>

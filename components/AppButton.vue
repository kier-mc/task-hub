<template>
  <button
    ref="button"
    type="button"
    class="button"
    :disabled="props.isDisabled"
    :aria-disabled="props.isDisabled"
    @click="props.data.function"
  >
    <Transition name="transition-fade-opacity">
      <AppLoadingIndicator
        v-if="isLoading"
        class="button__loading"
        display="dots"
      />
      <div v-else class="button__display">
        <component :is="data.icon" class="button__icon" />
        <div class="button__label">{{ data.label }}</div>
      </div>
    </Transition>
  </button>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";
.button {
  all: unset;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: v-bind(buttonWidth);
  height: 2rem;
  padding-inline: 0.5rem;
  border: 1px solid colour.$button-border;
  border-radius: 4px;
  background-color: colour.$button-background;
  box-shadow: effect.$drop-shadow-sm;
  user-select: none;
  text-rendering: optimizeLegibility;
  font-variant: tabular-nums;
  font-size: fontsize.$sm;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.05rem;
  color: colour.$button-font;
  transition: background-color 125ms ease-in-out, border 125ms ease-in-out,
    opacity 200ms ease-in-out;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border: 1px solid colour.$button-border;
      background-color: colour.$button-background;
    }
  }
  &:focus {
    outline: 2px solid colour.$button-focus;
  }
  &:hover {
    border: 1px solid colour.$button-border-hover;
    background-color: colour.$button-background-hover;
    color: colour.$button-font-hover;
  }
  &__loading {
    position: absolute;
    inset: 0;
    height: inherit;
    margin-inline: auto;
    fill: colour.$font-light;
  }
  &__display {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__icon {
    aspect-ratio: 1/1;
    width: 1rem;
    margin-right: 0.25rem;
    fill: colour.$font-light;
  }
}
.transition-fade-opacity-enter-active,
.transition-fade-opacity-leave-active {
  visibility: visible;
  opacity: 1;
  transition: opacity 200ms ease, visibility 200ms ease;
}

.transition-fade-opacity-enter-from,
.transition-fade-opacity-leave-to {
  visibility: hidden;
  opacity: 0;
}
</style>

<script setup lang="ts">
// Types
import type {
  ButtonPropData,
  LoadingIndicatorPropData,
} from "types/components/app";

// Prop definitions
const props = defineProps({
  data: {
    type: Object as PropType<ButtonPropData>,
    required: true,
  },
  isLoading: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  isDisabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
});

// Template refs
const button: Ref<HTMLButtonElement | null> = ref(null);

// Computed properties
const buttonWidth = computed(() => {
  return button.value ? `${button.value.clientWidth}px` : "auto";
});
</script>

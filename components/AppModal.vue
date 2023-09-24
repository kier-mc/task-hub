<template>
  <div :class="setBackdropVisibility">
    <dialog ref="modalElement" class="modal">
      <header class="modal__header">
        <h4 class="modal__title">{{ props.title }}</h4>
        <button class="modal__button" type="button" @click="closeModal()">
          <SVGXMark class="modal__icon" />
        </button>
      </header>
      <div class="modal__content">
        <slot />
      </div>
    </dialog>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";

/* prettier-ignore */
.backdrop {
  @at-root ::backdrop {
  opacity: 0;
  }
  visibility: hidden;
  position: fixed;
  inset: 0;
  transition:
    visibility 175ms easing.$ease-out-quart,
    background-color 175ms easing.$ease-out-quart,
    backdrop-filter 175ms easing.$ease-out-quart;
  &--visible {
    visibility: visible;
    background-color: colour.$modal-backdrop;
    backdrop-filter: blur(0.25rem);
  }
}
.modal {
  position: fixed;
  overflow: visible;
  inset: 0;
  opacity: 0;
  width: 100%;
  max-width: 40ch;
  padding: 0;
  margin-inline: auto;
  margin-top: 2rem;
  border: 0;
  box-shadow: effect.$drop-shadow-lg;
  transition: opacity 175ms easing.$ease-out-quart;
  &[open] {
    opacity: 1;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    padding-left: 1rem;
    background-image: colour.$window-title;
    color: colour.$font-light;
  }
  &__title {
    all: unset;
    font-size: 1.025rem;
    font-weight: bold;
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    width: 3rem;
    cursor: pointer;
    &:hover .modal__icon {
      fill: colour.$cerise-500;
    }
  }
  &__icon {
    pointer-events: none;
    aspect-ratio: 1/1;
    width: 2rem;
    fill: colour.$icon-light;
    transition: fill 250ms easing.$ease-out-quart;
  }
}
</style>

<script setup lang="ts">
// Prop definitions
const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: true,
    default: "",
  },
  showModal: {
    type: Boolean as PropType<boolean>,
    default: true,
    required: true,
  },
});

// Emit definitions
const emit = defineEmits<{
  (event: "update:show-modal", data: boolean): void;
}>();

// Emit handler
function closeModal(): void {
  if (!modalElement.value) return;
  const modal = modalElement.value;
  modal.close();
  emit("update:show-modal", false);
}

// Template refs
const modalElement: Ref<HTMLDialogElement | null> = ref(null);

// Computed properties
const setBackdropVisibility = computed(() => {
  return props.showModal ? "backdrop backdrop--visible" : "backdrop";
});

// Watchers
watch(
  () => props.showModal,
  (isVisible) => {
    if (!modalElement.value) return;
    const modal = modalElement.value;
    isVisible ? modal.showModal() : modal.close();
  }
);

// Event handlers
onKeyStroke("Escape", (event: KeyboardEvent) => {
  event.preventDefault();
  closeModal();
});
</script>

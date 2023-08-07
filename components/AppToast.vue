<template>
  <section
    id="toast"
    class="toast"
    :data-active="notificationsStore.message ? true : false"
  >
    <div class="toast__header">
      <h2 class="toast__title">
        {{ notificationsStore.title }}
      </h2>
      <button
        type="button"
        class="toast__close-button"
        aria-controls="toast"
        :aria-expanded="notificationsStore.message ? true : false"
        @click="notificationsStore.$reset()"
      >
        <SVGXMark class="toast__icon" />
      </button>
    </div>
    <div
      ref="messageElement"
      class="toast__message"
      :tabindex="isFocusable ? 0 : -1"
    >
      {{ notificationsStore.message }}
    </div>

    <div
      ref="progressBarElement"
      class="toast__progress-bar"
      :data-active="notificationsStore.message ? true : false"
    ></div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";
/* prettier-ignore */
.toast {
  opacity: 0;
  overflow: hidden;
  position: fixed;
  right: 0;
  bottom: 2rem;
  left: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  max-width: 40ch;
  margin-inline: auto;
  background-color: colour.$window-body;
  box-shadow: effect.$drop-shadow-lg;
  cursor: default;
  transform: translate3d(0, 100%, 0);
  filter: blur(0.25rem);
  transition:
    opacity 250ms ease-in-out,
    transform 250ms ease-in-out,
    filter 225ms ease-in-out;
  &[data-active="true"] {
    opacity: 1;
    z-index: 1000;
    transform: translate3d(0, 0%, 0);
    filter: none;
  }
  &__header {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    height: 3rem;
    background-image: colour.$window-title;
    color: colour.$font-light;
  }
  &__title {
    all: unset;
    padding-inline: 1rem;
    font-size: fontsize.$lg;
    font-weight: bold;
  }
  &__message {
    padding: 1rem;
    padding-bottom: 1.25rem; // Adjust for progress bar height
    font-size: fontsize.$sm;
    &:focus {
      outline: none;
    }
  }
  &__close-button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    width: 2rem;
    margin-right: 0.5rem;
    cursor: pointer;
    &:focus {
      outline: 1px solid colour.$autocomplete-border-focus;
      background-color: colour.$button-background-hover;
    }
  }
  &__icon {
    pointer-events: none;
    aspect-ratio: 1/1;
    width: 1.5rem;
    fill: colour.$font-light;
  }
  &__progress-bar {
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.25rem;
    width: 100%;
    background: colour.$secondary;
    &[data-active="true"] {
      opacity: 1;
    }
  }
}
</style>

<script setup lang="ts">
// Pinia stores
const notificationsStore = useNotificationsStore();

// Reactive variables
const isFocusable: Ref<boolean> = ref(false);
const timeout: Ref<NodeJS.Timeout | null> = ref(null);

// Template refs
const messageElement: Ref<HTMLDivElement | null> = ref(null);
const progressBarElement: Ref<HTMLDivElement | null> = ref(null);

// Watchers
watch(
  notificationsStore.$state,
  () => {
    if (!progressBarElement.value) return;
    const DURATION = 5000;
    const keyframes: Keyframe[] = [
      { transform: "translate3D(0, 0, 0)" },
      { transform: "translate3D(-100%, 0, 0)" },
    ];
    const options: KeyframeAnimationOptions = {
      duration: DURATION,
      fill: "forwards",
    };
    // If the store contains a message, enable focus and switch to it
    if (notificationsStore.message) {
      isFocusable.value = true;
      useFocus(messageElement, { initialValue: true });
    }
    // Animate the progress bar when a message is detected
    progressBarElement.value.animate(keyframes, options);
    // If a timeout exists, play the animation again and clear the timeout so it can be reset
    if (timeout.value) {
      progressBarElement.value.animate(keyframes, options);
      window.clearTimeout(timeout.value);
    }
    // After 5000ms, clear the timeout ref and reset the notifications store
    timeout.value = setTimeout(() => {
      timeout.value = null;
      notificationsStore.$reset();
    }, DURATION);
  },
  { deep: true }
);

// Event handlers
onKeyStroke("Escape", (event) => {
  event.preventDefault();
  notificationsStore.$reset();
});
</script>

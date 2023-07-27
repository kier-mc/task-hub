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
    <div class="toast__message">
      {{ notificationsStore.message }}
    </div>

    <div ref="progressBarElement" class="toast__progress-bar"></div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
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
  box-shadow: effect.$drop-shadow-3;
  cursor: default;
  transform: translate3d(0, 100%, 0);
  transition: opacity 250ms ease-in-out, transform 250ms ease-in-out;
  &[data-active="true"] {
    opacity: 1;
    z-index: 1000;
    transform: translate3d(0, 0%, 0);
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
    font-size: 1.025rem;
    font-weight: bold;
  }
  &__message {
    padding: 1rem;
    padding-bottom: 1.25rem; // Adjust for progress bar height
    font-size: 0.925rem;
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
  }
  &__icon {
    pointer-events: none;
    aspect-ratio: 1/1;
    width: 1.5rem;
    fill: colour.$font-light;
  }
  &__progress-bar {
    opacity: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.25rem;
    width: 100%;
    background: colour.$secondary;
    transform: v-bind("progressBar.transform");
    transition: v-bind("progressBar.transition");
  }
}
</style>

<script setup lang="ts">
/* Reactive variables */
const notificationsStore = useNotificationsStore();
const timeout: Ref<NodeJS.Timeout | null> = ref(null);
/* Template refs */
const progressBarElement: Ref<HTMLDivElement | null> = ref(null);
/*
 * Watch the notifications store for updates via $subscribe
 * If updated, add a timeout for 5000ms so notifications can close automatically
 * Timeout state is tracked through a ref ("timeout")
 * This allows resetting the timeout if a new message is added before removing the prior
 * Ensures all notifications get the 5000ms timeout applied
 * CSS inline styles allow progression bar to visually synchronise with setTimeout
 * Needed for clarity when a notification is pushed before a previous one has expired
 */
// notifications.$subscribe(async () => {
//   if (!timer.value && !notifications.message) return;
//   timer.value.style.transition = "transform 5250ms";
//   timer.value!.style.transform = "translateX(-100%)";
//   // Reset timeout if another notification is pushed before the previous has expired
//   if (timeout.value) {
//     timer.value.style.transition = "none";
//     timer.value.style.transform = "translateX(0%)";
//     // Small delay is required to register updates correctly
//     setTimeout(() => {
//       if (!timer.value) return;
//       timer.value.style.transition = "transform 5250ms";
//       timer.value.style.transform = "translateX(-100%)";
//     }, 50);
//     window.clearTimeout(timeout.value);
//   }
//   // Clear any notifications and clean up any inline styles after a 5000ms delay
//   timeout.value = setTimeout(() => {
//     if (!timer.value) return;
//     timer.value.removeAttribute("style");
//     notifications.$reset();
//     timeout.value = null;
//   }, 5000);
// });

const progressBar: Ref<Record<string, string>> = ref({
  transform: "",
  transition: "",
});

notificationsStore.$subscribe(
  async () => {
    if (!progressBarElement.value) return;
    console.log(timeout.value);
    const { transform, transition } = toRefs(progressBar.value);
    const delay = 5250;
    transform.value = "translate3D(-100%, 0, 0)";
    transition.value = `transform ${delay}ms ease-out`;
    // Reset timeout if another notification is pushed before the previous has expired
    if (timeout.value !== null) {
      transform.value = "translate3D(0, 0, 0)";
      transition.value = "none";
      // Small delay is required to register updates correctly
      setTimeout(() => {
        transform.value = "translate3D(-100%, 0, 0)";
        transition.value = `transform ${delay}ms ease-out`;
      }, 50);
      await nextTick();
      window.clearTimeout(timeout.value);
    }
    // Clear any notifications and nullify the timeout ref after a 5000ms delay
    timeout.value = setTimeout(() => {
      notificationsStore.$reset();
      timeout.value = null;
    }, 5000);
  },
  { detached: true }
);
</script>

<template>
  <section
    id="toast"
    class="toast"
    :data-active="notifications.message ? true : false"
  >
    <span class="toast__message">
      {{ notifications.message }}
    </span>
    <button
      type="button"
      class="toast__close-button"
      aria-controls="toast"
      :aria-expanded="notifications.message ? true : false"
      @click="notifications.clearAll()"
    ></button>
    <div
      class="toast__progress"
      ref="timer"
      :data-active="notifications.message ? true : false"
    ></div>
  </section>
</template>

<style scoped lang="scss">
.toast {
  opacity: 0;
  overflow: hidden;
  position: fixed;
  right: 0;
  bottom: 2rem;
  left: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  max-width: 512px;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-inline: auto;
  background-color: hsl(0, 0%, 10%);
  transform: translate3d(0, 100%, 0);
  transition: opacity 250ms, transform 250ms;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
  }
  &[data-active="true"] {
    opacity: 1;
    z-index: 1000;
    transform: translate3d(0, 0%, 0);
  }
  &__close-button {
    all: unset;
    aspect-ratio: 1/1;
    min-width: 1.25rem;
    mask: url("/img/svg/xmark.svg") no-repeat center center;
    mask-size: cover;
    -webkit-mask: url("/img/svg/xmark.svg") no-repeat center center;
    -webkit-mask-size: cover;
    background-color: hsl(0, 0%, 80%);
    transition: background-color 175ms;
    cursor: pointer;
    &:hover {
      background-color: hsl(0, 0%, 90%);
    }
  }
  &__progress {
    --timer: 5250ms;
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    border-radius: 0 0 0.5rem 0.5rem;
    background: hsl(0, 0%, 40%);
    transform: translate3d(0, 0, 0);
    transform-origin: left;
    &[data-active="true"] {
      opacity: 1;
      transform: translate3d(-100%, 0, 0);
      // Transition looks best as hide delay + parent element hide transition time
      transition: transform var(--timer);
    }
  }
}
</style>

<script setup lang="ts">
/* Reactive variables */
const notifications = useNotificationsStore();
const timeout: Ref<NodeJS.Timeout | null> = ref(null);
/* Template refs */
const timer: Ref<HTMLElement | null> = ref(null);
/*
 * Watch the notifications store for updates via $subscribe
 * If updated, add a timeout for 5000ms so notifications can close automatically
 * Timeout state is tracked through a ref ("timeout")
 * This allows resetting the timeout if a new message is added before removing the prior
 * Ensures all notifications get the 5000ms timeout applied
 * CSS inline styles allow progression bar to visually synchronise with setTimeout
 * Needed for clarity when a notification is pushed before a previous one has expired
 */
notifications.$subscribe(() => {
  if (!timer.value) return;
  if (!notifications.message) return;
  timer.value.style.transition = "transform 5250ms";
  timer.value.style.transform = "translateX(-100%)";
  // Reset timeout if another notification is pushed before the previous has expired
  if (timeout.value !== null) {
    timer.value.style.transition = "none";
    timer.value.style.transform = "translateX(0%)";
    // Small delay is required to register updates correctly
    setTimeout(() => {
      if (!timer.value) return;
      timer.value.style.transition = "transform 5250ms";
      timer.value.style.transform = "translateX(-100%)";
    }, 5);
    window.clearTimeout(timeout.value);
  }
  // Clear any notifications and clean up any inline styles after a 5000ms delay
  timeout.value = setTimeout(() => {
    if (!timer.value) return;
    timer.value.removeAttribute("style");
    notifications.clearAll();
    timeout.value = null;
  }, 5000);
});
</script>

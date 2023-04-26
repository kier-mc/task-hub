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
      @click="notifications.clearAll"
    ></button>
  </section>
</template>

<style scoped lang="scss">
.toast {
  opacity: 0;
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
  &[data-active="true"] {
    opacity: 1;
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
}
</style>

<script setup lang="ts">
const notifications = useNotificationsStore();

notifications.$subscribe(() => {
  if (notifications.message) {
    setTimeout(() => {
      notifications.clearAll();
    }, 5000);
  }
});
</script>

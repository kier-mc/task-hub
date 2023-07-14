<template>
  <header class="header">
    <h1 class="header__title">Task Hub</h1>
    <button
      class="header__button"
      id="app-navigation-button"
      aria-controls="app-navigation-menu"
      @click="isExpanded = !isExpanded"
    >
      <SVGMenu class="header__icon" />
    </button>
  </header>
  <AppNavigation id="app-navigation-menu" :is-expanded="isExpanded" />
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/layout";
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: layout.$breakpoint-largest;
  height: inherit;
  padding-inline: 1rem;
  margin-inline: auto;
  &__title {
    all: unset;
    color: colour.$font-light;
    font-size: calc(1rem * 1.25);
    letter-spacing: 0.075rem;
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    width: 3rem;
    cursor: pointer;
  }
  &__icon {
    pointer-events: none;
    width: 1.5rem;
    fill: colour.$font-light;
    transition: fill 125ms;
    &:hover {
      fill: hsl(0, 0%, 90%);
    }
  }
}
</style>

<script setup lang="ts">
const isExpanded: Ref<boolean> = ref(false);

function closeMenuWithClickOutside(event: Event): void {
  const target = event.target as Element;
  const isClickInside = target.closest("#app-navigation-button");
  if (!isClickInside) {
    isExpanded.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
});

onUnmounted(() => {
  document.removeEventListener("click", (event: Event) => {
    closeMenuWithClickOutside(event);
  });
});
</script>

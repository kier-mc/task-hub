<template>
  <header class="header">
    <h1 class="header__title">Task Hub</h1>
    <button
      ref="buttonElement"
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
@use "../assets/scss/data/easing";
@use "../assets/scss/data/fontsize";
@use "../assets/scss/data/layout";
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: layout.$breakpoint-xl;
  height: inherit;
  padding-inline: 1rem;
  margin-inline: auto;
  &__title {
    all: unset;
    color: colour.$font-light;
    font-size: fontsize.$xxl;
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
    &:hover .header__icon {
      fill: colour.$secondary;
    }
  }
  &__icon {
    pointer-events: none;
    width: 1.5rem;
    fill: colour.$font-light;
    transition: fill 500ms easing.$ease-out-quart;
  }
}
</style>

<script setup lang="ts">
// Reactive variables
const isExpanded: Ref<boolean> = ref(false);

// Template refs
const buttonElement: Ref<HTMLButtonElement | null> = ref(null);

// Event handlers
onClickOutside(buttonElement, () => {
  isExpanded.value = false;
});

onKeyStroke("Escape", (event) => {
  event.preventDefault();
  isExpanded.value = false;
});
</script>

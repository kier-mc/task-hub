<template>
  <nav class="nav" role="navigation">
    <ul class="nav__menu" :aria-expanded="props.isExpanded">
      <template v-for="option in propData.navigation" :key="option.index">
        <template v-if="user && option.requiresAuth === true">
          <li
            ref="options"
            class="nav__option"
            :tabindex="props.isExpanded ? 0 : -1"
            @click="option.function"
            @keyup.enter="option.function"
          >
            <div class="option__label">{{ option.label }}</div>
            <component class="option__icon" :is="option.icon" />
          </li>
        </template>
        <template v-else-if="!user && option.requiresAuth === false">
          <li
            ref="options"
            class="nav__option"
            :tabindex="props.isExpanded ? 0 : -1"
            @click="option.function"
            @keyup.enter="option.function"
          >
            <div class="option__label">{{ option.label }}</div>
            <component class="option__icon" :is="option.icon" />
          </li>
        </template>
      </template>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.nav {
  position: relative;
  max-width: layout.$breakpoint-largest;
  margin: 0 auto;
  user-select: none;
  /* prettier-ignore */
  &__menu {
    all: unset;
    overflow: hidden;
    visibility: hidden;
    height: 0;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 990;
    color: colour.$font-light;
    backdrop-filter: blur(0.25rem);
    transition:
      visibility 150ms ease-in-out,
      height 275ms easing.$ease-out-quart;
      box-shadow: 300ms easing.$ease-out-quart;
    @media (max-width: layout.$breakpoint-medium) {
      width: 100vw;
    }
    &[aria-expanded="true"] {
      visibility: visible;           
      height: v-bind("menuHeight");   
      box-shadow: effect.$drop-shadow-sm;   
    }
    &[aria-expanded="true"] .nav__option {
      opacity: 1;
    }    
  }
  /* prettier-ignore */
  &__option {
    all: unset;
    opacity: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    width: 15rem;
    z-index: 1000;
    padding-inline: 1rem;
    background-color: colour.$app-navigation-menu;
    cursor: pointer;
    transition:
      background-color 500ms easing.$ease-out-quart,
      opacity 150ms easing.$ease-out-quart;
    @media (max-width: layout.$breakpoint-medium) {
      width: calc(100% - 2rem);
    }
    &:focus,
    &:hover {
      background-color: colour.$app-navigation-menu-hover;
    }
    @at-root .option {
      &__label {
        font-weight: bold;
      }
      &__icon {
        aspect-ratio: 1/1;
        width: 1.5rem;
        fill: colour.$font-light;
      }
    }
  }
}
</style>

<script setup lang="ts">
// Types
import type { User } from "@supabase/supabase-js";
import type { NavigationPropData } from "types/components/app";

// Components
import {
  SVGHome,
  SVGCreateAccount,
  SVGLogin,
  SVGSettings,
  SVGLogout,
} from "#components";

// Prop definitions
const props = defineProps({
  isExpanded: { type: Boolean as PropType<boolean>, required: true },
});

// Prop data
const propData = {
  navigation: [
    {
      index: 0,
      label: "Home",
      icon: SVGHome,
      function: () => navigateTo("/"),
      requiresAuth: false,
    },
    {
      index: 1,
      label: "Hub",
      icon: SVGHome,
      function: () => navigateTo("/hub"),
      requiresAuth: true,
    },
    {
      index: 2,
      label: "Create Account",
      icon: SVGCreateAccount,
      function: () => navigateTo("/create-account"),
      requiresAuth: false,
    },
    {
      index: 3,
      label: "Login",
      icon: SVGLogin,
      function: () => navigateTo("/login"),
      requiresAuth: false,
    },
    {
      index: 4,
      label: "Settings",
      icon: SVGSettings,
      function: () => navigateTo("/settings"),
      requiresAuth: true,
    },
    {
      index: 5,
      label: "Logout",
      icon: SVGLogout,
      function: () => logoutUser(),
      requiresAuth: true,
    },
  ] as NavigationPropData[],
};

// Reactive variables
const user: Ref<User | null> = useSupabaseUser();

// Template refs
const options: Ref<Array<HTMLLIElement | null>> = ref([]);

// Logic
const menuHeight: ComputedRef<string> = computed((): string => {
  const count = propData.navigation.reduce((accumulator, option) => {
    if ((user && option.requiresAuth) || (!user && !option.requiresAuth)) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);
  return `${count * 3}rem`;
});

// Event handlers
onKeyStroke("ArrowUp", (event) => {
  event.preventDefault();
  for (let i = 0; i < options.value.length; i++) {
    const option = options.value[i];
    if (document.activeElement === option) {
      if (options.value.indexOf(option) === 0) {
        return;
      }
      useFocus(options.value[i - 1], { initialValue: true });
      return;
    }
  }
});

onKeyStroke("ArrowDown", (event) => {
  event.preventDefault();
  for (let i = 0; i < options.value.length; i++) {
    const option = options.value[i];
    if (document.activeElement === option) {
      if (options.value.indexOf(option) === options.value.length - 1) {
        return;
      }
      useFocus(options.value[i + 1], { initialValue: true });
      return;
    }
  }
});

// Watchers
watch(
  () => props.isExpanded,
  () => {
    if (props.isExpanded === false && document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  }
);
</script>

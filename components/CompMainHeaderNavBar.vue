<template>
  <header class="header">
    <h1 class="header-title">To-Do</h1>
    <button
      type="button"
      class="header__menu-button"
      aria-controls="nav__menu"
      :aria-expanded="menuIsOpen ? 'true' : 'false'"
      @click="menuIsOpen = !menuIsOpen"
      ref="button"
    ></button>
  </header>
  <nav class="nav" role="navigation">
    <div
      id="nav__menu"
      class="nav__menu"
      :class="{ 'nav__menu--visible': menuIsOpen }"
    >
      <section class="nav__section" v-for="data in navData" :key="data.index">
        <h1 class="nav__title">{{ data.title }}</h1>
        <ul class="nav__links">
          <template v-for="link in data.links" :key="data.index">
            <NuxtLink :to="link.url">
              <li>
                {{ link.name }}
              </li>
            </NuxtLink>
          </template>
        </ul>
      </section>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@import "../assets/scss/variables.scss";
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--content-max-width);
  height: var(--header-height);
  z-index: 30;
  padding-inline: var(--header-inline-padding);
  margin: 0 auto;
  background-color: inherit;
  &__menu-button {
    all: unset;
    aspect-ratio: 1/1;
    min-width: var(--nav-button-size);
    z-index: 20;
    mask: url("./assets/img/svg/menu.svg") no-repeat center center;
    mask-size: cover;
    -webkit-mask: url("./assets/img/svg/menu.svg") no-repeat center center;
    -webkit-mask-size: cover;
    background-color: hsl(0, 0%, 80%);
    background-repeat: no-repeat;
    background-position: center;
    transition: background-color 200ms;
    cursor: pointer;
    &[aria-expanded="true"] {
      background-color: hsl(0, 0%, 90%);
    }
  }
}
.nav {
  position: relative;
  max-width: var(--content-max-width);
  margin: 0 auto;
  user-select: none;
  // Format longer transitions on new lines
  /* prettier-ignore */
  &__menu {
    will-change: opacity, transform;
    opacity: 0;
    transform: translateY(-100%);
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    column-gap: 5rem;
    z-index: 10;
    padding: 0 1rem 1rem 1rem;
    color: hsl(0, 0%, 90%);
    backdrop-filter: blur(0.25rem);
    transition:
      opacity 250ms cubic-bezier(0.77, 0, 0.175, 1),
      transform 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
    @media screen and (max-width: $breakpoint-smallest) {
      flex-direction: column;
      width: 100%;
    }
    @media (prefers-reduced-motion) {
      transition: opacity 250ms cubic-bezier(0.77, 0, 0.175, 1);
    }
    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -10;
      background-color: hsl(0, 0%, 12.5%);
      opacity: 0.8;
    }
  }
  // &__section {
  // }
  &__title {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 0.75rem;
    font-size: 1.2rem;
  }
  &__links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style-type: none;
    font-size: 0.875rem;
    cursor: default;
  }
  &__links li {
    width: var(--nav-link-width);
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: hsl(0, 0%, 12.5%);
    cursor: pointer;
    transition: background-color 175ms;
    @media screen and (max-width: $breakpoint-smallest) {
      width: 100%;
    }
  }
  &__links li:hover {
    background-color: hsl(0, 0%, 10%);
  }
  &__links a {
    all: unset;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>

<script setup lang="ts">
const menuIsOpen: Ref<boolean> = ref(false);
const button: Ref<HTMLElement | null> = ref(null);

const navData: Array<NavDataObject> = [
  {
    index: 0,
    title: "Site",
    links: [
      {
        index: 0,
        name: "Home",
        url: "/",
      },
      {
        index: 1,
        name: "Login",
        url: "/login",
      },
      {
        index: 2,
        name: "Create Account",
        url: "/create-account",
      },
    ],
  },
  {
    index: 1,
    title: "Actions",
    links: [
      {
        index: 0,
        name: "Create Item",
        url: "#",
      },
      {
        index: 1,
        name: "View All Items",
        url: "#",
      },
    ],
  },
];

function closeMenuWithClickOutside(event: Event) {
  if (event.target === button.value) return;
  menuIsOpen.value = false;
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

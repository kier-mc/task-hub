<template>
  <header class="header">
    <h1 class="header-title">
      <NuxtLink to="/">To-Do</NuxtLink>
    </h1>
    <button
      type="button"
      class="header__menu-button"
      aria-controls="nav__menu"
      :aria-expanded="menuIsOpen ? 'true' : 'false'"
      @click="menuIsOpen = !menuIsOpen"
      ref="button"
    >
      <SVGMenu class="header__menu-icon" />
    </button>
  </header>
  <nav class="nav" role="navigation">
    <div
      id="nav__menu"
      class="nav__menu"
      :class="{ 'nav__menu--visible': menuIsOpen }"
    >
      <!-- Menu if user is logged in -->
      <template v-if="user">
        <template v-for="data in navData" :key="data.index">
          <section class="nav__section" v-if="data.display !== 'auth=false'">
            <h1 class="nav__title">{{ data.title }}</h1>
            <ul class="nav__links">
              <template v-for="link in data.links" :key="link.index">
                <template v-if="link.display !== 'auth=false'">
                  <template v-if="link.type === 'route'">
                    <li @click="navigateTo(link.url)">
                      {{ link.name }}
                    </li>
                  </template>
                  <template v-else-if="link.type === 'logout'">
                    <li @click="logoutUser">
                      {{ link.name }}
                    </li>
                  </template>
                </template>
              </template>
            </ul>
          </section>
        </template>
      </template>
      <!-- Menu if user is not logged in -->
      <template v-else>
        <template v-for="data in navData" :key="data.index">
          <section
            class="nav__section"
            v-if="data.display === 'auth=false' || data.display === 'always'"
          >
            <h1 class="nav__title">{{ data.title }}</h1>
            <ul class="nav__links">
              <template v-for="link in data.links" :key="link.index">
                <template
                  v-if="
                    link.display === 'auth=false' || link.display === 'always'
                  "
                >
                  <template v-if="link.type === 'route'">
                    <li @click="navigateTo(link.url)">
                      {{ link.name }}
                    </li>
                  </template>
                  <template v-else-if="link.type === 'logout'">
                    <li @click="logoutUser">
                      {{ link.name }}
                    </li>
                  </template>
                </template>
              </template>
            </ul>
          </section>
        </template>
      </template>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@import "../assets/scss/variables.scss";
.header {
  isolation: isolate;
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
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    min-width: var(--nav-button-size);
    z-index: 20;
    transition: background-color 200ms;
    cursor: pointer;
    &[aria-expanded="true"] .header__menu-icon {
      fill: hsl(0, 0%, 90%);
    }
  }
  &__menu-icon {
    pointer-events: none;
    z-index: 0;
    max-width: 32px;
    fill: hsl(0, 0%, 80%);
    transition: fill 125ms;
    &:hover {
      fill: hsl(0, 0%, 90%);
    }
  }
  & a {
    all: unset;
    cursor: pointer;
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
    transform: translate3d(0, -100%, 0);
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
      transform: translate3d(0, 0%, 0);
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
const user = useSupabaseUser();
const navData: Array<NavDataObject> = [
  {
    index: 0,
    title: "Site",
    display: "always",
    links: [
      {
        index: 0,
        name: "Home",
        type: "route",
        display: "always",
        url: "/",
      },
      {
        index: 1,
        name: "Login",
        type: "route",
        display: "auth=false",
        url: "/login",
      },
      {
        index: 2,
        name: "Create Account",
        type: "route",
        display: "auth=false",
        url: "/create-account",
      },
      {
        index: 3,
        name: "Hub",
        type: "route",
        display: "auth=true",
        url: "/hub",
      },
      {
        index: 4,
        name: "Logout",
        type: "logout",
        display: "auth=true",
      },
    ],
  },
  {
    index: 1,
    title: "Actions",
    display: "auth=true",
    links: [
      {
        index: 0,
        name: "Create Item",
        type: "route",
        display: "auth=true",
        url: "/",
      },
      {
        index: 1,
        name: "View All Items",
        type: "route",
        display: "auth=true",
        url: "/",
      },
    ],
  },
];

function closeMenuWithClickOutside(event: Event): void {
  const target = event.target as Element;
  const isClickInside = target.closest(".header__menu-button");
  if (!isClickInside) {
    menuIsOpen.value = false;
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

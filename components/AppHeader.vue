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
        <template v-for="data in propData.navData" :key="data.index">
          <section class="nav__section" v-if="data.display !== 'auth=false'">
            <h1 class="nav__title">{{ data.title }}</h1>
            <ul class="nav__links">
              <template v-for="link in data.links" :key="link.index">
                <template v-if="link.display !== 'auth=false'">
                  <template v-if="link.type === 'route'">
                    <li class="nav__link" @click="navigateTo(link.url)">
                      {{ link.name }}
                    </li>
                  </template>
                  <template v-else-if="link.type === 'logout'">
                    <li class="nav__link" @click="logoutUser">
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
        <template v-for="data in propData.navData" :key="data.index">
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
                    <li class="nav__link" @click="navigateTo(link.url)">
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
  max-width: $breakpoint-largest;
  z-index: 30;
  padding-inline: 1rem;
  margin: 0 auto;
  &__menu-button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    min-width: 48px;
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
  max-width: $breakpoint-largest;
  margin: 0 auto;
  user-select: none;
  /* prettier-ignore */
  &__menu {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
    filter: blur($blur-default);
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    column-gap: 5rem;
    z-index: -10;
    padding: 0 1rem 1rem 1rem;
    background-color: $colour-lm-nav-menu;
    color: $colour-lm-font;
    backdrop-filter: blur($blur-default);
    transition:
      opacity $transition-short,
      transform $transition-long,
      filter $transition-short;
    @media (max-width: $breakpoint-small) {
      flex-direction: column;
      width: 100%;
    }
    @media (max-width: $breakpoint-large) {
      justify-content: space-evenly;
      width: 100%;
    }
    @media (prefers-color-scheme: dark) {
      background-color: $colour-dm-nav-menu;
      color: $colour-dm-font;
    }
    &--visible {
      opacity: 1;
      transform: translate3d(0, 0%, 0);
      filter: none;
    }
  }
  &__title {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 0.75rem;
    font-size: $font-size-largest;
  }
  &__links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style-type: none;
    font-size: $font-size-small;
    cursor: default;
  }
  &__link {
    width: 25ch;
    padding: 1rem;
    border: 1px solid $colour-lm-border;
    cursor: pointer;
    transition: border $transition-medium;
    @media (max-width: $breakpoint-small) {
      width: 100%;
    }
    @media (prefers-color-scheme: dark) {
      border: 1px solid $colour-dm-border;
    }
    &:hover {
      border: 1px solid $colour-primary;
    }
  }
}
</style>

<script setup lang="ts">
const menuIsOpen: Ref<boolean> = ref(false);
const button: Ref<HTMLElement | null> = ref(null);
const user = useSupabaseUser();
const propData = {
  navData: [
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
    } as NavigationData,
    {
      index: 1,
      title: "User",
      display: "auth=true",
      links: [
        {
          index: 0,
          name: "Settings",
          type: "route",
          display: "auth=true",
          url: "/settings",
        },
      ],
    } as NavigationData,
  ],
};

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

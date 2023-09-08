<template>
  <div class="container-header">
    <AppHeader />
  </div>
  <main class="container-main">
    <slot />
  </main>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour.scss";
@use "../assets/scss/data/effect.scss";
@use "../assets/scss/data/layout.scss";
.container-header {
  height: 3rem;
  background-image: colour.$app-header;
  box-shadow: effect.$drop-shadow-sm;
}
.container-main {
  height: calc(100vh - 3rem);
  max-width: layout.$breakpoint-xl;
  margin: 0 auto;
}
</style>

<script setup lang="ts"></script>

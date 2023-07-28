<template>
  <AppToast />
  <div class="container-header">
    <AppHeader />
  </div>
  <main class="container-main">
    <slot />
  </main>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour.scss";
@use "../assets/scss/data/layout.scss";
.container-header {
  height: 3rem;
  background-image: colour.$app-header;
}
.container-main {
  max-width: layout.$breakpoint-largest;
  margin: 0 auto;
}
</style>

<script setup lang="ts"></script>

<template>
  <ToastSystem />
  <div class="container-header">
    <AppHeader />
  </div>
  <main class="container-main">
    <slot />
  </main>
</template>

<style scoped lang="scss">
@import "../assets/scss/variables.scss";
.container-header {
  isolation: isolate;
  position: fixed;
  top: 0;
  height: $header-height;
  width: 100%;
  z-index: 990;
  background-color: $colour-lm-header;
  backdrop-filter: blur($blur-default);
  @media (prefers-color-scheme: dark) {
    background-color: $colour-dm-header;
  }
}
.container-main {
  max-width: $breakpoint-largest;
  margin: 0 auto;
  margin-top: calc($header-height + $content-offset);
}
</style>

<script setup lang="ts"></script>

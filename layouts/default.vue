<template>
  <ToastSystem />
  <div class="container-header">
    <AppHeader />
  </div>
  <div class="container-content">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.container-header {
  width: 100%;
  background-color: hsl(0, 0%, 10%);
}
.container-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
}
</style>

<script setup lang="ts"></script>

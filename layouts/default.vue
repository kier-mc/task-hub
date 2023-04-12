<template>
  <div class="container-header">
    <CompMainHeaderNavBar />
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
  max-width: 1280px;
  margin: 0 auto;
}
</style>

<script setup lang="ts"></script>

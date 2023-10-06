<template>
  <section class="hub">
    <HubSidebar class="hub__sidebar" />
    <HubTasks />
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/layout";
.hub {
  display: flex;
  min-height: 100%;
  margin-inline: auto;
  @media (max-width: layout.$breakpoint-lg) {
    display: block;
  }
  &__sidebar {
    flex-basis: 30ch;
    min-width: 30ch;
  }
}
</style>

<script setup lang="ts">
// Meta
definePageMeta({ middleware: "auth-only" });
</script>

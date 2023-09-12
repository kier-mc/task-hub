<template>
  <section class="tasks">
    <TaskOptions />
    <TaskList />
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/layout";
.tasks {
  position: relative;
  width: calc(100% - 1rem);
  max-width: layout.$breakpoint-xl;
  padding: 0.5rem;
}
</style>

<script setup lang="ts"></script>

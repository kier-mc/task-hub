<template>
  <section class="sidebar">
    <section class="datetime">
      <HubDateTime />
    </section>
    <div class="weather">
      <HubWeather />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.sidebar {
  border-right: 1px solid colour.$gunmetal-500;
  border-left: 1px solid colour.$gunmetal-500;
  box-shadow: effect.$drop-shadow-sm;
  background-color: colour.$gunmetal-400;
  color: colour.$font-light;
  @media (max-width: layout.$breakpoint-xl) {
    border-left: none;
  }
}
.datetime {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid colour.$hub-header-border;
  text-rendering: optimizeLegibility;
  font-variant: tabular-nums;
}
</style>

<script setup lang="ts"></script>

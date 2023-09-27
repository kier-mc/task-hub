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
  border-right: 1px solid colour.$gunmetal-700;
  box-shadow: effect.$drop-shadow-md;
  background-image: colour.$hub-header-background;
  color: colour.$font-light;
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

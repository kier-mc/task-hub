<template>
  <div class="container__settings">
    <article class="settings">
      <header class="header">
        <h2 class="header__title">Settings</h2>
      </header>
      <section class="content"></section>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/layout";
.container__settings {
  max-width: 60ch;
  padding-top: 2rem;
  margin-inline: auto;
  @media (max-width: layout.$breakpoint-md) {
    max-width: calc(100% - 2rem);
  }
}
.settings {
  box-shadow: effect.$drop-shadow-md;
}
.header {
  display: flex;
  align-items: center;
  height: 3rem;
  padding-inline: 1rem;
  background-image: colour.$window-title;
  color: colour.$font-light;
  &__title {
    all: unset;
    font-size: 1.025rem;
    font-weight: bold;
  }
}
.content {
  padding: 1rem;
  margin-inline: auto;
  background-color: colour.$window-body;
}
</style>

<script setup lang="ts">
// Meta
definePageMeta({ middleware: "auth-only" });
</script>

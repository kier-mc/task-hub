<template>
  <div class="container-info">
    <section class="info">
      <ClientOnly>
        <div class="info__datetime">
          <div class="info__date">
            <HubDate />
          </div>
          <div class="info__time">
            <HubTime />
          </div>
        </div>
      </ClientOnly>
      <div class="info__weather">
        <HubWeather />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/layout";
.container-info {
  position: relative;
  background-image: colour.$hub-header-background;
}
.info {
  display: flex;
  align-items: flex-end;
  max-width: layout.$breakpoint-xl;
  margin-inline: auto;
  color: hsl(210, 5%, 90%);
  &__datetime {
    min-width: 30ch;
    border-right: 1px solid colour.$hub-header-border;
  }
  &__date,
  &__time {
    display: flex;
    align-items: center;
    text-rendering: optimizeLegibility;
    font-variant: tabular-nums;
  }
  &__date {
    height: 4rem;
    padding-inline: 1rem;
    border-bottom: 1px solid colour.$hub-header-border;
  }
  &__time {
    height: 2rem;
    padding-inline: 1rem;
  }
  &__weather {
    flex-grow: 1;
    margin-block: auto;
  }
}
</style>

<script setup lang="ts">
// Meta
definePageMeta({ layout: "hub", middleware: "auth-only" });

// Pinia stores
const userStore = useUserStore();

// Hooks
onMounted(() => {
  if (!userStore.response) userStore.fetchData();
});
</script>

<template>
  <div class="weather" v-if="weatherStore.weather">
    {{ weatherStore.weather }}
  </div>
</template>

<style scoped lang="scss">
.weather {
  display: grid;
}
</style>

<script setup lang="ts">
const weatherStore = useWeatherStore();
// Default value, to be associated with individual users via metadata in the future
const defaultLocation = "Halton, UK";
onMounted(() => {
  weatherStore.getWeather(defaultLocation);
});
</script>

<template>
  <button type="button" class="button" @click="getWeather(defaultLocation)">
    Get Weather
  </button>
  <div style="margin-top: 1rem">
    <span v-if="apiResponse">
      {{ apiResponse }}
    </span>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
const config = useRuntimeConfig();
// Default value, to be associated with individual users via metadata in the future
const defaultLocation = "Halton, UK";
const apiResponse: Ref<null | OpenWeatherMapResponse> = ref(null);
async function getWeather(location: string) {
  const key = config.public.openWeatherKey;
  const weather = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;
  const response = await fetch(weather);
  const data = await response.json();
  console.log(data);
  apiResponse.value = data;
}
</script>

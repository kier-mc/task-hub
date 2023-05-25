<template>
  <div class="weather-applet" v-if="weatherStore.weather">
    <div class="weather-applet__left">
      <div class="weather-applet__location">
        {{ weatherStore.weather.name }}, {{ weatherStore.weather.sys.country }}
      </div>
      <div class="weather-applet__date">
        {{ currentDay }}, {{ currentDate }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-applet {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  &__location {
    font-size: 2rem;
  }
}
</style>

<script setup lang="ts">
const weatherStore = useWeatherStore();
// Default value, to be associated with individual users via metadata in the future
const defaultLocation = "Halton, UK";
const currentDateTime = new Date();
const currentDay = ref("");
const currentDate = ref("");
onMounted(async () => {
  await weatherStore.getWeather(defaultLocation);
  currentDay.value = convertDate(currentDateTime, "en-GB", {
    weekday: "long",
  }) as string;
  currentDate.value = convertDate(currentDateTime, "en-GB") as string;
});
</script>

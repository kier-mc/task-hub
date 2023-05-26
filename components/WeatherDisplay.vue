<template>
  <div class="weather-applet" v-if="weatherStore.data">
    <div class="weather-applet__left">
      <div class="weather-applet__location">
        {{ weatherStore.data.name }}, {{ weatherStore.data.sys.country }}
      </div>
      <div class="weather-applet__date">
        {{ currentDay }}, {{ currentDate }}
      </div>
    </div>
    <div class="weather-applet__right">
      <img
        class="weather-applet__icon"
        :alt="weatherStore.data.weather[0].description"
        :src="`/img/svg/weather/${weatherStore.data.weather[0].icon}.svg`"
      />

      <div class="weather-applet__temperature">
        <span class="weather-applet__temperature--value">
          {{ weatherStore.getTemperature("celsius") }}
        </span>
        <span class="weather-applet__temperature--symbol">&nbsp;°C</span>
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
  &__icon {
    aspect-ratio: 1/1;
    max-width: 128px;
  }
  &__right {
    display: flex;
    align-items: center;
  }
  &__temperature {
    &--value {
      font-size: 4.25rem;
      letter-spacing: -0.25rem;
    }
    &--symbol {
      font-size: 1.5rem;
    }
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
  currentDay.value =
    convertDate(currentDateTime, "en-GB", {
      weekday: "long",
    }) ?? "";
  currentDate.value = convertDate(currentDateTime, "en-GB") ?? "";
});
</script>

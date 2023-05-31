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
        <div class="temperature__average">
          <span class="temperature__average--value fixed-width">
            {{
              weatherStore.getTemperature({ type: "average", unit: "celsius" })
            }}
          </span>
          <span class="temperature__average--symbol">&nbsp;°C</span>
        </div>

        <div class="temperature__min">
          <div class="temperature__min--text">Min</div>
          <div class="temperature__min--value fixed-width">
            {{ weatherStore.getTemperature({ type: "min", unit: "celsius" }) }}
          </div>
          <div class="temperature__min--symbol">&nbsp;°C</div>
        </div>

        <div class="temperature__max">
          <span class="temperature__max--text">Max</span>
          <div class="temperature__max--value fixed-width">
            {{
              weatherStore.getTemperature({
                type: "max",
                unit: "celsius",
                locale: "gb",
              })
            }}
          </div>
          <div class="temperature__max--symbol">&nbsp;°C</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-applet {
  display: grid;
  grid-template-columns: repeat(2, auto);
  &__location {
    font-size: 2rem;
  }
  &__icon {
    --icon-max-width: 128px;
    aspect-ratio: 1/1;
    margin-block: calc(
      var(--icon-max-width) - (calc(var(--icon-max-width) * 1.125))
    );
    max-width: var(--icon-max-width);
  }
  &__right {
    display: flex;
    justify-content: right;
    align-items: center;
  }
  &__temperature {
    --temperature-spacing: 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(2, 1fr);
  }
}
.temperature {
  // Use above class (__temperature) to set parent attributes for these subclasses
  &__average {
    grid-row: 1 / 3;
    padding-right: var(--temperature-spacing);
    border-right: 1px solid hsl(0, 0%, 30%);
    &--value {
      font-size: 4.25rem;
      letter-spacing: -0.3rem;
    }
    &--symbol {
      font-size: 2rem;
    }
  }
  &__min,
  &__max {
    display: grid;
    grid-template-columns: 3.75rem 1fr auto;
    align-items: center;
    padding-left: var(--temperature-spacing);
    &--text {
      font-size: 1.25rem;
      text-align: left;
    }
    &--value {
      letter-spacing: -0.1rem;
      font-size: 1.75rem;
    }
    &--symbol {
      font-size: 1rem;
    }
  }
}
.fixed-width {
  text-rendering: optimizeLegibility;
  font-variant: tabular-nums;
}
</style>

<script setup lang="ts">
const weatherStore = useWeatherStore();
// Default value, to be associated with individual users via metadata in the future
const defaultLocation = "Halton, GB";
const currentDateTime = new Date();
const currentDay = ref("");
const currentDate = ref("");
onMounted(async () => {
  await weatherStore.getWeather(defaultLocation);
  // { forceUpdate: true }
  currentDay.value =
    convertDate(currentDateTime, "en-GB", {
      weekday: "long",
    }) ?? "";
  currentDate.value = convertDate(currentDateTime, "en-GB") ?? "";
});
</script>

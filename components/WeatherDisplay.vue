<template>
  <div class="weather-applet">
    <div v-if="isLoading" class="weather-applet__loading">
      <AppLoadingIndicator :options="propData.loadingIndicator" />
    </div>
    <template v-else>
      <template v-if="weatherStore.data">
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
                  weatherStore.getTemperature({
                    type: "average",
                    unit: preferredUnit?.unit,
                    locale: currentCountryISOCode ?? undefined,
                  })
                }}
              </span>
              <span class="temperature__average--symbol"
                >&nbsp;{{ preferredUnit?.symbol }}</span
              >
            </div>

            <div class="temperature__min">
              <div class="temperature__min--text">Min</div>
              <div class="temperature__min--value fixed-width">
                {{
                  weatherStore.getTemperature({
                    type: "min",
                    unit: preferredUnit?.unit,
                    locale: currentCountryISOCode ?? undefined,
                  })
                }}
              </div>
              <div class="temperature__min--symbol">
                &nbsp;{{ preferredUnit?.symbol }}
              </div>
            </div>

            <div class="temperature__max">
              <span class="temperature__max--text">Max</span>
              <div class="temperature__max--value fixed-width">
                {{
                  weatherStore.getTemperature({
                    type: "max",
                    unit: preferredUnit?.unit ?? undefined,
                    locale: currentCountryISOCode ?? undefined,
                  })
                }}
              </div>
              <div class="temperature__max--symbol">&nbsp;°C</div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.weather-applet {
  display: grid;
  grid-template-columns: repeat(2, auto);
  &__loading {
    grid-column: 1 / 3;
    margin-inline: auto;
  }
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
/* Pinia stores */
const weatherStore = useWeatherStore();
const userStore = useUserStore();
/* Prop data */
const propData = {
  loadingIndicator: {
    type: "dots",
    size: {
      width: 48,
      height: 48,
    },
    colour: {
      hue: 0,
      saturation: 0,
      lightness: 100,
    },
  } as LoadingIndicatorData,
};
/* Reactive variables */
const isLoading: Ref<boolean> = ref(true);
const currentDateTime: Ref<Date> = ref(new Date());
const currentLocation: Ref<string | null> = ref(null);
const currentCountryISOCode: Ref<CountryISOCode | null> = ref(null);
const currentDay: Ref<string | null> = ref(null);
const currentDate: Ref<string | null> = ref(null);
const preferredUnit: Ref<UnitPreferenceObject | null> = ref(null);
/**
 * Small helper function to tidy up variable assignment.
 * Calls multiple functions related to the user store and date/time conversion to populate reactive
 * variables present on the page.
 */
function setAllRefs(): void {
  // Options object for date conversion
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  // Variables
  const location: string = `${userStore.getLocale()}, ${userStore.getCountryName()}`;
  const code: CountryISOCode = userStore.getCountryISOCode() as CountryISOCode;
  const day = convertDate(currentDateTime.value, code, options) ?? "";
  const date = convertDate(currentDateTime.value, code) ?? "";
  const unit: UnitPreferenceObject = userStore.getPreferredUnit();
  // Set refs
  currentLocation.value = location;
  currentCountryISOCode.value = code;
  currentDay.value = day;
  currentDate.value = date;
  preferredUnit.value = unit;
}
/* Fetch prerequisite data from the user store, set all reactive variables, call the weather API and hide loading indicator */
onMounted(async () => {
  await userStore.fetchData();
  setAllRefs();
  await weatherStore.getWeather(currentLocation.value ?? "");
  isLoading.value = false;
});
</script>

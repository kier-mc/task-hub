<template>
  <div class="container-weather">
    <section class="weather">
      <TransitionGroup name="transition-fade-opacity">
        <div v-if="state.is_loading" key="0" class="weather__loading">
          <AppLoadingIndicator
            class="weather__loading--icon"
            display="circle"
          />
        </div>
        <template v-else key="1">
          <div v-if="weatherStore.location" class="weather__location">
            <div class="location__locale">{{ weatherStore.getLocale }}</div>
            <div class="location__country">
              {{ weatherStore.getCountryName }}
            </div>
          </div>
          <div class="weather__controls">
            <button
              class="weather__refresh-button"
              type="button"
              :disabled="isRefreshable"
              @click="fetchWrapper()"
            >
              <SVGRefresh class="weather__refresh-icon" />
            </button>
            Last updated {{ getLastUpdated }}
          </div>
          <div class="weather__data">
            <div v-if="weatherStore.icon_code" class="weather__image">
              <img
                class="weather__conditions-icon"
                :alt="weatherStore.getDescription!"
                :src="`/img/svg/weather/${weatherStore.getIconCode}.svg`"
              />
            </div>

            <div class="weather__panel-container">
              <template v-for="panel in propData.data.panel" :key="panel.index">
                <WeatherPanel
                  :data="panel"
                  class="weather__panel"
                  :data-active="panel.index === state.active_panel"
                  @click="cyclePanels()"
                />
              </template>
            </div>
            <div v-if="weatherStore.wind" class="weather__wind">
              <div class="wind__direction">
                <WeatherCompass class="wind__compass" :angle="getWindAngle" />
              </div>
            </div>
          </div>
        </template>
      </TransitionGroup>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/fontsize";
@use "../assets/scss/data/layout";
.weather {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 4rem 2rem;
  position: relative;
  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    z-index: 10;
    &--icon {
      aspect-ratio: 1/1;
      height: 3rem;
      margin: auto;
      fill: colour.$font-light;
    }
  }
  &__location {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-inline: 1rem;
  }
  @at-root .location {
    &__locale {
      font-size: 1.5rem;
    }
  }
  &__controls {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    align-items: center;
    padding-inline: 1rem;
    font-size: fontsize.$xxs;
  }
  &__refresh-button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 2rem;
    margin-left: -0.5rem; // Align the visible icon with the padding
    margin-right: 0.5rem;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
    }
    &:disabled .weather__refresh-icon {
      fill: colour.$icon-light-disabled;
    }
    &:disabled:hover .weather__refresh-icon {
      fill: colour.$icon-light-disabled;
      animation: none;
    }
    &:hover .weather__refresh-icon {
      @keyframes spin {
        from {
          transform: rotateZ(0);
        }
        to {
          transform: rotateZ(360deg);
        }
      }
      fill: colour.$secondary;
      animation: 1000ms easing.$ease-out-quart spin;
    }
  }
  &__refresh-icon {
    aspect-ratio: 1/1;
    width: 1.75rem;
    fill: colour.$icon-light-translucent;
    transition: fill 200ms easing.$ease-out-quart;
  }
  &__data {
    grid-column: 2;
    grid-row: 1 / 3;
    display: flex;
    align-items: center;
  }
  &__image {
    display: flex;
    align-items: center;
    aspect-ratio: 1/1;
    padding-inline: 1rem;
    margin-right: 0.5rem; // Slightly less to compensate for svg padding
  }
  &__conditions-icon {
    aspect-ratio: 1/1;
    width: 4rem;
  }
  &__panel-container {
    position: relative;
    width: 10rem;
    height: 100%;
    margin-right: 1rem;
    cursor: pointer;
  }
  &__panel {
    position: absolute;
    inset: 0;
    visibility: hidden;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: opacity 400ms easing.$ease-in-out-cubic, visibility 400ms;
    &[data-active="true"] {
      visibility: visible;
      opacity: 1;
    }
  }
  &__wind {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    @at-root .wind {
      &__direction {
        aspect-ratio: 1/1;
        min-width: 5rem;
        margin-right: 1rem;
      }
    }
  }
}
// @media (max-width: layout.$breakpoint-lg) {
//   .weather {

//   }
// }
.transition-fade-opacity-enter-active,
.transition-fade-opacity-leave-active {
  $curve: easing.$ease-in-quart;
  visibility: visible;
  opacity: 1;
  transition: opacity 500ms $curve, visibility 500ms $curve;
}

.transition-fade-opacity-enter-from,
.transition-fade-opacity-leave-to {
  visibility: hidden;
  opacity: 0;
}
</style>

<script setup lang="ts">
// Types
import type { WeatherPanelData } from "~/types/components/weather";

// Pinia stores
const userStore = useUserStore();
const weatherStore = useWeatherStore();

// Prop data
const propData = {
  data: {
    panel: <WeatherPanelData[]>[
      {
        index: 0,
        set_1: {
          label: "Average",
          value: weatherStore.getAverageTemperature,
        },
        set_2: {
          label: "Maximum",
          value: weatherStore.getMaximumTemperature,
        },
        set_3: {
          label: "Minimum",
          value: weatherStore.getMinimumTemperature,
        },
      },
      {
        index: 1,
        set_1: {
          label: "Wind",
          value: weatherStore.getWindSpeed,
        },
        set_2: {
          label: "Direction",
          value: weatherStore.getWindAngle,
        },
        set_3: {
          label: "Humidity",
          value: weatherStore.getMinimumTemperature,
        },
      },
    ],
  },
};

// Reactive variables
const location: Ref<string | null> = ref(null);
const timestamp: Ref<Date> = refThrottled(ref(useNow()), 1000); // Throttled to 1 second updates
const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);

// Component state
const state = ref({
  is_loading: true,
  active_panel: 0,
});

// Computed properties
const getLastUpdated = computed(() => {
  return useTimeAgo(weatherStore.getTimestamp! * 1000).value;
});

const isRefreshable = computed(() => {
  const time = Math.round(timestamp.value.getTime() / 1000);
  const call = weatherStore.getTimestamp!;
  return time - call >= 600 ? false : true;
});

const getWindAngle = computed(() => {
  const angle = weatherStore.getWindAngle;
  return angle ?? 0;
});

// Watchers
watch(
  weatherStore.$state,
  () => {
    propData.data.panel[0] = {
      index: 0,
      set_1: {
        label: "Average",
        value: weatherStore.getAverageTemperature!,
      },
      set_2: {
        label: "Maximum",
        value: weatherStore.getMaximumTemperature!,
      },
      set_3: {
        label: "Minimum",
        value: weatherStore.getMinimumTemperature!,
      },
    };
    propData.data.panel[1] = {
      index: 1,
      set_1: {
        label: "Wind",
        value: weatherStore.getWindSpeed!,
      },
      set_2: {
        label: "Direction",
        value: weatherStore.getWindDirection!,
      },
      set_3: {
        label: "Humidity",
        value: weatherStore.getHumidity!,
      },
    };
  },
  { deep: true }
);

// Logic
async function fetchWrapper() {
  state.value.is_loading = true;
  await weatherStore.fetchData(location.value!);
  state.value.is_loading = false;
}

function cyclePanels(): void {
  if (interval.value) clearInterval(interval.value);
  const total = propData.data.panel.length;
  const next = state.value.active_panel + 1;
  if (next === total) {
    state.value.active_panel = 0;
    interval.value = setInterval(cyclePanels, 5000);
    return;
  }
  state.value.active_panel++;
  interval.value = setInterval(cyclePanels, 5000);
}

// Hooks
onMounted(async () => {
  state.value.is_loading = true;
  if (!userStore.response) await userStore.fetchData();
  location.value = `${userStore.getLocale}, ${userStore.getCountryISOCode}`;
  await weatherStore.fetchData(location.value);
  interval.value = setInterval(cyclePanels, 5000);
  state.value.is_loading = false;
});
</script>

<template>
  <section v-if="isLoading" class="loading">
    <AppLoadingIndicator class="loading__icon" display="dots" />
    <div class="loading__label">Retrieving weather data...</div>
  </section>
  <section v-else class="container">
    <section class="summary">
      <div class="summary__label">
        <div class="summary__locale">
          {{ weatherStore.getLocale }}
        </div>
        <div class="summary__country">
          {{ weatherStore.getCountryName }}
        </div>
      </div>
      <component class="summary__icon" :is="setWeatherIcon" />
    </section>
    <button
      class="expandable__button"
      :title="setTemperatureButtonTitle"
      type="button"
      @click="toggleTemperatureData()"
    >
      <div class="expandable__button--label">Temperature</div>
      <SVGExpandMore class="expandable__button--icon" />
    </button>
    <div
      :aria-expanded="temperatureIsExpanded"
      class="expandable expandable__temperature"
    >
      <table aria-label="Temperature" class="data-table temperature">
        <tr
          v-for="(data, index) in propData.table.temperature"
          :key="index"
          class="data-table__row"
        >
          <td class="data-table__label">{{ data.label }}</td>
          <td class="data-table__value">{{ data.value }}</td>
        </tr>
      </table>
    </div>
    <button
      class="expandable__button"
      :title="setAtmosphereButtonTitle"
      type="button"
      @click="toggleAtmosphereData()"
    >
      <div class="expandable__button--label">Atmosphere</div>
      <SVGExpandMore class="expandable__button--icon" />
    </button>
    <div
      :aria-expanded="atmosphereIsExpanded"
      class="expandable expandable__atmosphere"
    >
      <table aria-label="Atmosphere" class="data-table atmosphere">
        <tr
          v-for="(data, index) in propData.table.atmosphere"
          :key="index"
          class="data-table__row"
        >
          <td class="data-table__label">{{ data.label }}</td>
          <td class="data-table__value">{{ data.value }}</td>
        </tr>
      </table>
    </div>
    <section class="refresh">
      <div class="refresh__label">Last updated {{ setLastUpdated }}</div>
      <AppButton
        class="refresh__button"
        :data="propData.button.refresh"
        :is-loading="requestInProgress"
        :is-disabled="requestInProgress || isRefreshable"
      />
    </section>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/easing";
@use "../assets/scss/data/fontsize";
@use "../assets/scss/data/layout";
.loading {
  display: flex;
  flex-direction: column;
  &__icon {
    width: 2rem;
    margin-inline: auto;
    fill: colour.$icon-light;
  }
  &__label {
    margin-inline: auto;
  }
}
.container {
  padding-inline: 1rem;
  padding-block: 0.5rem;
}
.summary {
  $icon-size: 3rem; // SSOT
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 3rem;
  margin-bottom: 1rem;
  &__label {
    // Sidebar width - icon size - all inline margins/padding
    width: calc(30ch - $icon-size - 5rem);
    word-wrap: break-word;
    font-size: fontsize.$xl;
  }
  &__country {
    font-size: fontsize.$rg;
  }
  &__icon {
    width: $icon-size;
    fill: colour.$icon-light;
  }
}
/* prettier-ignore */
.expandable { 
  overflow: hidden;
  height: 0px;
  transition:
    height 500ms easing.$ease-out-quart,
    margin 250ms easing.$ease-out-quart;
  &__temperature {
    margin-bottom: 1rem;
    &[aria-expanded="true"] {
      height: v-bind(getTemperatureHeight);
    }
  }
  &__atmosphere {
    margin-bottom: 1rem;
    &[aria-expanded="true"] {
      height: v-bind(getAtmosphereHeight);
    }
  }
  &__button {
    all: unset;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0.25rem;
    cursor: pointer;
    &--icon {
      aspect-ratio: 1/1;
      width: 1.75rem;
      fill: colour.$icon-light;
    }
  }
}
.atmosphere {
  margin-bottom: 2rem;
}
.refresh {
  &__label {
    margin-bottom: 1rem;
    font-size: fontsize.$xs;
  }
}
.data-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  font-size: fontsize.$sm;
  text-rendering: optimizeLegibility;
  font-variant: tabular-nums;
  & tr {
    height: 2rem;
    background-color: hsla(210, 15%, 30%, 0.15);
    cursor: default;
    transition: background-color 500ms easing.$ease-out-quart;
    &:nth-child(even) {
      background-color: hsla(210, 15%, 40%, 0.15);
    }
    &:hover {
      background-color: hsla(210, 15%, 40%, 0.3);
    }
  }
  & td {
    padding-block: 0.25rem;
  }
  &__header {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid colour.$hub-header-border;
    text-align: left;
    font-size: fontsize.$lg;
  }
  &__label {
    border-right: 1px solid colour.$hub-data-border;
  }
  &__value {
    padding-left: 0.5rem;
    font-weight: bold;
    letter-spacing: -0.025rem;
  }
}
</style>

<script setup lang="ts">
import type { ButtonPropData } from "~/types/components/app";

const userStore = useUserStore();
const weatherStore = useWeatherStore();

const propData = ref({
  table: {
    temperature: [
      { label: "Minimum", value: weatherStore.getMinimumTemperature },
      { label: "Average", value: weatherStore.getAverageTemperature },
      { label: "Maximum", value: weatherStore.getMaximumTemperature },
      { label: "Feels Like", value: weatherStore.getFeelsLikeTemperature },
    ],
    atmosphere: [
      { label: "Wind Speed", value: weatherStore.getWindSpeed },
      { label: "Wind Direction", value: weatherStore.getWindDirection },
      { label: "Humidity", value: weatherStore.getHumidity },
    ],
  },
  button: <Record<string, ButtonPropData>>{
    refresh: {
      function: () => fetchWrapper(),
      label: "Refresh",
      attributes: {
        type: "button",
      },
    },
  },
});

const isLoading: Ref<boolean> = ref(true);
const requestInProgress: Ref<boolean> = ref(false);

const timestamp: Ref<Date> = refThrottled(ref(useNow()), 1000); // Throttled to 1 second updates
const location: Ref<string | null> = ref(null);

const temperatureIsExpanded: Ref<boolean> = ref(false);
const atmosphereIsExpanded: Ref<boolean> = ref(false);

const setWeatherIcon = computed(() => {
  if (!weatherStore.response) return;
  const icon = weatherStore.getIconCode;
  return defineAsyncComponent(
    () => import(`../components/svg/weather/${icon}.vue`)
  );
});

const getTemperatureHeight = computed(() => {
  const length = propData.value.table.temperature.length;
  return `${length * 2}rem`;
});

const setTemperatureButtonTitle = computed(() => {
  return temperatureIsExpanded
    ? "Show temperature data"
    : "Hide temperature data";
});

const getAtmosphereHeight = computed(() => {
  const length = propData.value.table.atmosphere.length;
  return `${length * 2}rem`;
});

const setAtmosphereButtonTitle = computed(() => {
  return atmosphereIsExpanded ? "Show atmosphere data" : "Hide atmosphere data";
});

const setLastUpdated = computed(() => {
  return useTimeAgo(weatherStore.getTimestamp! * 1000).value;
});

const isRefreshable = computed(() => {
  const time = Math.round(timestamp.value.getTime() / 1000);
  const call = weatherStore.getTimestamp!;
  return time - call >= 600 ? false : true;
});

watch(
  weatherStore.$state,
  () => {
    const temperatureTable = propData.value.table.temperature;
    const atmosphereTable = propData.value.table.atmosphere;

    temperatureTable[0].value = weatherStore.getMinimumTemperature;
    temperatureTable[1].value = weatherStore.getAverageTemperature;
    temperatureTable[2].value = weatherStore.getMaximumTemperature;
    temperatureTable[3].value = weatherStore.getFeelsLikeTemperature;

    atmosphereTable[0].value = weatherStore.getWindSpeed;
    atmosphereTable[1].value = weatherStore.getWindDirection;
    atmosphereTable[2].value = weatherStore.getHumidity;
  },
  { deep: true }
);

async function fetchWrapper() {
  requestInProgress.value = true;
  await weatherStore.fetchData(location.value!);
  requestInProgress.value = false;
}

function toggleTemperatureData(): void {
  temperatureIsExpanded.value = !temperatureIsExpanded.value;
}

function toggleAtmosphereData(): void {
  atmosphereIsExpanded.value = !atmosphereIsExpanded.value;
}

onMounted(async () => {
  if (!userStore.response) await userStore.fetchData();
  location.value = `${userStore.getLocale}, ${userStore.getCountryISOCode}`;
  await weatherStore.fetchData(location.value);
  isLoading.value = false;
});
</script>

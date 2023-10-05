<template>
  <div class="container__settings">
    <article class="settings">
      <header class="header">
        <h2 class="header__title">Settings</h2>
      </header>
      <section class="content">
        <h3 class="content__title">Personal</h3>
        <FormInput
          class="content__input"
          :data="propData.data.input.name"
          v-model:emit-value="personal.name"
        />
        <h3 class="content__title">Weather</h3>
        <FormInput
          class="content__input"
          :data="propData.data.input.weather_locale"
          v-model:emit-value="weather.locale"
        />
        <FormAutocomplete
          class="content__input"
          :data="propData.data.autocomplete.weather_country"
          v-model:emit-term="receiver.weather.term"
          v-model:emit-data="receiver.weather.data"
        />
        <h3 class="content__title">Localisation</h3>
        <FormAutocomplete
          class="content__input"
          :data="propData.data.autocomplete.localisation_country"
          v-model:emit-term="receiver.localisation.term"
          v-model:emit-data="receiver.localisation.data"
        />
        <div class="locale-preview">
          <ClientOnly>
            <span class="locale-preview__label">Example formatting:</span
            >{{ day }}, {{ date }} {{ time }}
          </ClientOnly>
        </div>
        <h3 class="content__title">Units</h3>
        <div class="units">
          <div class="temperature">
            <label class="units__label" for="unit-temperature">
              Temperature
            </label>
            <select
              class="units__select"
              id="unit-temperature"
              name="unit-temperature"
              v-model="units.temperature"
            >
              <option
                v-for="(data, index) in propData.data.select.temperature"
                :key="index"
                :selected="data.value === units.temperature"
                :value="data.value"
                class="units__option"
              >
                {{ data.label }}
              </option>
            </select>
          </div>
          <div class="speed">
            <label class="units__label" for="unit-speed">Wind Speed</label>
            <select
              class="units__select"
              id="unit-speed"
              name="unit-speed"
              v-model="units.speed"
            >
              <option
                v-for="(data, index) in propData.data.select.speed"
                :key="index"
                :selected="data.value === units.speed"
                :value="data.value"
                class="units__option"
              >
                {{ data.label }}
              </option>
            </select>
          </div>
        </div>
        <AppButton
          class="button"
          :data="propData.data.button.submit"
          :is-disabled="!preferencesAreValid"
        />
      </section>
    </article>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/scss/data/colour";
@use "../assets/scss/data/effect";
@use "../assets/scss/data/fontsize";
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
    font-size: fontsize.$lg;
    font-weight: bold;
  }
}
.content {
  padding: 1rem;
  margin-inline: auto;
  background-color: colour.$window-body;
  &__title {
    all: unset;
    display: block;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid colour.$gunmetal-900;
    margin-bottom: 1rem;
    font-size: fontsize.$lg;
    font-weight: bold;
    &:not(:first-of-type) {
      margin-top: 2rem;
    }
  }
  &__input {
    &:not(:last-of-type) {
      margin-bottom: 1rem;
    }
  }
}
.locale-preview {
  margin-top: 1rem;
  font-size: fontsize.$sm;
  &__label {
    margin-right: 0.5rem;
  }
}
.units {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 1rem;
  margin-bottom: 2rem;
  &__label {
    display: block;
    margin-bottom: 0.5rem;
  }
  &__select {
    width: 100%;
    height: 3rem;
    padding-inline: 0.5rem;
    border: 1px solid colour.$input-border;
    box-shadow: effect.$drop-shadow-xs;
    background-color: colour.$input-background;
    text-transform: capitalize;
    cursor: pointer;
  }
}
.button {
  width: calc(100% - 1rem);
}
</style>

<script setup lang="ts">
// Types
import type {
  FormInputPropData,
  FormAutocompletePropData,
  AutocompleteEmitCountryData,
  TemperatureSelectPropData,
  SpeedSelectPropData,
} from "~/types/components/forms";
import type { ButtonPropData } from "~/types/components/app";
import type {
  PersonalPreferencesData,
  WeatherPreferencesData,
  LocalisationPreferencesData,
  UnitPreferencesData,
  UserPreferencesData,
} from "~/types/credentials";

// Components
import { SVGSave } from "#components";

// Meta
definePageMeta({ middleware: "auth-only" });

// Pinia stores
const userStore = useUserStore();

// Variables
const countryData = $countries.generateAutocompleteData();

// Prop data
const propData = {
  data: {
    input: <Record<string, FormInputPropData>>{
      name: {
        index: 0,
        type: "input",
        label: "Preferred Name",
        hint: "Your preferred display name",
        attributes: {
          id: "name",
          type: "text",
        },
      },
      weather_locale: {
        index: 1,
        type: "input",
        label: "Current Locale",
        hint: "The location used for weather data",
        attributes: {
          id: "weather-locale",
          type: "text",
        },
      },
    },
    autocomplete: <Record<string, FormAutocompletePropData>>{
      weather_country: {
        index: 2,
        type: "autocomplete",
        label: "Country",
        hint: "The country your locale is within",
        attributes: {
          id: "weather-country",
        },
        options: countryData,
      },
      localisation_country: {
        index: 3,
        type: "autocomplete",
        label: "Localisation Country",
        hint: "Controls localisation for date/time formatting",
        attributes: {
          id: "localisation-country",
        },
        options: countryData,
      },
    },
    select: {
      temperature: <TemperatureSelectPropData[]>[
        {
          label: "celsius",
          value: "c",
        },
        {
          label: "fahrenheit",
          value: "f",
        },
        {
          label: "kelvin",
          value: "k",
        },
      ],
      speed: <SpeedSelectPropData[]>[
        {
          label: "metres per second",
          value: "ms",
        },
        {
          label: "kilometres per hour",
          value: "kmh",
        },
        {
          label: "miles per hour",
          value: "mph",
        },
        {
          label: "knots",
          value: "kn",
        },
      ],
    },
    button: <Record<string, ButtonPropData>>{
      submit: {
        function: async () => await updateSettingsWrapper(),
        label: "Update",
        icon: SVGSave,
        attributes: {
          type: "button",
        },
      },
    },
  },
};

// Reactive variables
const receiver: Ref<Record<string, AutocompleteEmitCountryData>> = ref({
  weather: {
    term: null,
    data: {
      country_id: null,
      country_name: null,
      iso_code: null,
    },
  },
  localisation: {
    term: null,
    data: {
      country_id: null,
      country_name: null,
      iso_code: null,
    },
  },
});
const personal: Ref<PersonalPreferencesData> = ref({
  name: null,
});
const weather: Ref<WeatherPreferencesData> = ref({
  locale: null,
  country: null,
});
const localisation: Ref<LocalisationPreferencesData> = ref({
  country: null,
});
const units: Ref<UnitPreferencesData> = ref({
  temperature: null,
  speed: null,
});
const timestamp = useNow();

// Computed properties
const day = computed(() => {
  const locale = localisation.value.country ?? "en-GB";
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  return timestamp.value.toLocaleDateString(locale, options);
});

const date = computed(() => {
  const locale = localisation.value.country ?? "en-GB";
  return timestamp.value.toLocaleDateString(locale);
});

const time = computed(() => {
  const locale = localisation.value.country ?? "en-GB";
  const options: Intl.DateTimeFormatOptions = { timeStyle: "medium" };
  return timestamp.value.toLocaleTimeString(locale, options);
});

const preferences: ComputedRef<UserPreferencesData> = computed(() => {
  const country = $countries.searchByCountryName(weather.value.country!);
  return {
    preferred_name: personal.value.name,
    country_id: country.country_id,
    locale: weather.value.locale,
    preferences_region: {
      locale_formatting: localisation.value.country,
    },
    preferences_units: {
      temperature: units.value.temperature,
      speed: units.value.speed,
    },
  };
});

const preferencesAreValid = computed(() => {
  return $app.allRefValuesArePopulated(preferences);
});

// Watchers
watch(receiver.value.localisation, () => {
  const code = receiver.value.localisation.data?.iso_code ?? "GB";
  localisation.value.country = `en-${code}`;
});

// Functions
function assignPersonalValues() {
  personal.value.name = userStore.getName;
}

function assignWeatherValues() {
  weather.value.locale = userStore.getLocale;
  weather.value.country = userStore.getCountryName;
  receiver.value.weather.term = weather.value.country;
  receiver.value.weather.data = $countries.searchByID(userStore.getCountryID!);
}

function assignLocalisationValues() {
  const format = userStore.getPreferredLocaleFormatting;
  const data = $countries.searchByISOCode(format!);
  receiver.value.localisation.term = data.country_name;
  receiver.value.localisation.data = data;
}

function assignUnitValues() {
  units.value.temperature = userStore.getPreferredTemperatureUnit;
  units.value.speed = userStore.getPreferredSpeedUnit;
}

function assignValues() {
  assignPersonalValues();
  assignWeatherValues();
  assignLocalisationValues();
  assignUnitValues();
}

async function updateSettingsWrapper() {
  await userStore.updatePreferences(preferences.value);
}

onMounted(async () => {
  await userStore.init();
  assignValues();
});
</script>

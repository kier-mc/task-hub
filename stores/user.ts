// Types
import type {
  UserStoreState,
  UserStoreResponseData,
  UserStoreStatePreferences,
} from "~/types/store.user";
import type { Database } from "~/types/schema";
import type {
  TemperatureUnitsShort,
  SpeedUnitsShort,
} from "~/types/unions/generic.units";
import type {
  CountryID,
  CountryName,
  CountryISOCode,
} from "~/types/unions/schema.country";

/**
 * A Pinia store for handling user data.
 */
export const useUserStore = defineStore("user", {
  state: (): UserStoreState => ({
    response: null,
    name: null,
    email: null,
    location: {
      country_id: null,
      country_name: null,
      iso_code: null,
      locale: null,
    },
    preferences: {
      region: {
        locale_formatting: null,
      },
      units: {
        speed: null,
        temperature: null,
      },
    },
  }),
  actions: {
    async init() {
      if (!this.response) {
        await this.fetchData();
      }
    },
    async fetchData(force?: boolean): Promise<void> {
      if (!force && this.response) return;
      const request = await useSupabaseClient().auth.getUser();
      if (!request.data.user) {
        throw new Error(
          "Unable to fetch data from remote server. Check your connection and ensure that you are logged in"
        );
      }
      // Copy the initial response to the store
      this.response = request.data.user;
      // Query the database for the required data
      const { data, error } = await useSupabaseClient<Database>()
        .from("users")
        .select(
          `
          preferred_name,
          email,
          country_id,
          locale,
          preferences_app,
          preferences_region,
          preferences_units
          `
        );
      if (error) {
        throw new Error(error.message);
      }
      // Assign the received data to the store
      if (data) {
        const response: UserStoreResponseData = data[0];
        [
          this.name,
          this.email,
          this.location.country_id,
          this.location.country_name,
          this.location.iso_code,
          this.location.locale,
          this.preferences.region.locale_formatting,
          this.preferences.units.speed,
          this.preferences.units.temperature,
        ] = [
          response.preferred_name,
          response.email,
          response.country_id,
          $countries.searchByID(response.country_id).country_name,
          $countries.searchByID(response.country_id).iso_code,
          response.locale,
          response.preferences_region.locale_formatting,
          response.preferences_units.speed,
          response.preferences_units.temperature,
        ];
      }
    },
  },
  getters: {
    getName(): string | null {
      return this.name;
    },
    getCountryID(): CountryID | null {
      return this.location.country_id;
    },
    getCountryName(): CountryName | null {
      return this.location.country_name;
    },
    getCountryISOCode(): CountryISOCode | null {
      return this.location.iso_code;
    },
    getLocale(): string | null {
      return this.location.locale;
    },
    getPreferredLocaleFormatting(): CountryISOCode | null {
      return this.preferences.region.locale_formatting;
    },
    getPreferredUnits(): UserStoreStatePreferences["units"] | null {
      return this.preferences.units;
    },
    getPreferredTemperatureUnit(): TemperatureUnitsShort | null {
      return this.preferences.units.temperature;
    },
    getPreferredSpeedUnit(): SpeedUnitsShort | null {
      return this.preferences.units.speed;
    },
  },
});

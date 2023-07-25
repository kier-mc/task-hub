/* Type imports */
import type { UserStoreState } from "types/store.user";
import type { Database, AppUserMetadata } from "types/schema";
import type { TemperatureUnitsShort } from "types/unions/generic.units";
import type {
  CountryID,
  CountryName,
  CountryISOCode,
} from "types/unions/schema.country";

/**
 * A Pinia store for handling user data.
 */
export const useUserStore = defineStore("user", {
  state: (): UserStoreState => ({
    data: null,
    name: null,
    country: {
      country_id: null,
      name: null,
      iso_code: null,
      locale: null,
    },
    preferences: {
      units: {
        temperature: null ?? "c",
      },
    },
  }),
  actions: {
    async fetchData(force?: boolean): Promise<void> {
      if (!force && this.data) return;
      const request = await useSupabaseAuthClient().auth.getUser();
      if (!request.data.user) {
        throw new Error(
          "Unable to fetch data from remote server. Check your connection and ensure that you are logged in"
        );
      }
      this.data = request.data.user;
      const { data, error } = await useSupabaseClient<Database>()
        .from("users")
        .select(
          `
          preferred_name,
          country_id,
          locale,
          preferences_units,
          preferences_app
          `
        );
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        const response: AppUserMetadata = data[0];
        [
          this.name,
          this.country.country_id,
          this.country.name,
          this.country.iso_code,
          this.country.locale,
          this.preferences.units.temperature,
        ] = [
          response.preferred_name,
          response.country_id,
          countryData.searchByID(response.country_id).name,
          countryData.searchByID(response.country_id).iso_code,
          response.locale,
          response.preferences_units.temperature,
        ];
      }
    },
    getName(): string | null {
      if (!this.data) {
        throw new Error("No local user data available");
      }
      return this.name;
    },
    getCountryID(): CountryID | null {
      if (!this.data) {
        throw new Error("No local user data available");
      }
      return this.country.country_id;
    },
    getCountryName(): CountryName | null {
      if (!this.data) {
        throw new Error("No local user data available");
      }
      return this.country.name;
    },
    getCountryISOCode(): CountryISOCode | null {
      if (!this.data) {
        throw new Error("No local user data available");
      }
      return this.country.iso_code;
    },
    getLocale(): string | null {
      if (!this.data) {
        throw new Error("No local user data available");
      }
      return this.country.locale;
    },
    getPreferredUnit(): TemperatureUnitsShort | null {
      if (!this.data) {
        throw new Error("No local user data available");
      }
      return this.preferences.units.temperature;
    },
  },
});

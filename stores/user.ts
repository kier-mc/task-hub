/* Type definitions */
import { User } from "@supabase/supabase-js";

/**
 * A Pinia store for handling user data.
 */
export const useUserStore = defineStore("user", {
  state: (): UserStoreState => ({
    data: null,
    unit: "celsius",
  }),
  actions: {
    async fetchData(): Promise<User | void> {
      const request = await useSupabaseAuthClient().auth.getUser();
      if (!request.data.user) return;
      return (this.data = request.data.user);
    },
    clearData(): void {
      this.data = null;
    },
    getPreferredName(): string | void {
      if (!this.data) return;
      return this.data.user_metadata.preferred_name;
    },
    getCountryID(): number | void {
      if (!this.data) return;
      return this.data.user_metadata.country_id;
    },
    getCountryName(): CountryName | void {
      if (!this.data) return;
      const country = convertCountry(
        this.data.user_metadata.country_id
      ) as CountryName;
      return country;
    },
    getCountryISOCode(): CountryISOCode | void {
      if (!this.data) return;
      const code = getISOCodeFromCountry(this.getCountryName() as CountryName);
      return code;
    },
    getLocale(): string | void {
      if (!this.data) return;
      return this.data.user_metadata.locale;
    },
    getPreferredUnit(): UnitPreferenceObject {
      switch (this.unit) {
        case "celsius": {
          return {
            unit: "celsius",
            symbol: "°C",
          };
        }
        case "kelvin": {
          return {
            unit: "kelvin",
            symbol: "K",
          };
        }
        case "fahrenheit": {
          return {
            unit: "fahrenheit",
            symbol: "°F",
          };
        }
        default: {
          return {
            unit: "celsius",
            symbol: "°C",
          };
        }
      }
    },
  },
});

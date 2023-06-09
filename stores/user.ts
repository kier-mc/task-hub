/* Type definitions */
import { User } from "@supabase/supabase-js";
/**
 * A Pinia store for handling user data.
 */
export const useUserStore = defineStore("user", {
  state: () => ({
    data: null as User | null,
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
    getName(): string | void {
      if (!this.data) return;
      return this.data.user_metadata.preferred_name;
    },
    getCountry(): CountryName | void {
      if (!this.data) return;
      const country = convertCountry(
        this.data.user_metadata.country_id
      ) as CountryName;
      return country;
    },
    getLocale(): string | void {
      if (!this.data) return;
      return this.data.user_metadata.locale;
    },
  },
});

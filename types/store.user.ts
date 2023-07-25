import type { User } from "@supabase/supabase-js";
import type { CountryDataPayload } from "./schema";
import type { TemperatureUnitsShort } from "./unions/generic.units";
/**
 * Specifically manages the Pinia user store.
 */
export interface UserStoreState {
  /**
   * The complete response received from the Supabase User object when data is fetched.
   */
  data: User | null;
  /**
   * The user's preferred name, as specified by them.
   */
  name: string | null;
  /**
   * Groups information related to the user's country data.
   */
  country: UserStoreCountryData;
  /**
   * Groups information related to the user's app preferences.
   */
  preferences: UserStoreStatePreferences;
}
/**
 * Contains the user's country data.
 */
interface UserStoreCountryData extends CountryDataPayload {
  /**
   * The user's current locale (city, town etc).
   */
  locale: string | null;
}
/**
 * Contains the user's app preferences.
 */
interface UserStoreStatePreferences {
  /**
   * Groups information related to the user's unit preferences.
   */
  units: {
    /**
     * The user's preferred temperature unit.
     */
    temperature: TemperatureUnitsShort | null;
  };
}

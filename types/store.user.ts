import type { User } from "@supabase/supabase-js";
import type {
  CountryData,
  DatabaseAppPreferences,
  DatabaseRegionPreferences,
  DatabaseUnitPreferences,
} from "~/types/schema";
import type {
  SpeedUnitsShort,
  TemperatureUnitsShort,
} from "~/types/unions/generic.units";
import { CountryID, CountryISOCode } from "~/types/unions/schema.country";
/**
 * Specifically manages the Pinia user store.
 */
export interface UserStoreState {
  /**
   * The complete response received from the Supabase User object when data is fetched.
   */
  response: User | null;
  /**
   * The user's preferred name, as specified by them.
   */
  name: string | null;
  /**
   * The user's email address.
   */
  email: string | null;
  /**
   * Groups information related to the user's country data.
   */
  location: UserStoreCountryData;
  /**
   * Groups information related to the user's app preferences.
   */
  preferences: UserStoreStatePreferences;
}
/**
 * Contains the user's country data.
 */
interface UserStoreCountryData extends CountryData {
  /**
   * The user's current locale (city, town etc).
   */
  locale: string | null;
}
/**
 * Contains the user's app preferences.
 */
export interface UserStoreStatePreferences {
  /**
   * Groups information related to the user's regional preferences.
   * For example, locale formatting options.
   */
  region: {
    /**
     * The user's preferred country locale formatting preference.
     * Affects the way that data using locale formatting (eg
     * dates, times)  are formatted, including language, choice of
     * delimiter and calendar type. Allows the user to set a
     * preference which is different to their current location.
     * For example, a person who speaks English may currently
     * be located in Japan, but does not want their dashboard to
     * display kanji, necessarily.
     */
    locale_formatting: CountryISOCode | null;
  };
  /**
   * Groups information related to the user's unit preferences.
   * For example, temperature and distance measurements.
   */
  units: {
    /**
     * The user's preferred speed measurement unit.
     */
    speed: SpeedUnitsShort | null;
    /**
     * The user's preferred temperature unit.
     */
    temperature: TemperatureUnitsShort | null;
  };
}
export interface UserStoreResponseData {
  preferred_name: string;
  email: string;
  country_id: CountryID;
  locale: string;
  preferences_app: DatabaseAppPreferences;
  preferences_region: DatabaseRegionPreferences;
  preferences_units: DatabaseUnitPreferences;
}

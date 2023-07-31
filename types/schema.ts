import type {
  CountryID,
  CountryName,
  CountryISOCode,
} from "types/unions/schema.country";
import type {
  FrequencyID,
  FrequencyRepetition,
} from "./unions/schema.frequency";
import type { TemperatureUnitsShort } from "./unions/generic.units";

export interface Database {
  users: {
    user_id: number;
    user_uuid: string;
    created_at: string;
    email: string;
    preferred_name: string;
    country_id: CountryID;
    locale: string;
    preferences_app: DatabaseAppPreferences;
    preferences_region: DatabaseRegionPreferences;
    preferences_units: DatabaseUnitPreferences;
  };
  tasks: {
    task_id: number;
    created_at: string;
    author_id: number;
    task: string;
    description: string;
    frequency_id: FrequencyID;
    edited_at: string;
  };
  frequency: {
    frequency_id: FrequencyID;
    repeats_every: FrequencyRepetition;
  };
  countries: CountryData;
}

export interface CountryData {
  country_id: CountryID;
  name: CountryName;
  iso_code: CountryISOCode;
}

export interface CountryDataPayload {
  country_id: CountryID | null;
  name: CountryName | null;
  iso_code: CountryISOCode | null;
}

export interface DatabaseAppPreferences {}

export interface DatabaseUnitPreferences {
  temperature: TemperatureUnitsShort;
}

export interface DatabaseRegionPreferences {
  locale_formatting: CountryISOCode;
}

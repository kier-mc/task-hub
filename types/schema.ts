import type {
  CountryID,
  CountryName,
  CountryISOCode,
} from "types/unions/schema.country";
import type {
  FrequencyID,
  FrequencyRepetition,
} from "./unions/schema.frequency";
import type {
  SpeedUnitsShort,
  TemperatureUnitsShort,
} from "./unions/generic.units";

export interface Database {
  users: UsersTable;
  tasks: TasksTable;
  frequency: FrequencyTable;
  countries: CountriesTable;
  tags: TagsTable;
}

export interface UsersTable {
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
}

export interface TasksTable {
  task_id: number;
  created_at: string;
  author_id: number;
  task: string;
  description: string;
  frequency_id: FrequencyID;
  edited_at: string;
  tag_id: number;
}

export interface FrequencyTable {
  frequency_id: FrequencyID;
  repeats_every: FrequencyRepetition;
}

export interface CountriesTable {
  country_id: CountryID;
  country_name: CountryName;
  iso_code: CountryISOCode;
}

export interface TagsTable {
  tag_id: number;
  created_at: string;
  tag: string;
  type: string;
}

export type CountryData = {
  [K in keyof CountriesTable]: CountriesTable[K] | null;
};

export interface DatabaseAppPreferences {}

export interface DatabaseUnitPreferences {
  temperature: TemperatureUnitsShort;
  speed: SpeedUnitsShort;
}

export interface DatabaseRegionPreferences {
  locale_formatting: CountryISOCode;
}

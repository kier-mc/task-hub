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
import type { TagID, TagLabel, TagType } from "./unions/schema.tags";

export interface Database {
  users: UsersTable;
  tasks: TasksTable;
  frequency: FrequencyTable;
  countries: CountriesTable;
  tags: TagsTable;
}

export type UsersTable = {
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

export type TasksTable = {
  task_id: number;
  created_at: string;
  author_id: number;
  task: string;
  description: string;
  frequency_id: FrequencyID;
  edited_at: string;
};

export type FrequencyTable = {
  frequency_id: FrequencyID;
  repeats_every: FrequencyRepetition;
};

export type CountriesTable = {
  country_id: CountryID;
  country_name: CountryName;
  iso_code: CountryISOCode;
};

export type TagsTable = {
  tag_id: TagID;
  created_at: string;
  label: TagLabel;
  type: TagType;
};

export type CountryData = {
  [key in keyof CountriesTable]: CountriesTable[key] | null;
};

export type TagData = {
  [key in keyof TagsTable]: TagsTable[key] | null;
};

export type FrequencyData = {
  [key in keyof FrequencyTable]: FrequencyTable[key] | null;
};

export interface DatabaseAppPreferences {}

export interface DatabaseUnitPreferences {
  temperature: TemperatureUnitsShort;
  speed: SpeedUnitsShort;
}

export interface DatabaseRegionPreferences {
  locale_formatting: CountryISOCode;
}

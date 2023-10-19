import { CountryData } from "~/types/schema";
import { CountryName, CountryID } from "./unions/schema.country";
import { TemperatureUnitsShort, SpeedUnitsShort } from "./unions/generic.units";

export interface LoginCredentialData {
  email: string | null;
  password: string | null;
}

export interface NewAccountCredentialData {
  [index: string]: any;
  email: string | null;
  password: string | null;
  name: string | null;
  location: CountryData | null;
  locale: string | null;
}

export interface PersonalPreferences {
  name: string;
}

export type PersonalPreferencesData = {
  [key in keyof PersonalPreferences]: PersonalPreferences[key] | null;
}

export interface WeatherPreferences{
  locale: string;
  country: CountryName;
}

export type WeatherPreferencesData = {
  [key in keyof WeatherPreferences]: WeatherPreferences[key] | null;
}

export interface LocalisationPreferences {
  country: CountryName;
  code: string;
}

export type LocalisationPreferencesData = {
  [key in keyof LocalisationPreferences]: LocalisationPreferences[key] | null;
}

export interface UnitPreferences {
  temperature: TemperatureUnitsShort;
  speed: SpeedUnitsShort;
}

export type UnitPreferencesData = {
  [key in keyof UnitPreferences]: UnitPreferences[key] | null;
}

export interface UserPreferences {
  preferred_name: string,
  country_id: CountryID,
  locale: string,
  preferences_region: {
    locale_formatting: LocalisationPreferences["code"]
  },
  preferences_units: {
    temperature: UnitPreferences["temperature"];
    speed: UnitPreferences["speed"];
  },
}

export type UserPreferencesData = {
  [key in keyof UserPreferences]: UserPreferences[key] extends Record<string, any>
    ? {
        [property in keyof UserPreferences[key]]: UserPreferences[key][property] | null;
      }
    : UserPreferences[key] | null;
};
import { CountryData } from "./schema";

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

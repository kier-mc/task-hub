// Main database schema type definitions
interface Database {
  users: {
    user_id: number;
    user_uuid: string;
    created_at: string;
    email: string;
    preferred_name: string;
  };
  tasks: {
    task_id: number;
    created_at: string;
    author_id: number;
    task: string;
    description: string;
    frequency_id: number;
    edited_at: string;
  };
  frequency: {
    frequency_id: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    repeats_every:
      | "daily"
      | "weekly"
      | "fortnightly"
      | "monthly"
      | "triannually"
      | "biannually"
      | "annually";
  };
  countries: {
    country_id: CountryIDs;
    name: CountryNames;
    iso_code: CountryISOCodes;
  };
}

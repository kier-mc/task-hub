// Database schema
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
    frequency_id: FrequencyID;
    repeats_every: FrequencyRepetition;
  };
  countries: {
    country_id: CountryID;
    name: CountryName;
    iso_code: CountryISOCode;
  };
}

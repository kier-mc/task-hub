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
  };
  frequency: {
    frequency_id: number;
    repeats_every:
      | "daily"
      | "weekly"
      | "fortnightly"
      | "monthly"
      | "triannually"
      | "biannually"
      | "annually";
  };
}

// Generic response class
interface DBResponse {
  error: null;
  data: Array<any>;
  count: null;
  status: number;
  statusText: string;
}

// Specific response extensions
interface AuthorResponse extends DBResponse {
  data: Array<Database["users"]>;
}

interface FrequencyResponse extends DBResponse {
  data: Array<Database["frequency"]>;
}

// Main database schema type definitions
interface Database {
  author: {
    author_id?: number;
    name?: string;
  };
  frequency: {
    frequency_id?: number;
    name?: string;
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
  data: Array<Database["author"]>;
}

interface FrequencyResponse extends DBResponse {
  data: Array<Database["frequency"]>;
}

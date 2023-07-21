interface LoginCredentialData {
  email: string | null;
  password: string | null;
}

interface NewAccountCredentialData {
  [index: string]: any | null;
  email: string | null;
  password: string | null;
  name: string | null;
  country: {
    [index: string]: string | null;
    label: string | null;
    value: string | null;
  };
  locale: string | null;
}

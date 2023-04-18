interface NavDataLinkObject {
  index: number;
  name: string;
  url: string;
  requiresAuth: boolean;
  alwaysDisplay?: true;
}

interface NavDataObject {
  index: number;
  title: string;
  links: Array<NavDataLinkObject>;
}

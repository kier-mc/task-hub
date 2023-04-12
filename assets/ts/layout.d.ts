interface NavDataLinkObject {
  index: number;
  name: string;
  url: string;
}

interface NavDataObject {
  index: number;
  title: string;
  links: Array<NavDataLinkObject>;
}

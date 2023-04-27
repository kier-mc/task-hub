interface NavDataLinkObject {
  index: number;
  name: string;
  type: string;
  display: "always" | "auth=true" | "auth=false";
  url?: string;
}

interface NavDataObject {
  index: number;
  title: string;
  display: "always" | "auth=true" | "auth=false";
  links: Array<NavDataLinkObject>;
}

interface UserStoreState {
  data: User | null;
  unit: UnitPreferenceObject["unit"];
}

interface UnitPreferenceObject {
  unit: "celsius" | "kelvin" | "fahrenheit";
  symbol: "°C" | "K" | "°F";
}

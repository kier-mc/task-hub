/**
 * A Pinia store for managing weather data.
 * Can call OpenWeatherMap API and retrieve data related to the user's current location.
 * Stores the API response in the store to avoid repeat calls to the endpoint.
 */
export const useWeatherStore = defineStore("weather", {
  state: () => ({
    weather: null as null | OpenWeatherMapResponse,
  }),
  actions: {
    async getWeather(location: string): Promise<OpenWeatherMapResponse> {
      if (!this.weather) {
        const config = useRuntimeConfig();
        const key = config.public.openWeatherKey;
        const weather = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;
        return (this.weather = await (await fetch(weather)).json());
      }
      return this.weather as OpenWeatherMapResponse;
    },
  },
});

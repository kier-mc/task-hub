import { useNotificationsStore } from "./notifications";
import { setActivePinia, createPinia } from "pinia";

setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();
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
    /**
     * Checks the store of the presence of any weather data and returns it.
     * If there is no weather data present, will call the API endpoint and populate it.
     * This function should take precedence when displaying weather data, except when the
     * stored data requires updating with more current information.
     * If the fetch response is anything other than a 2xx HTTP status code,
     * a generic error message will be passed to the user and the function will return void.
     * @param location {string} - A string to be parsed by the API as a location.
     * Ideally, it will be passed as a place name followed by an ISO 3166 country code,
     * e.g. "Halton, GB", although this isn't strictly necessary for the lookup to function.
     * @returns {(OpenWeatherMapResponse|Promise<void>)} - An object containing data regarding weather
     * for the location that was passed as a parameter. If the location is invalid or the call
     * fails for any other reason, the function returns void and pushes a generic error notification
     * to the user.
     */
    async getWeather(location: string): Promise<OpenWeatherMapResponse | void> {
      if (!this.weather) {
        const config = useRuntimeConfig();
        const key = config.public.openWeatherKey;
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;
        const response = await fetch(endpoint);
        if (Math.floor((response.status % 1000) / 100) != 2) {
          notificationsStore.setMessage(
            "An error occurred whilst attempting to retrieve weather data",
            "error"
          );
          return;
        }
        this.weather = await response.json();
      }
      return this.weather as OpenWeatherMapResponse;
    },
    /**
     * Forces an update to the weather store, regardless of whether any data is already present.
     * If an initial call is being made, prefer {@link getWeather()}, as it is idempotent
     * if data is already present in the store and will avoid repeated calls to the endpoint.
     * If the fetch response is anything other than a 2xx HTTP status code,
     * a generic error message will be passed to the user and the function will return void.
     * @param location {string} - A string to be parsed by the API as a location.
     * Ideally, it will be passed as a place name followed by an ISO 3166 country code,
     * e.g. "Halton, GB", although this isn't strictly necessary for the lookup to function.
     * @returns {(Promise<void>)} - A successful update will silently update the local weather data.
     * If the location is invalid or the call fails for any other reason,
     * the function returns void and pushes a generic error notification to the user.
     */
    async updateWeather(location: string): Promise<void> {
      const config = useRuntimeConfig();
      const key = config.public.openWeatherKey;
      const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;
      const response = await fetch(endpoint);
      if (Math.floor((response.status % 1000) / 100) != 2) {
        notificationsStore.setMessage(
          "An error occurred whilst attempting to retrieve weather data",
          "error"
        );
        return;
      }
      this.weather = await response.json();
    },
  },
});

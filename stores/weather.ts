import { useNotificationsStore } from "./notifications";
import { setActivePinia, createPinia } from "pinia";

setActivePinia(createPinia());
const notificationsStore = useNotificationsStore();

/**
 * An internal function used to call the OpenWeatherMap endpoint.
 * Requires a key and a location to be supplied in order to function.
 * Derives the API key from the .env via nuxt.config.ts and requires a location to
 * be specified as a parameter.
 * @param location {string} - A string to be parsed by the API as a location.
 * Ideally, it will be passed as a place name followed by an ISO 3166 country code,
 * e.g. "Halton, GB", although this isn't strictly necessary for the lookup to function.
 * @returns {Promise<OpenWeatherMapResponse|void} - An object containing data regarding weather
 * for the location that was passed as a parameter. If the location is invalid or the call
 * fails for any other reason, the function returns void and pushes a generic error notification
 * to the user.
 */
async function fetchFromEndpoint(
  location: string
): Promise<OpenWeatherMapResponse | void> {
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
  const data = await response.json();
  return data as OpenWeatherMapResponse;
}
/**
 * An internal function that converts a temperature value in Kelvin to either Celsius or Fahrenheit.
 * Contains a nested function that rounds the given value to a single decimal place.
 * @param temperature {number} - The temperature (in Kelvin) to be converted.
 * @param unit {"celsius"|"fahrenheit"} - The unit to which the temperature should be converted.
 * @returns {number} The converted number in the specified unit, rounded to a single decimal place.
 */
function convertTemperatureFromKelvin(
  temperature: number,
  unit?: "celsius" | "fahrenheit"
): number {
  function toTwoDecimalPlaces(input: number): number {
    return Math.round(input * 10) / 10;
  }
  switch (unit) {
    case "celsius": {
      const baselineConversion = temperature - 273.15;
      return toTwoDecimalPlaces(baselineConversion);
    }
    case "fahrenheit": {
      const baselineConversion = 1.8 * (temperature - 273) + 32;
      return toTwoDecimalPlaces(baselineConversion);
    }
    default:
      return toTwoDecimalPlaces(temperature);
  }
}
/**
 * A Pinia store for managing weather data.
 * Can call OpenWeatherMap API and retrieve data related to the user's current location.
 * Stores the API response in the store to avoid repeat calls to the endpoint, unless
 * this behaviour is explicitly specified.
 */
export const useWeatherStore = defineStore("weather", {
  state: () => ({
    data: null as null | OpenWeatherMapResponse,
  }),
  actions: {
    /**
     * Checks the store of the presence of any weather data and returns it.
     * If there is no weather data present, will call the API endpoint via {@link fetchFromEndpoint()} and populate it.
     * If the fetch response is anything other than a 2xx HTTP status code,
     * a generic error message will be passed to the user and the function will return void.
     * @param location {string} - A string to be parsed by the API as a location.
     * Ideally, it will be passed as a place name followed by an ISO 3166 country code,
     * e.g. "Halton, GB", although this isn't strictly necessary for the lookup to function.
     * It will be passed internally to {@link fetchFromEndpoint()}.
     * @param {WeatherStoreGetWeatherOptions} [options] - Optional options object for controlling the behaviour.
     * @param options.forceUpdate {boolean} - If set to true, the function will fetch data from the API endpoint,
     * even if local data is available. The default value is false.
     * @returns {(Promise<OpenWeatherMapResponse|void>)} An object containing data regarding weather
     * for the location that was passed as a parameter. If the location is invalid or the call
     * fails for any other reason, the function returns void and pushes a generic error notification
     * to the user. This behaviour is handled by {@link fetchFromEndpoint()}.
     */
    /* 
    TODO:
    1) Remove stdout statements when satisfied
    2) Pinia states are not stored between page refreshes.
       This could be problematic, as users may perform this function innately, which will make
       continual requests to the endpoint. Implementing a localStorage caching system should
       help to reduce this, but it will need to reference dates and intelligently update itself
       when needed. OpenWeatherMap recommend no more than one call per ten minutes per location, 
       as this is the update frequency limit and additional calls will serve no purpose.
       It could be worth leveraging this as part of the function itself, or as part of an
       intelligent caching system.
    */
    async getWeather(
      location: string,
      options?: WeatherStoreGetWeatherOptions
    ): Promise<OpenWeatherMapResponse | void> {
      if (!this.data) {
        console.log("No Pinia store data found. Fetching and returning...");
        const response = await fetchFromEndpoint(location);
        if (!response) return;
        this.data = response;
        return this.data;
      }
      if (options?.forceUpdate) {
        console.log(
          "Parameter explicitly requests data from endpoint. Fetching and returning..."
        );
        const response = await fetchFromEndpoint(location);
        if (!response) return;
        this.data = response;
        return this.data;
      }
      console.log(
        "Data already present or parameter explicitly denies remote fetch. Returning local data..."
      );
      return this.data as OpenWeatherMapResponse;
    },
    /**
     * Retrieves the temperature from the data object and returns it as a number.
     * Leverages {@link convertTemperatureFromKelvin()} internally to perform conversions.
     * Accepts optional parameters that modify which specific value is returned.
     * @param {"celsius"|"fahrenheit"} [unit] - Optional parameter which is supplied to
     * {@link convertTemperatureFromKelvin()} to specify which unit the return value is in.
     * @param {WeatherStoreGetTemperatureOptions} [options]  - Optional options object for controlling the behaviour.
     * @param options.type {"average"|"feels_like"|"max"|"min"} - Specifies the exact temperature type
     * to be returned. If no value is specified, will default to the average temperature.
     * @returns {(number|void)} A number representing the temperature as specified via the parameters.
     * Will return void if no data is present in the store.
     */
    getTemperature(
      unit?: "celsius" | "fahrenheit",
      options?: WeatherStoreGetTemperatureOptions
    ): number | void {
      if (!this.data) return;
      let temperature = this.data.main.temp;
      if (options) {
        switch (options.type) {
          case "average": {
            temperature = this.data.main.temp;
            break;
          }
          case "feels_like": {
            temperature = this.data.main.feels_like;
            break;
          }
          case "max": {
            temperature = this.data.main.temp_max;
            break;
          }
          case "min": {
            temperature = this.data.main.temp_min;
            break;
          }
          default: {
            temperature = this.data.main.temp;
            break;
          }
        }
      }
      if (unit)
        return convertTemperatureFromKelvin(temperature as number, unit);
      return convertTemperatureFromKelvin(temperature as number);
    },
  },
});

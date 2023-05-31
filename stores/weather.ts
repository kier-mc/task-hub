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
 * This function maintains this decimal place even if the number is an integer for formatting reasons, thus 20 is returned as "20.0".
 *
 * @param temperature {number} - The temperature (in Kelvin) to be converted.
 * @param {ConvertTemperatureFromKelvinOptions} [options]  - Optional options object for modifying the function's behaviour.
 * @param options.unit {"celsius"|"fahrenheit"|undefined} - Specifies the unit that the temperature will be returned in.
 * If no value is specified, will default to Kelvin.
 * @param options.locale {string} - Specifies the locale, which alters the formatting of the returned string to the specified
 * regional standard. Passed to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
 * internally. If no value is specified, will default to "GB".
 * @example
 * // Assuming an input temperature of 283.15K, returns "10.0"
 * getTemperature({locale: "GB"})
 * // Assuming an input temperature of 283.15K, returns "10,0"
 * getTemperature({locale: "SE"})
 * @returns {string} The converted value as a string in the specified unit, rounded to a single decimal place.
 */
function convertTemperatureFromKelvin(
  temperature: number,
  options?: {
    unit?: "celsius" | "fahrenheit" | undefined;
    locale?: string | undefined;
  }
): string {
  const { unit, locale = "GB" } = options || {};
  function toOneDecimalPlace(input: number): string {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(input);
  }
  switch (unit) {
    case "celsius": {
      const baselineConversion = temperature - 273.15;
      return toOneDecimalPlace(baselineConversion);
    }
    case "fahrenheit": {
      const baselineConversion = 1.8 * (temperature - 273) + 32;
      return toOneDecimalPlace(baselineConversion);
    }
    default:
      return toOneDecimalPlace(temperature);
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
    2) Changing location will not trigger an immediate update if it is within ten minutes
       of the last localStorage write. Needs a clause for this in the conditional, but it
       has to be considerate of how the user specifies the location. Consequently, it will
       probably be best to implement this after a system and interface has been built that
       allows the user to change their location, as checks can be enforced more accurately.
    */
    async getWeather(
      location: string,
      options?: WeatherStoreGetWeatherOptions
    ): Promise<OpenWeatherMapResponse | void> {
      // If data is found in localStorage
      if (localStorage.getItem("weatherData")) {
        console.log("Data found in localStorage. Comparing to stored data...");
        const parsedLocalWeatherData: OpenWeatherMapResponse = JSON.parse(
          localStorage.getItem("weatherData") as string
        );
        const currentDateTime = Math.floor(new Date().getTime() / 1000);
        const lastCallDateTime = parsedLocalWeatherData.dt;
        if (currentDateTime - lastCallDateTime > 600 || options?.forceUpdate) {
          console.log(
            `Data in localStorage is out of date by ${
              currentDateTime - 600 - lastCallDateTime
            } seconds. Fetching and returning new data...`
          );
          const response = await fetchFromEndpoint(location);
          if (!response) return;
          localStorage.setItem("weatherData", JSON.stringify(response));
          this.data = response;
          return this.data;
        }
        console.log(
          "Current time is within ten minutes of localStorage data. Returning local data..."
        );
        return (this.data = parsedLocalWeatherData);
      }
      // If no data is present in the store or the function is called with forceUpdate=true
      if (!this.data || options?.forceUpdate) {
        console.log(
          "No Pinia store data found. Fetching and returning new data..."
        );
        const response = await fetchFromEndpoint(location);
        if (!response) return;
        localStorage.setItem("weatherData", JSON.stringify(response));
        this.data = response;
        return this.data;
      }
      console.log(
        "Data already present or parameter explicitly denies remote fetch. Returning local data..."
      );
      return this.data as OpenWeatherMapResponse;
    },
    /**
     * Retrieves the temperature from the data object and returns it as a string.
     * Leverages {@link convertTemperatureFromKelvin()} internally to perform conversions.
     * Accepts optional options object that modify the specifics as to precisely what is returned.
     * @param {WeatherStoreGetTemperatureOptions} [options]  - Optional options object for modifying the function's behaviour.
     * @param options.type {"average"|"feels_like"|"max"|"min"|undefined} - Specifies the exact temperature type
     * to be returned. If no value is specified, will default to the average temperature.
     * @param options.unit {"celsius"|"fahrenheit"|undefined} - Specifies the unit that the temperature will be returned in.
     * Passed to {@link convertTemperatureFromKelvin()} internally. If no value is specified, will default to Kelvin.
     * @param options.locale {string} - Specifies the locale, which alters the formatting of the returned string to the specified
     * regional standard. Passed to [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     * internally, via {@link convertTemperatureFromKelvin()}. If no value is specified, will default to "GB".
     * @example
     * // Assuming an input temperature of 283.15K, returns "10.0"
     * getTemperature({locale: "GB"})
     * // Assuming an input temperature of 283.15K, returns "10,0"
     * getTemperature({locale: "SE"})
     * @returns {(string|void)} A string representing the temperature as specified via the parameters.
     * Will return void if no data is present in the store.
     */
    getTemperature(options?: WeatherStoreGetTemperatureOptions): string | void {
      if (!this.data) return;
      let temperature = this.data.main.temp;
      const { type, unit, locale } = options || {};
      switch (type) {
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
      return convertTemperatureFromKelvin(
        temperature,
        (options = { unit: unit, locale: locale })
      );
    },
  },
});

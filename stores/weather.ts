// Types
import type {
  WeatherStoreState,
  WeatherStoreLocationData,
  WeatherStoreTemperatureData,
  WeatherStoreWindData,
  OpenWeatherMapResponse,
} from "types/store.weather";
import type {
  CountryID,
  CountryISOCode,
  CountryName,
} from "types/unions/schema.country";
import type { OpenWeatherMapIconCode } from "types/unions/weather.icons";
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
  const notificationsStore = useNotificationsStore();
  const config = useRuntimeConfig();
  const key = config.public.openWeatherKey;
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;
  const response = await fetch(endpoint);
  if (Math.floor((response.status % 1000) / 100) != 2) {
    notificationsStore.push(
      "Error",
      "An error occurred whilst attempting to retrieve weather data"
    );
    return;
  }
  localStorage.setItem("weatherData", JSON.stringify(response));
  const data = await response.json();
  return data as OpenWeatherMapResponse;
}
/**
 * A Pinia store for managing weather data.
 * Can call OpenWeatherMap API and retrieve data related to the user's current location.
 * Stores the API response in the store to avoid repeat calls to the endpoint, unless
 * this behaviour is explicitly specified.
 */
export const useWeatherStore = defineStore("weather", {
  state: (): WeatherStoreState => ({
    response: null,
    timestamp: null,
    description: null,
    icon_code: null,
    atmosphere: {
      humidity: null,
      pressure: null,
    },
    location: {
      country_id: null,
      country_name: null,
      iso_code: null,
      locale: null,
      coordinates: {
        longitude: null,
        latitude: null,
      },
    },
    temperature: {
      average: null,
      minimum: null,
      maximum: null,
      feels_like: null,
    },
    wind: {
      speed: null,
      angle: null,
    },
  }),
  actions: {
    /**
     * Checks the store of the presence of any weather data and returns it.
     * If there is no weather data present, will call the API endpoint via {@link fetchFromEndpoint()} and populate it.
     * If the fetch response is anything other than a 2xx HTTP status code, a generic error message
     * will be passed to the user and the function will return void.
     * @param location {string}
     * A string to be parsed by the API as a location. Should ideally be passed as a place name
     * followed by an ISO 3166 country code, e.g. "Halton, GB".
     * @param forceUpdate {boolean}
     * If set to true, the function will fetch data from the API endpoint,
     * even if local data is available. The default value is false.
     * @returns {(Promise<OpenWeatherMapResponse|void>)}
     * An object containing data regarding weather for the location that was passed as a parameter.
     *
     */
    async fetchData(location: string, forceUpdate?: boolean): Promise<void> {
      const userStore = useUserStore();
      if (!userStore.response) await userStore.fetchData();
      /**
       * Helper function to assign response values to designated store keys.
       * Accepts an API response object to determine which values to use,
       * which is passed back unmodified as a return value once the function
       * is complete so that the response can be assigned to the store afterwards.
       * @param response {OpenWeatherMapResponse}
       * The JSONified response received from the API.
       * @returns {OpenWeatherMapResponse}
       * The unmodified initial response.
       */
      const assignValues = (response: OpenWeatherMapResponse) => {
        const units = {
          temp: userStore.getPreferredTemperatureUnit ?? "c",
          speed: userStore.getPreferredSpeedUnit ?? "ms",
        };
        const countryID = $countries.searchByISOCode(
          response.sys.country
        ).country_id;
        [
          // Assign store values
          this.timestamp,
          this.description,
          this.icon_code,
          this.atmosphere.humidity,
          this.atmosphere.pressure,
          this.location.country_id,
          this.location.country_name,
          this.location.iso_code,
          this.location.locale,
          this.location.coordinates.latitude,
          this.location.coordinates.longitude,
          this.temperature.average,
          this.temperature.minimum,
          this.temperature.maximum,
          this.temperature.feels_like,
          this.wind.speed,
          this.wind.angle,
        ] = [
          response.dt,
          response.weather[0].description,
          response.weather[0].icon,
          response.main.humidity,
          response.main.pressure,
          countryID,
          $countries.searchByID(countryID!).country_name,
          $countries.searchByID(countryID!).iso_code,
          response.name,
          response.coord.lat,
          response.coord.lon,
          $units.temperature.format(response.main.temp, units.temp),
          $units.temperature.format(response.main.temp_min, units.temp),
          $units.temperature.format(response.main.temp_max, units.temp),
          $units.temperature.format(response.main.feels_like, units.temp),
          $units.speed.format(response.wind.speed, units.speed),
          response.wind.deg,
        ];
        return response;
      };
      // If pre-existing weather data is found in local storage
      if (localStorage.getItem("weatherData")) {
        const local = localStorage.getItem("weatherData");
        const data: OpenWeatherMapResponse = JSON.parse(local!);
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const lastCallTime = data.dt;
        // Ignore local copy and fetch new data if the user has changed location
        if (userStore.getLocale !== data.name) {
          const response = await fetchFromEndpoint(location);
          if (!response) return;
          this.response = assignValues(response);
          localStorage.setItem("weatherData", JSON.stringify(response));
          return;
        }
        // Fetch new data if the time difference is greater than ten minutes
        if (currentTime - lastCallTime > 600 || forceUpdate) {
          const response = await fetchFromEndpoint(location);
          if (!response) return;
          this.response = assignValues(response);
          localStorage.setItem("weatherData", JSON.stringify(response));
          return;
        }
        // Otherwise, return the local copy
        this.response = assignValues(data);
        return;
      }
      // If no previous response was found or forceUpdate=true, fetch data
      if (!this.response || forceUpdate) {
        const response = await fetchFromEndpoint(location);
        if (!response) return;
        this.response = assignValues(response);
        localStorage.setItem("weatherData", JSON.stringify(response));
        return;
      }
    },
  },
  getters: {
    /**
     * The time the call was made, in Unix seconds.
     * @returns {number | null}
     */
    getTimestamp(): number | null {
      return this.timestamp;
    },
    /**
     * A description of the current weather conditions.
     * @returns {string | null}
     */
    getDescription(): string | null {
      return this.description;
    },
    /**
     * The icon code associated with the current weather conditions and time of day.
     * @returns {OpenWeatherMapIconCode | null}
     */
    getIconCode(): OpenWeatherMapIconCode | null {
      return this.icon_code;
    },
    /**
     * An object containing assorted data related to the call location.
     * @returns {WeatherStoreLocationData | null}
     */
    getLocationData(): WeatherStoreLocationData | null {
      return this.location;
    },
    /**
     * The country's numerical ID.
     * @returns {CountryID | null}
     */
    getCountryID(): CountryID | null {
      return this.location.country_id;
    },
    /**
     * The name of the country the location is located within.
     * @returns {CountryName | null}
     */
    getCountryName(): CountryName | null {
      return this.location.country_name;
    },
    /**
     * The ISO 3166 alpha-2 country code.
     * @returns {CountryISOCode | null}
     */
    getCountryISOCode(): CountryISOCode | null {
      return this.location.iso_code;
    },
    /**
     * The locale used in the call.
     * @returns {string | null}
     */
    getLocale(): string | null {
      return this.location.locale;
    },
    /**
     * An object containing the latitude and longitude of the data sampling site.
     * @returns {WeatherStoreLocationData["coordinates"]  | null}
     */
    getCoordinates(): WeatherStoreLocationData["coordinates"] | null {
      return this.location.coordinates;
    },
    /**
     * The latitude of the data sampling site.
     * @returns {number | null}
     */
    getLatitude(): number | null {
      return this.location.coordinates.latitude;
    },
    /**
     * The longitude of the data sampling site.
     * @returns {number | null}
     */
    getLongitude(): number | null {
      return this.location.coordinates.longitude;
    },
    /**
     * An object containing various temperature measurements.
     * @returns {WeatherStoreTemperatureData | null}
     */
    getTemperatureData(): WeatherStoreTemperatureData | null {
      return this.temperature;
    },
    /**
     * The average temperature for the location.
     * @returns {string | null}
     */
    getAverageTemperature(): string | null {
      return this.temperature.average;
    },
    /**
     * The minimum temperature for the location.
     * @returns {string | null}
     */
    getMinimumTemperature(): string | null {
      return this.temperature.minimum;
    },
    /**
     * The maximum temperature for the location.
     * @returns {string | null}
     */
    getMaximumTemperature(): string | null {
      return this.temperature.maximum;
    },
    /**
     * The "feels like" temperature for the location.
     * @returns {string | null}
     */
    getFeelsLikeTemperature(): string | null {
      return this.temperature.feels_like;
    },
    /**
     * An object containing various wind data.
     * @returns {WeatherStoreWindData | null}
     */
    getWindData(): WeatherStoreWindData | null {
      return this.wind;
    },
    /**
     * The current wind speed.
     * @returns {string | null}
     */
    getWindSpeed(): string | null {
      return this.wind.speed;
    },
    /**
     * The current wind direction, expressed in meteorological degrees (°).
     * The values are measured clockwise from true north.
     * 360 (or 0) represents true north,
     * 90 represents east,
     * 180 represents south
     * and 270 represents west.
     * For example, a value of 180 represents wind that eminates from the south
     * and blows toward the north.
     * @returns {number | null}
     */
    getWindAngle(): number | null {
      return this.wind.angle;
    },
    /**
     * The current wind direction, expressed as one of sixteen possible string positions
     * e.g. "N", "NW", "NWW" etc.
     * @returns {string | null}
     */
    getWindDirection(): string | null {
      if (!this.wind.angle) return null;
      const angle = this.wind.angle;
      /* prettier-ignore */
      const directions = [ // Start from South to get direction wind blows to, not from
        "S", "SSW", "SW", "SWW", "W", "NWW", "NW", "NNW",
        "N", "NNE", "NE", "NEE", "E", "SEE", "SE", "SSE"
      ];
      return directions[Math.round(angle / 22.5)];
    },
    /**
     * The current humidity, expressed as a percentage.
     * @returns {number | null}
     */
    getHumidity(): string | null {
      return `${this.atmosphere.humidity}%`;
    },
  },
});

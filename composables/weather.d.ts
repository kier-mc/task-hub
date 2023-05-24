interface OpenWeatherMapResponse {
  /**
   * An object containing geographical coordinates,
   * expressed as longitude/latitude in decimal degrees (DD).
   */
  coord: {
    /**
     * Longitude of the location, expressed in decimal degrees (DD).
     * Longitude may range from -180 (west) to +180 (east).
     */
    lon: number;
    /**
     * Latitude of the location, expressed in decimal degrees (DD).
     * Latitude may range from -90 (south) to +90 (north).
     */
    lat: number;
  };
  /**
   * An array containing an object with data about the current weather conditions.
   */
  weather: OpenWeatherMapWeatherObject[];
  /** Internal parameter. */
  base: string;
  /**
   * An object containing data regarding temperature, pressure and humidity.
   * Temperature is expressed in kelvin (K),
   * pressure is expressed in hectopascals (hPa)
   * and humidity is expressed as a percentage.
   */
  main: {
    /** Temperature, expressed in kelvin (K). */
    temp: number;
    /** Perceived temperature, expressed in kelvin (K). */
    feels_like: number;
    /**
     * Minimum temperature, expressed in kelvin (K).
     * Observed within large megalopolises and urban areas.
     */
    temp_min: number;
    /**
     * Maximum temperature, expressed in kelvin (K).
     * Observed within large megalopolises and urban areas.
     */
    temp_max: number;
    /**
     * Atmospheric pressure, expressed in hectopascals (hPa).
     * Refers to sea level, if sea_level and grnd_level parameters are absent.
     */
    pressure: number;
    /** Humidity, expressed as a percentage (%).
     */
    humidity: number;
    /** Atmospheric pressure at sea level, expressed in hectopascals (hPa).
     */
    sea_level?: number;
    /** Atmospheric pressure at ground level, expressed in hectopascals (hPa).
     */
    grnd_level?: number;
  };
  /** Total visibility, expressed in metres (m).
   *  Cannot exceed 10km (10000m).
   */
  visibility: number;
  /** An object containing data regarding wind conditions.
   */
  wind: {
    /** The current average wind speed, expressed in meters per second (m/s). */
    speed: number;
    /**
     * The current wind direction, expressed in meteorological degrees (°).
     * The values are measured clockwise from true north.
     * 360 (or 0) represents true north,
     * 90 represents east,
     * 180 represents south
     * and 270 represents west.
     * For example, a value of 180 represents wind that eminates from the south
     * and blows toward the north.
     */
    deg: number;
    /**
     * The current wind gust speed, expressed in metres per second (m/s).
     * Wind gust represents a sudden, short-lived burst of stronger wind
     * which exceeds the average wind speed within a given timeframe.
     */
    gust?: number;
  };
  /** An object containing data regarding cloudiness,
   * expressed as a percentage.
   */
  clouds: {
    /** Cloudiness, expressed as a percentage (%). */
    all: number;
  };
  /** An object containing data regarding total rainfall,
   * expressed in millimetres (mm).
   */
  rain?: {
    /** Total rainfall volume for the previous one hour period,
     * expressed in millimetres (mm).
     */
    "1h": number;
    /** Total rainfall volume for the previous three hour period,
     * expressed in millimetres (mm).
     */
    "3h": number;
  };
  /** An object containing data regarding total snowfall,
   * expressed in millimetres (mm).
   */
  snow?: {
    /** Total snowfall volume for the previous one hour period,
     * expressed in millimetres (mm).
     */
    "1h": number;
    /** Total snowfall volume for the previous three hour period,
     * expressed in millimetres (mm).
     */
    "3h": number;
  };
  /** The time of data calculation,
   * expressed in Unix time/seconds (s).
   * Relative to UTC (Coordinated Universal Time).
   */
  dt: number;
  /**
   * An object containing data largely used internally by the API.
   * Also contains information regarding country code and sunrise and sunset times.
   * These are expressed in Unix time/seconds (s),
   * which are relative to UTC (Coordinated Universal Time).
   */
  sys: {
    /** Internal parameter */
    type: number;
    /** Internal parameter */
    id: number;
    /** Internal parameter */
    message: string;
    /**
     * The country code (GB, DE, JP etc) for the location specified in the call.
     * Follows ISO 3166-1 standards.
     */
    country: string;
    /**
     * The time the sun rises at the location specified in the call,
     * expressed in Unix time/seconds (s).
     * Relative to UTC (Coordinated Universal Time).
     */
    sunrise: number;
    /**
     * The time the sun sets at the location specified in the call,
     * expressed in Unix time/seconds (s).
     * Relative to UTC (Coordinated Universal Time).
     */
    sunset: number;
  };
  /**
   * The timezone for the location specified in the call,
   * expressed in Unix time/seconds (s) as an offset.
   * Relative to UTC (Coordinated Universal Time).
   * UTC +00:00 is equivalent to an offset of 0.
   */
  timezone: number;
  /**
   * The city ID for the location specified in the call.
   * This is an OpenWeatherMap internal ID, which can be derived at
   * https://openweathermap.org/find
   */
  id: number;
  /** The city name for the location specified in the call. */
  name: string;
  /** Internal parameter */
  cod: number;
}

interface OpenWeatherMapWeatherObject {
  /** Weather condition ID. */
  id: number;
  /** Primary category for weather conditions (rain, cloud etc) */
  main: string;
  /** Subcategory of weather relevant to the primary category (light rain, broken cloud etc). */
  description: string;
  /** Weather icon ID. */
  icon: string;
}

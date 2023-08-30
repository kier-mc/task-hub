// Types
import type {
  SpeedUnitsShort,
  TemperatureUnitsShort,
} from "~/types/unions/generic.units";

/**
 * Small helper function to truncate the input number to the specified decimal places.
 * If no number is provided, the function will truncate to one decimal place.
 * @param input The number to be truncated.
 * @param options An optional options object that can specify two values, the minimum
 * and maximum fraction digits.
 * @returns {number} The truncated input number.
 */
function truncate(input: number, options?: Intl.NumberFormatOptions): number {
  const { minimumFractionDigits = 1, maximumFractionDigits = 1 } =
    options || {};
  return parseFloat(
    new Intl.NumberFormat(undefined, {
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
    }).format(input)
  );
}
/**
 * Converts a given speed to the specified unit, truncates the result and returns
 * it as a number. Accepts an optional options object that can be passed
 * to manipulate the return value. If no options object is provided, the return
 * will be truncated to one decimal place.
 * @param speed {number}
 * The speed (in metres per second) to be converted.
 * @param unit {SpeedUnitsShort}
 * The measurement to convert to.
 * @param options
 * An optional object that can be passed to manipulate the return value.
 * Parsed parameters are minimumFractionDigits and maximumFractionDigits.
 * @returns {number}
 * The final value, converted and truncated to the specified precision.
 */
function convertSpeed(
  speed: number,
  unit: SpeedUnitsShort,
  options?: Intl.NumberFormatOptions
): number {
  const map: Record<SpeedUnitsShort, Function> = {
    kmh: () => {
      return speed * 3.6;
    },
    kn: () => {
      return speed * 1.943844;
    },
    ms: () => {
      return speed;
    },
    mph: () => {
      return speed / 0.44704;
    },
  };
  return truncate(map[unit](), options);
}
/**
 * Converts a given temperature to the specified unit, truncates the result
 * and returns it as a number. Accepts an optional options object that can be passed
 * to manipulate the return value. If no options object is provided, the return
 * will be truncated to one decimal place.
 * @param temperature {number}
 * The temperature (in Kelvin) to be converted and formatted.
 * @param unit {TemperatureUnitsShort}
 * The scale to convert to.
 * @param options {Intl.NumberFormatOptions}
 * An optional object that can be passed to manipulate the return value.
 * Parsed parameters are minimumFractionDigits and maximumFractionDigits.
 * @returns {number}
 * The final value, converted and truncated to the specified precision.
 */
function convertTemperature(
  temperature: number,
  unit: TemperatureUnitsShort,
  options?: Intl.NumberFormatOptions
): number {
  const map: Record<TemperatureUnitsShort, Function> = {
    c: () => {
      return temperature - 273.15;
    },
    f: () => {
      return 1.8 * (temperature - 273) + 32;
    },
    k: () => {
      return temperature;
    },
  };
  return truncate(map[unit](), options);
}
/**
 * A helper object containing methods for handling units such as speed and
 * temperature.
 */
export const $units = {
  speed: {
    /**
     * Takes an input number (specified in metres per second), converts it to the specified
     * unit and returns a formatted string that includes the shorthand designation.
     * Accepts an optional options object that can be passed to manipulated the
     * return value. If no options object is provided, the return will be truncated
     * to one decimal place. If the data is available, the user's preferred locale
     * formatting options will be considered in the formatting. If this data cannot
     * be found, it will determine the formatting from the system locale.
     * @param speed {number}
     * The temperature (in Kelvin) to be converted and formatted.
     * @param unit {SpeedUnitsShort}
     * The scale to convert to.
     * @param options {Intl.NumberFormatOptions}
     * An optional object that can be passed to manipulate the return value.
     * Parsed parameters are minimumFractionDigits and maximumFractionDigits.
     * @returns {string}
     * A string that includes the converted temperature and the appropriate unit.
     * It will be formatted to either one decimal place and the user's locale
     * formatting preference, or to a single decimal place and the system locale.
     * @example
     * // Returns "15°C"
     * temperature.format(288.15, "c")
     * // Returns "17.5°C"
     * temperature.format(290.65, "c")
     * // Returns 20.25°C"
     * temperature.format(293.4, "c", {minimumFractionDigits: 2, maximumFractionDigits: 2})
     */
    format: (
      speed: number,
      unit: SpeedUnitsShort,
      options?: Intl.NumberFormatOptions
    ): string => {
      const userStore = useUserStore();
      const map: Record<SpeedUnitsShort, string> = {
        kmh: " km/h",
        kn: " kn",
        ms: " m/s",
        mph: " mph",
      };
      const locale = userStore.getPreferredLocaleFormatting ?? undefined;
      const output = new Intl.NumberFormat(locale, {
        minimumFractionDigits: options?.minimumFractionDigits ?? 1,
        maximumFractionDigits: options?.maximumFractionDigits ?? 1,
      }).format(convertSpeed(speed, unit, options));
      return output + map[unit];
    },
  },
  temperature: {
    /**
     * Takes an input number (specified in Kelvin), converts it to the specified
     * scale and returns a formatted string that includes the unit symbol.
     * Accepts an optional options object that can be passed to manipulated the
     * return value. If no options object is provided, the return will be truncated
     * to one decimal place. If the data is available, the user's preferred locale
     * formatting options will be considered in the formatting. If this data cannot
     * be found, it will determine the formatting from the system locale.
     * @param temperature {number}
     * The temperature (in Kelvin) to be converted and formatted.
     * @param unit {TemperatureUnitsShort}
     * The scale to convert to.
     * @param options {Intl.NumberFormatOptions}
     * An optional object that can be passed to manipulate the return value.
     * Parsed parameters are minimumFractionDigits and maximumFractionDigits.
     * @returns {string}
     * A string that includes the converted temperature and the appropriate unit.
     * It will be formatted to either one decimal place and the user's locale
     * formatting preference, or to a single decimal place and the system locale.
     * @example
     * // Returns "15°C"
     * temperature.format(288.15, "c")
     * // Returns "17.5°C"
     * temperature.format(290.65, "c")
     * // Returns 20.25°C"
     * temperature.format(293.4, "c", {minimumFractionDigits: 2, maximumFractionDigits: 2})
     */
    format: (
      temperature: number,
      unit: TemperatureUnitsShort,
      options?: Intl.NumberFormatOptions
    ): string => {
      const userStore = useUserStore();
      const map: Record<TemperatureUnitsShort, string> = {
        c: " °C",
        f: " °F",
        k: " K",
      };
      const locale = userStore.getPreferredLocaleFormatting ?? undefined;
      const output = new Intl.NumberFormat(locale, {
        minimumFractionDigits: options?.minimumFractionDigits ?? 1,
        maximumFractionDigits: options?.maximumFractionDigits ?? 1,
      }).format(convertTemperature(temperature, unit, options));
      return output + map[unit];
    },
  },
};

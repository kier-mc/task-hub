import { AutocompleteEmitCountryData } from "types/components/forms";
import { CountryData, CountryDataPayload } from "types/schema";
import {
  CountryID,
  CountryName,
  CountryISOCode,
} from "types/unions/schema.country";

/* prettier-ignore */
const COUNTRY_DATA: CountryData[] = [
  { country_id: 1, country_name: "Afghanistan", iso_code: "AF" },
  { country_id: 2, country_name: "Åland Islands", iso_code: "AX" },
  { country_id: 3, country_name: "Albania", iso_code: "AL" },
  { country_id: 4, country_name: "Algeria", iso_code: "DZ" },
  { country_id: 5, country_name: "American Samoa", iso_code: "AS" },
  { country_id: 6, country_name: "Andorra", iso_code: "AD" },
  { country_id: 7, country_name: "Angola", iso_code: "AO" },
  { country_id: 8, country_name: "Anguilla", iso_code: "AI" },
  { country_id: 9, country_name: "Antarctica", iso_code: "AQ" },
  { country_id: 10, country_name: "Antigua and Barbuda", iso_code: "AG" },
  { country_id: 11, country_name: "Argentina", iso_code: "AR" },
  { country_id: 12, country_name: "Armenia", iso_code: "AM" },
  { country_id: 13, country_name: "Aruba", iso_code: "AW" },
  { country_id: 14, country_name: "Australia", iso_code: "AU" },
  { country_id: 15, country_name: "Austria", iso_code: "AT" },
  { country_id: 16, country_name: "Azerbaijan", iso_code: "AZ" },
  { country_id: 17, country_name: "Bahamas", iso_code: "BS" },
  { country_id: 18, country_name: "Bahrain", iso_code: "BH" },
  { country_id: 19, country_name: "Bangladesh", iso_code: "BD" },
  { country_id: 20, country_name: "Barbados", iso_code: "BB" },
  { country_id: 21, country_name: "Belarus", iso_code: "BY" },
  { country_id: 22, country_name: "Belgium", iso_code: "BE" },
  { country_id: 23, country_name: "Belize", iso_code: "BZ" },
  { country_id: 24, country_name: "Benin", iso_code: "BJ" },
  { country_id: 25, country_name: "Bermuda", iso_code: "BM" },
  { country_id: 26, country_name: "Bhutan", iso_code: "BT" },
  { country_id: 27, country_name: "Bolivia", iso_code: "BO" },
  { country_id: 28, country_name: "Bonaire, Sint Eustatius and Saba", iso_code: "BQ" },
  { country_id: 29, country_name: "Bosnia and Herzegovina", iso_code: "BA" },
  { country_id: 30, country_name: "Botswana", iso_code: "BW" },
  { country_id: 31, country_name: "Bouvet Island", iso_code: "BV" },
  { country_id: 32, country_name: "Brazil", iso_code: "BR" },
  { country_id: 33, country_name: "British Indian Ocean Territory", iso_code: "IO" },
  { country_id: 34, country_name: "Brunei Darussalam", iso_code: "BN" },
  { country_id: 35, country_name: "Bulgaria", iso_code: "BG" },
  { country_id: 36, country_name: "Burkina Faso", iso_code: "BF" },
  { country_id: 37, country_name: "Burundi", iso_code: "BI" },
  { country_id: 38, country_name: "Cambodia", iso_code: "KH" },
  { country_id: 39, country_name: "Cameroon", iso_code: "CM" },
  { country_id: 40, country_name: "Canada", iso_code: "CA" },
  { country_id: 41, country_name: "Cape Verde", iso_code: "CV" },
  { country_id: 42, country_name: "Cayman Islands", iso_code: "KY" },
  { country_id: 43, country_name: "Central African Republic", iso_code: "CF" },
  { country_id: 44, country_name: "Chad", iso_code: "TD" },
  { country_id: 45, country_name: "Chile", iso_code: "CL" },
  { country_id: 46, country_name: "China", iso_code: "CN" },
  { country_id: 47, country_name: "Christmas Island", iso_code: "CX" },
  { country_id: 48, country_name: "Cocos (Keeling) Islands", iso_code: "CC" },
  { country_id: 49, country_name: "Colombia", iso_code: "CO" },
  { country_id: 50, country_name: "Comoros", iso_code: "KM" },
  { country_id: 51, country_name: "Congo", iso_code: "CG" },
  { country_id: 52, country_name: "Congo, the Democratic Republic of the", iso_code: "CD" },
  { country_id: 53, country_name: "Cook Islands", iso_code: "CK" },
  { country_id: 54, country_name: "Costa Rica", iso_code: "CR" },
  { country_id: 55, country_name: "Cote DIvoire", iso_code: "CI" },
  { country_id: 56, country_name: "Croatia", iso_code: "HR" },
  { country_id: 57, country_name: "Cuba", iso_code: "CU" },
  { country_id: 58, country_name: "Curaçao", iso_code: "CW" },
  { country_id: 59, country_name: "Cyprus", iso_code: "CY" },
  { country_id: 60, country_name: "Czech Republic", iso_code: "CZ" },
  { country_id: 61, country_name: "Denmark", iso_code: "DK" },
  { country_id: 62, country_name: "Djibouti", iso_code: "DJ" },
  { country_id: 63, country_name: "Dominica", iso_code: "DM" },
  { country_id: 64, country_name: "Dominican Republic", iso_code: "DO" },
  { country_id: 65, country_name: "Ecuador", iso_code: "EC" },
  { country_id: 66, country_name: "Egypt", iso_code: "EG" },
  { country_id: 67, country_name: "El Salvador", iso_code: "SV" },
  { country_id: 68, country_name: "Equatorial Guinea", iso_code: "GQ" },
  { country_id: 69, country_name: "Eritrea", iso_code: "ER" },
  { country_id: 70, country_name: "Estonia", iso_code: "EE" },
  { country_id: 71, country_name: "Ethiopia", iso_code: "ET" },
  { country_id: 72, country_name: "Falkland Islands (Malvinas)", iso_code: "FK" },
  { country_id: 73, country_name: "Faroe Islands", iso_code: "FO" },
  { country_id: 74, country_name: "Fiji", iso_code: "FJ" },
  { country_id: 75, country_name: "Finland", iso_code: "FI" },
  { country_id: 76, country_name: "France", iso_code: "FR" },
  { country_id: 77, country_name: "French Guiana", iso_code: "GF" },
  { country_id: 78, country_name: "French Polynesia", iso_code: "PF" },
  { country_id: 79, country_name: "French Southern Territories", iso_code: "TF" },
  { country_id: 80, country_name: "Gabon", iso_code: "GA" },
  { country_id: 81, country_name: "Gambia", iso_code: "GM" },
  { country_id: 82, country_name: "Georgia", iso_code: "GE" },
  { country_id: 83, country_name: "Germany", iso_code: "DE" },
  { country_id: 84, country_name: "Ghana", iso_code: "GH" },
  { country_id: 85, country_name: "Gibraltar", iso_code: "GI" },
  { country_id: 86, country_name: "Greece", iso_code: "GR" },
  { country_id: 87, country_name: "Greenland", iso_code: "GL" },
  { country_id: 88, country_name: "Grenada", iso_code: "GD" },
  { country_id: 89, country_name: "Guadeloupe", iso_code: "GP" },
  { country_id: 90, country_name: "Guam", iso_code: "GU" },
  { country_id: 91, country_name: "Guatemala", iso_code: "GT" },
  { country_id: 92, country_name: "Guernsey", iso_code: "GG" },
  { country_id: 93, country_name: "Guinea", iso_code: "GN" },
  { country_id: 94, country_name: "Guinea-Bissau", iso_code: "GW" },
  { country_id: 95, country_name: "Guyana", iso_code: "GY" },
  { country_id: 96, country_name: "Haiti", iso_code: "HT" },
  { country_id: 97, country_name: "Heard Island and Mcdonald Islands", iso_code: "HM" },
  { country_id: 98, country_name: "Holy See (Vatican City State)", iso_code: "VA" },
  { country_id: 99, country_name: "Honduras", iso_code: "HN" },
  { country_id: 100, country_name: "Hong Kong", iso_code: "HK" },
  { country_id: 101, country_name: "Hungary", iso_code: "HU" },
  { country_id: 102, country_name: "Iceland", iso_code: "IS" },
  { country_id: 103, country_name: "India", iso_code: "IN" },
  { country_id: 104, country_name: "Indonesia", iso_code: "ID" },
  { country_id: 105, country_name: "Iran, Islamic Republic of", iso_code: "IR" },
  { country_id: 106, country_name: "Iraq", iso_code: "IQ" },
  { country_id: 107, country_name: "Ireland", iso_code: "IE" },
  { country_id: 108, country_name: "Isle of Man", iso_code: "IM" },
  { country_id: 109, country_name: "Israel", iso_code: "IL" },
  { country_id: 110, country_name: "Italy", iso_code: "IT" },
  { country_id: 111, country_name: "Jamaica", iso_code: "JM" },
  { country_id: 112, country_name: "Japan", iso_code: "JP" },
  { country_id: 113, country_name: "Jersey", iso_code: "JE" },
  { country_id: 114, country_name: "Jordan", iso_code: "JO" },
  { country_id: 115, country_name: "Kazakhstan", iso_code: "KZ" },
  { country_id: 116, country_name: "Kenya", iso_code: "KE" },
  { country_id: 117, country_name: "Kiribati", iso_code: "KI" },
  { country_id: 118, country_name: "Korea, Democratic People's Republic of", iso_code: "KP" },
  { country_id: 119, country_name: "Korea, Republic of", iso_code: "KR" },
  { country_id: 120, country_name: "Kuwait", iso_code: "KW" },
  { country_id: 121, country_name: "Kyrgyzstan", iso_code: "KG" },
  { country_id: 122, country_name: "Lao People's Democratic Republic", iso_code: "LA" },
  { country_id: 123, country_name: "Latvia", iso_code: "LV" },
  { country_id: 124, country_name: "Lebanon", iso_code: "LB" },
  { country_id: 125, country_name: "Lesotho", iso_code: "LS" },
  { country_id: 126, country_name: "Liberia", iso_code: "LR" },
  { country_id: 127, country_name: "Libya", iso_code: "LY" },
  { country_id: 128, country_name: "Liechtenstein", iso_code: "LI" },
  { country_id: 129, country_name: "Lithuania", iso_code: "LT" },
  { country_id: 130, country_name: "Luxembourg", iso_code: "LU" },
  { country_id: 131, country_name: "Macao", iso_code: "MO" },
  { country_id: 132, country_name: "Macedonia, the Former Yugoslav Republic of", iso_code: "MK" },
  { country_id: 133, country_name: "Madagascar", iso_code: "MG" },
  { country_id: 134, country_name: "Malawi", iso_code: "MW" },
  { country_id: 135, country_name: "Malaysia", iso_code: "MY" },
  { country_id: 136, country_name: "Maldives", iso_code: "MV" },
  { country_id: 137, country_name: "Mali", iso_code: "ML" },
  { country_id: 138, country_name: "Malta", iso_code: "MT" },
  { country_id: 139, country_name: "Marshall Islands", iso_code: "MH" },
  { country_id: 140, country_name: "Martinique", iso_code: "MQ" },
  { country_id: 141, country_name: "Mauritania", iso_code: "MR" },
  { country_id: 142, country_name: "Mauritius", iso_code: "MU" },
  { country_id: 143, country_name: "Mayotte", iso_code: "YT" },
  { country_id: 144, country_name: "Mexico", iso_code: "MX" },
  { country_id: 145, country_name: "Micronesia, Federated States of", iso_code: "FM" },
  { country_id: 146, country_name: "Moldova, Republic of", iso_code: "MD" },
  { country_id: 147, country_name: "Monaco", iso_code: "MC" },
  { country_id: 148, country_name: "Mongolia", iso_code: "MN" },
  { country_id: 149, country_name: "Montenegro", iso_code: "ME" },
  { country_id: 150, country_name: "Montserrat", iso_code: "MS" },
  { country_id: 151, country_name: "Morocco", iso_code: "MA" },
  { country_id: 152, country_name: "Mozambique", iso_code: "MZ" },
  { country_id: 153, country_name: "Myanmar", iso_code: "MM" },
  { country_id: 154, country_name: "Namibia", iso_code: "NA" },
  { country_id: 155, country_name: "Nauru", iso_code: "NR" },
  { country_id: 156, country_name: "Nepal", iso_code: "NP" },
  { country_id: 157, country_name: "Netherlands", iso_code: "NL" },
  { country_id: 158, country_name: "New Caledonia", iso_code: "NC" },
  { country_id: 159, country_name: "New Zealand", iso_code: "NZ" },
  { country_id: 160, country_name: "Nicaragua", iso_code: "NI" },
  { country_id: 161, country_name: "Niger", iso_code: "NE" },
  { country_id: 162, country_name: "Nigeria", iso_code: "NG" },
  { country_id: 163, country_name: "Niue", iso_code: "NU" },
  { country_id: 164, country_name: "Norfolk Island", iso_code: "NF" },
  { country_id: 165, country_name: "Northern Mariana Islands", iso_code: "MP" },
  { country_id: 166, country_name: "Norway", iso_code: "NO" },
  { country_id: 167, country_name: "Oman", iso_code: "OM" },
  { country_id: 168, country_name: "Pakistan", iso_code: "PK" },
  { country_id: 169, country_name: "Palau", iso_code: "PW" },
  { country_id: 170, country_name: "Palestine, State of", iso_code: "PS" },
  { country_id: 171, country_name: "Panama", iso_code: "PA" },
  { country_id: 172, country_name: "Papua New Guinea", iso_code: "PG" },
  { country_id: 173, country_name: "Paraguay", iso_code: "PY" },
  { country_id: 174, country_name: "Peru", iso_code: "PE" },
  { country_id: 175, country_name: "Philippines", iso_code: "PH" },
  { country_id: 176, country_name: "Pitcairn", iso_code: "PN" },
  { country_id: 177, country_name: "Poland", iso_code: "PL" },
  { country_id: 178, country_name: "Portugal", iso_code: "PT" },
  { country_id: 179, country_name: "Puerto Rico", iso_code: "PR" },
  { country_id: 180, country_name: "Qatar", iso_code: "QA" },
  { country_id: 181, country_name: "Reunion", iso_code: "RE" },
  { country_id: 182, country_name: "Romania", iso_code: "RO" },
  { country_id: 183, country_name: "Russian Federation", iso_code: "RU" },
  { country_id: 184, country_name: "Rwanda", iso_code: "RW" },
  { country_id: 185, country_name: "Saint Barthélemy", iso_code: "BL" },
  { country_id: 186, country_name: "Saint Helena, Ascension and Tristan da Cunha", iso_code: "SH" },
  { country_id: 187, country_name: "Saint Kitts and Nevis", iso_code: "KN" },
  { country_id: 188, country_name: "Saint Lucia", iso_code: "LC" },
  { country_id: 189, country_name: "Saint Martin (French part)", iso_code: "MF" },
  { country_id: 190, country_name: "Saint Pierre and Miquelon", iso_code: "PM" },
  { country_id: 191, country_name: "Saint Vincent and the Grenadines", iso_code: "VC" },
  { country_id: 192, country_name: "Samoa", iso_code: "WS" },
  { country_id: 193, country_name: "San Marino", iso_code: "SM" },
  { country_id: 194, country_name: "Sao Tome and Principe", iso_code: "ST" },
  { country_id: 195, country_name: "Saudi Arabia", iso_code: "SA" },
  { country_id: 196, country_name: "Senegal", iso_code: "SN" },
  { country_id: 197, country_name: "Serbia", iso_code: "RS" },
  { country_id: 198, country_name: "Seychelles", iso_code: "SC" },
  { country_id: 199, country_name: "Sierra Leone", iso_code: "SL" },
  { country_id: 200, country_name: "Singapore", iso_code: "SG" },
  { country_id: 201, country_name: "Sint Maarten (Dutch part)", iso_code: "SX" },
  { country_id: 202, country_name: "Slovakia", iso_code: "SK" },
  { country_id: 203, country_name: "Slovenia", iso_code: "SI" },
  { country_id: 204, country_name: "Solomon Islands", iso_code: "SB" },
  { country_id: 205, country_name: "Somalia", iso_code: "SO" },
  { country_id: 206, country_name: "South Africa", iso_code: "ZA" },
  { country_id: 207, country_name: "South Georgia and the South Sandwich Islands", iso_code: "GS" },
  { country_id: 208, country_name: "South Sudan", iso_code: "SS" },
  { country_id: 209, country_name: "Spain", iso_code: "ES" },
  { country_id: 210, country_name: "Sri Lanka", iso_code: "LK" },
  { country_id: 211, country_name: "Sudan", iso_code: "SD" },
  { country_id: 212, country_name: "Suriname", iso_code: "SR" },
  { country_id: 213, country_name: "Svalbard and Jan Mayen", iso_code: "SJ" },
  { country_id: 214, country_name: "Swaziland", iso_code: "SZ" },
  { country_id: 215, country_name: "Sweden", iso_code: "SE" },
  { country_id: 216, country_name: "Switzerland", iso_code: "CH" },
  { country_id: 217, country_name: "Syrian Arab Republic", iso_code: "SY" },
  { country_id: 218, country_name: "Taiwan (Province of China)", iso_code: "TW" },
  { country_id: 219, country_name: "Tajikistan", iso_code: "TJ" },
  { country_id: 220, country_name: "Tanzania, United Republic of", iso_code: "TZ" },
  { country_id: 221, country_name: "Thailand", iso_code: "TH" },
  { country_id: 222, country_name: "Timor-Leste", iso_code: "TL" },
  { country_id: 223, country_name: "Togo", iso_code: "TG" },
  { country_id: 224, country_name: "Tokelau", iso_code: "TK" },
  { country_id: 225, country_name: "Tonga", iso_code: "TO" },
  { country_id: 226, country_name: "Trinidad and Tobago", iso_code: "TT" },
  { country_id: 227, country_name: "Tunisia", iso_code: "TN" },
  { country_id: 228, country_name: "Turkey", iso_code: "TR" },
  { country_id: 229, country_name: "Turkmenistan", iso_code: "TM" },
  { country_id: 230, country_name: "Turks and Caicos Islands", iso_code: "TC" },
  { country_id: 231, country_name: "Tuvalu", iso_code: "TV" },
  { country_id: 232, country_name: "Uganda", iso_code: "UG" },
  { country_id: 233, country_name: "Ukraine", iso_code: "UA" },
  { country_id: 234, country_name: "United Arab Emirates", iso_code: "AE" },
  { country_id: 235, country_name: "United Kingdom", iso_code: "GB" },
  { country_id: 236, country_name: "United States", iso_code: "US" },
  { country_id: 237, country_name: "United States Minor Outlying Islands", iso_code: "UM" },
  { country_id: 238, country_name: "Uruguay", iso_code: "UY" },
  { country_id: 239, country_name: "Uzbekistan", iso_code: "UZ" },
  { country_id: 240, country_name: "Vanuatu", iso_code: "VU" },
  { country_id: 241, country_name: "Venezuela", iso_code: "VE" },
  { country_id: 242, country_name: "Viet Nam", iso_code: "VN" },
  { country_id: 243, country_name: "Virgin Islands (British)", iso_code: "VG" },
  { country_id: 244, country_name: "Virgin Islands (U.S.)", iso_code: "VI" },
  { country_id: 245, country_name: "Wallis and Futuna", iso_code: "WF" },
  { country_id: 246, country_name: "Western Sahara", iso_code: "EH" },
  { country_id: 247, country_name: "Yemen", iso_code: "YE" },
  { country_id: 248, country_name: "Zambia", iso_code: "ZM" },
  { country_id: 249, country_name: "Zimbabwe", iso_code: "ZW" },
];

const payload: CountryDataPayload = {
  country_id: null,
  country_name: null,
  iso_code: null,
};

export const countries = {
  /**
   * Searches through all countries by their numerical index.
   * @param predicate {CountryID} A numerical value between 1 and 249 to search with.
   * @returns {CountryDataPayload} An object containing the complete data set, including the predicate.
   */
  searchByID: (predicate: CountryID) => {
    let start = 0;
    let end = COUNTRY_DATA.length - 1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      if (COUNTRY_DATA[mid].country_id === predicate) {
        payload.country_id = predicate;
        payload.country_name = COUNTRY_DATA[mid].country_name;
        payload.iso_code = COUNTRY_DATA[mid].iso_code;
        return payload;
      } else if (COUNTRY_DATA[mid].country_id < predicate) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    return payload;
  },
  /**
   * Searches through all countries by their ISO 3166 English short name. No character locale conversions are performed.
   * @param predicate {CountryName} The ISO 3166 English short name to search with.
   * @returns {CountryDataPayload} An object containing the complete data set, including the predicate.
   */
  searchBycountry_name: (predicate: CountryName) => {
    let start = 0;
    let end = COUNTRY_DATA.length - 1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      if (COUNTRY_DATA[mid].country_name === predicate) {
        payload.country_id = COUNTRY_DATA[mid].country_id;
        payload.country_name = predicate;
        payload.iso_code = COUNTRY_DATA[mid].iso_code;
        return payload;
      } else if (COUNTRY_DATA[mid].country_name < predicate) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    return payload;
  },
  /**
   * Searches through all countries by their ISO 3166 Alpha-2 code.
   * Slightly more expensive than other methods, as ISO codes are not inherently ordered.
   * @param predicate {CountryName} The ISO 3166 ISO 3166 Alpha-2 code to search with.
   * @returns {CountryDataPayload} An object containing the complete data set, including the predicate.
   */
  searchByISOCode: (predicate: CountryISOCode) => {
    let start = 0;
    let end = COUNTRY_DATA.length - 1;
    const data = COUNTRY_DATA.sort((a, b) =>
      a.iso_code.localeCompare(b.iso_code)
    ); // ISO codes are non-alphabetical
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      if (data[mid].iso_code === predicate) {
        payload.country_id = data[mid].country_id;
        payload.country_name = data[mid].country_name;
        payload.iso_code = predicate;
        return payload;
      } else if (data[mid].country_name < predicate) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    return payload;
  },
  /**
   * Generates an array of objects suitable for use with the Autocomplete form component.
   * The country name is used as the predicate term and the complete data set is returned as data.
   * @returns {AutocompleteEmitCountryData[]}
   * An array of objects suitable for use with the Autocomplete form component.
   */
  generateAutocompleteData(): AutocompleteEmitCountryData[] {
    const payload = [];
    for (let i = 0; i < COUNTRY_DATA.length; i++) {
      const item: AutocompleteEmitCountryData = {
        term: null,
        data: null,
      };
      item.term = COUNTRY_DATA[i].country_name;
      item.data = {
        country_id: COUNTRY_DATA[i].country_id,
        country_name: COUNTRY_DATA[i].country_name,
        iso_code: COUNTRY_DATA[i].iso_code,
      };
      payload.push(item);
    }
    return payload;
  },
  /**
   * Returns an array of all available country data.
   */
  get getData() {
    return COUNTRY_DATA;
  },
  /**
   * Returns an array of all country IDs in ascending order.
   */
  get getIDs() {
    return COUNTRY_DATA.map((country) => country.country_id);
  },
  /**
   * Returns an array of all country names in alphabetical order.
   */
  get getNames() {
    return COUNTRY_DATA.map((country) => country.country_name);
  },
  /**
   * Returns an array of all country ISO codes.
   * The array is ordered by the alphabetical order of the associated country name,
   * not the ISO code itself.
   */
  get getISOCodes() {
    return COUNTRY_DATA.map((country) => country.iso_code);
  },
};

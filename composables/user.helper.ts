import { CountryData, CountryDataPayload } from "types/schema";
import {
  CountryID,
  CountryName,
  CountryISOCode,
} from "types/unions/schema.country";

export const COUNTRY_DATA: CountryData[] = [
  { country_id: 1, name: "Afghanistan", iso_code: "AF" },
  { country_id: 2, name: "Åland Islands", iso_code: "AX" },
  { country_id: 3, name: "Albania", iso_code: "AL" },
  { country_id: 4, name: "Algeria", iso_code: "DZ" },
  { country_id: 5, name: "American Samoa", iso_code: "AS" },
  { country_id: 6, name: "Andorra", iso_code: "AD" },
  { country_id: 7, name: "Angola", iso_code: "AO" },
  { country_id: 8, name: "Anguilla", iso_code: "AI" },
  { country_id: 9, name: "Antarctica", iso_code: "AQ" },
  { country_id: 10, name: "Antigua and Barbuda", iso_code: "AG" },
  { country_id: 11, name: "Argentina", iso_code: "AR" },
  { country_id: 12, name: "Armenia", iso_code: "AM" },
  { country_id: 13, name: "Aruba", iso_code: "AW" },
  { country_id: 14, name: "Australia", iso_code: "AU" },
  { country_id: 15, name: "Austria", iso_code: "AT" },
  { country_id: 16, name: "Azerbaijan", iso_code: "AZ" },
  { country_id: 17, name: "Bahamas", iso_code: "BS" },
  { country_id: 18, name: "Bahrain", iso_code: "BH" },
  { country_id: 19, name: "Bangladesh", iso_code: "BD" },
  { country_id: 20, name: "Barbados", iso_code: "BB" },
  { country_id: 21, name: "Belarus", iso_code: "BY" },
  { country_id: 22, name: "Belgium", iso_code: "BE" },
  { country_id: 23, name: "Belize", iso_code: "BZ" },
  { country_id: 24, name: "Benin", iso_code: "BJ" },
  { country_id: 25, name: "Bermuda", iso_code: "BM" },
  { country_id: 26, name: "Bhutan", iso_code: "BT" },
  { country_id: 27, name: "Bolivia", iso_code: "BO" },
  { country_id: 28, name: "Bonaire, Sint Eustatius and Saba", iso_code: "BQ" },
  { country_id: 29, name: "Bosnia and Herzegovina", iso_code: "BA" },
  { country_id: 30, name: "Botswana", iso_code: "BW" },
  { country_id: 31, name: "Bouvet Island", iso_code: "BV" },
  { country_id: 32, name: "Brazil", iso_code: "BR" },
  { country_id: 33, name: "British Indian Ocean Territory", iso_code: "IO" },
  { country_id: 34, name: "Brunei Darussalam", iso_code: "BN" },
  { country_id: 35, name: "Bulgaria", iso_code: "BG" },
  { country_id: 36, name: "Burkina Faso", iso_code: "BF" },
  { country_id: 37, name: "Burundi", iso_code: "BI" },
  { country_id: 38, name: "Cambodia", iso_code: "KH" },
  { country_id: 39, name: "Cameroon", iso_code: "CM" },
  { country_id: 40, name: "Canada", iso_code: "CA" },
  { country_id: 41, name: "Cape Verde", iso_code: "CV" },
  { country_id: 42, name: "Cayman Islands", iso_code: "KY" },
  { country_id: 43, name: "Central African Republic", iso_code: "CF" },
  { country_id: 44, name: "Chad", iso_code: "TD" },
  { country_id: 45, name: "Chile", iso_code: "CL" },
  { country_id: 46, name: "China", iso_code: "CN" },
  { country_id: 47, name: "Christmas Island", iso_code: "CX" },
  { country_id: 48, name: "Cocos (Keeling) Islands", iso_code: "CC" },
  { country_id: 49, name: "Colombia", iso_code: "CO" },
  { country_id: 50, name: "Comoros", iso_code: "KM" },
  { country_id: 51, name: "Congo", iso_code: "CG" },
  {
    country_id: 52,
    name: "Congo, the Democratic Republic of the",
    iso_code: "CD",
  },
  { country_id: 53, name: "Cook Islands", iso_code: "CK" },
  { country_id: 54, name: "Costa Rica", iso_code: "CR" },
  { country_id: 55, name: "Cote DIvoire", iso_code: "CI" },
  { country_id: 56, name: "Croatia", iso_code: "HR" },
  { country_id: 57, name: "Cuba", iso_code: "CU" },
  { country_id: 58, name: "Curaçao", iso_code: "CW" },
  { country_id: 59, name: "Cyprus", iso_code: "CY" },
  { country_id: 60, name: "Czech Republic", iso_code: "CZ" },
  { country_id: 61, name: "Denmark", iso_code: "DK" },
  { country_id: 62, name: "Djibouti", iso_code: "DJ" },
  { country_id: 63, name: "Dominica", iso_code: "DM" },
  { country_id: 64, name: "Dominican Republic", iso_code: "DO" },
  { country_id: 65, name: "Ecuador", iso_code: "EC" },
  { country_id: 66, name: "Egypt", iso_code: "EG" },
  { country_id: 67, name: "El Salvador", iso_code: "SV" },
  { country_id: 68, name: "Equatorial Guinea", iso_code: "GQ" },
  { country_id: 69, name: "Eritrea", iso_code: "ER" },
  { country_id: 70, name: "Estonia", iso_code: "EE" },
  { country_id: 71, name: "Ethiopia", iso_code: "ET" },
  { country_id: 72, name: "Falkland Islands (Malvinas)", iso_code: "FK" },
  { country_id: 73, name: "Faroe Islands", iso_code: "FO" },
  { country_id: 74, name: "Fiji", iso_code: "FJ" },
  { country_id: 75, name: "Finland", iso_code: "FI" },
  { country_id: 76, name: "France", iso_code: "FR" },
  { country_id: 77, name: "French Guiana", iso_code: "GF" },
  { country_id: 78, name: "French Polynesia", iso_code: "PF" },
  { country_id: 79, name: "French Southern Territories", iso_code: "TF" },
  { country_id: 80, name: "Gabon", iso_code: "GA" },
  { country_id: 81, name: "Gambia", iso_code: "GM" },
  { country_id: 82, name: "Georgia", iso_code: "GE" },
  { country_id: 83, name: "Germany", iso_code: "DE" },
  { country_id: 84, name: "Ghana", iso_code: "GH" },
  { country_id: 85, name: "Gibraltar", iso_code: "GI" },
  { country_id: 86, name: "Greece", iso_code: "GR" },
  { country_id: 87, name: "Greenland", iso_code: "GL" },
  { country_id: 88, name: "Grenada", iso_code: "GD" },
  { country_id: 89, name: "Guadeloupe", iso_code: "GP" },
  { country_id: 90, name: "Guam", iso_code: "GU" },
  { country_id: 91, name: "Guatemala", iso_code: "GT" },
  { country_id: 92, name: "Guernsey", iso_code: "GG" },
  { country_id: 93, name: "Guinea", iso_code: "GN" },
  { country_id: 94, name: "Guinea-Bissau", iso_code: "GW" },
  { country_id: 95, name: "Guyana", iso_code: "GY" },
  { country_id: 96, name: "Haiti", iso_code: "HT" },
  { country_id: 97, name: "Heard Island and Mcdonald Islands", iso_code: "HM" },
  { country_id: 98, name: "Holy See (Vatican City State)", iso_code: "VA" },
  { country_id: 99, name: "Honduras", iso_code: "HN" },
  { country_id: 100, name: "Hong Kong", iso_code: "HK" },
  { country_id: 101, name: "Hungary", iso_code: "HU" },
  { country_id: 102, name: "Iceland", iso_code: "IS" },
  { country_id: 103, name: "India", iso_code: "IN" },
  { country_id: 104, name: "Indonesia", iso_code: "ID" },
  { country_id: 105, name: "Iran, Islamic Republic of", iso_code: "IR" },
  { country_id: 106, name: "Iraq", iso_code: "IQ" },
  { country_id: 107, name: "Ireland", iso_code: "IE" },
  { country_id: 108, name: "Isle of Man", iso_code: "IM" },
  { country_id: 109, name: "Israel", iso_code: "IL" },
  { country_id: 110, name: "Italy", iso_code: "IT" },
  { country_id: 111, name: "Jamaica", iso_code: "JM" },
  { country_id: 112, name: "Japan", iso_code: "JP" },
  { country_id: 113, name: "Jersey", iso_code: "JE" },
  { country_id: 114, name: "Jordan", iso_code: "JO" },
  { country_id: 115, name: "Kazakhstan", iso_code: "KZ" },
  { country_id: 116, name: "Kenya", iso_code: "KE" },
  { country_id: 117, name: "Kiribati", iso_code: "KI" },
  {
    country_id: 118,
    name: "Korea, Democratic People's Republic of",
    iso_code: "KP",
  },
  { country_id: 119, name: "Korea, Republic of", iso_code: "KR" },
  { country_id: 120, name: "Kuwait", iso_code: "KW" },
  { country_id: 121, name: "Kyrgyzstan", iso_code: "KG" },
  { country_id: 122, name: "Lao People's Democratic Republic", iso_code: "LA" },
  { country_id: 123, name: "Latvia", iso_code: "LV" },
  { country_id: 124, name: "Lebanon", iso_code: "LB" },
  { country_id: 125, name: "Lesotho", iso_code: "LS" },
  { country_id: 126, name: "Liberia", iso_code: "LR" },
  { country_id: 127, name: "Libya", iso_code: "LY" },
  { country_id: 128, name: "Liechtenstein", iso_code: "LI" },
  { country_id: 129, name: "Lithuania", iso_code: "LT" },
  { country_id: 130, name: "Luxembourg", iso_code: "LU" },
  { country_id: 131, name: "Macao", iso_code: "MO" },
  {
    country_id: 132,
    name: "Macedonia, the Former Yugoslav Republic of",
    iso_code: "MK",
  },
  { country_id: 133, name: "Madagascar", iso_code: "MG" },
  { country_id: 134, name: "Malawi", iso_code: "MW" },
  { country_id: 135, name: "Malaysia", iso_code: "MY" },
  { country_id: 136, name: "Maldives", iso_code: "MV" },
  { country_id: 137, name: "Mali", iso_code: "ML" },
  { country_id: 138, name: "Malta", iso_code: "MT" },
  { country_id: 139, name: "Marshall Islands", iso_code: "MH" },
  { country_id: 140, name: "Martinique", iso_code: "MQ" },
  { country_id: 141, name: "Mauritania", iso_code: "MR" },
  { country_id: 142, name: "Mauritius", iso_code: "MU" },
  { country_id: 143, name: "Mayotte", iso_code: "YT" },
  { country_id: 144, name: "Mexico", iso_code: "MX" },
  { country_id: 145, name: "Micronesia, Federated States of", iso_code: "FM" },
  { country_id: 146, name: "Moldova, Republic of", iso_code: "MD" },
  { country_id: 147, name: "Monaco", iso_code: "MC" },
  { country_id: 148, name: "Mongolia", iso_code: "MN" },
  { country_id: 149, name: "Montenegro", iso_code: "ME" },
  { country_id: 150, name: "Montserrat", iso_code: "MS" },
  { country_id: 151, name: "Morocco", iso_code: "MA" },
  { country_id: 152, name: "Mozambique", iso_code: "MZ" },
  { country_id: 153, name: "Myanmar", iso_code: "MM" },
  { country_id: 154, name: "Namibia", iso_code: "NA" },
  { country_id: 155, name: "Nauru", iso_code: "NR" },
  { country_id: 156, name: "Nepal", iso_code: "NP" },
  { country_id: 157, name: "Netherlands", iso_code: "NL" },
  { country_id: 158, name: "New Caledonia", iso_code: "NC" },
  { country_id: 159, name: "New Zealand", iso_code: "NZ" },
  { country_id: 160, name: "Nicaragua", iso_code: "NI" },
  { country_id: 161, name: "Niger", iso_code: "NE" },
  { country_id: 162, name: "Nigeria", iso_code: "NG" },
  { country_id: 163, name: "Niue", iso_code: "NU" },
  { country_id: 164, name: "Norfolk Island", iso_code: "NF" },
  { country_id: 165, name: "Northern Mariana Islands", iso_code: "MP" },
  { country_id: 166, name: "Norway", iso_code: "NO" },
  { country_id: 167, name: "Oman", iso_code: "OM" },
  { country_id: 168, name: "Pakistan", iso_code: "PK" },
  { country_id: 169, name: "Palau", iso_code: "PW" },
  { country_id: 170, name: "Palestine, State of", iso_code: "PS" },
  { country_id: 171, name: "Panama", iso_code: "PA" },
  { country_id: 172, name: "Papua New Guinea", iso_code: "PG" },
  { country_id: 173, name: "Paraguay", iso_code: "PY" },
  { country_id: 174, name: "Peru", iso_code: "PE" },
  { country_id: 175, name: "Philippines", iso_code: "PH" },
  { country_id: 176, name: "Pitcairn", iso_code: "PN" },
  { country_id: 177, name: "Poland", iso_code: "PL" },
  { country_id: 178, name: "Portugal", iso_code: "PT" },
  { country_id: 179, name: "Puerto Rico", iso_code: "PR" },
  { country_id: 180, name: "Qatar", iso_code: "QA" },
  { country_id: 181, name: "Reunion", iso_code: "RE" },
  { country_id: 182, name: "Romania", iso_code: "RO" },
  { country_id: 183, name: "Russian Federation", iso_code: "RU" },
  { country_id: 184, name: "Rwanda", iso_code: "RW" },
  { country_id: 185, name: "Saint Barthélemy", iso_code: "BL" },
  {
    country_id: 186,
    name: "Saint Helena, Ascension and Tristan da Cunha",
    iso_code: "SH",
  },
  { country_id: 187, name: "Saint Kitts and Nevis", iso_code: "KN" },
  { country_id: 188, name: "Saint Lucia", iso_code: "LC" },
  { country_id: 189, name: "Saint Martin (French part)", iso_code: "MF" },
  { country_id: 190, name: "Saint Pierre and Miquelon", iso_code: "PM" },
  { country_id: 191, name: "Saint Vincent and the Grenadines", iso_code: "VC" },
  { country_id: 192, name: "Samoa", iso_code: "WS" },
  { country_id: 193, name: "San Marino", iso_code: "SM" },
  { country_id: 194, name: "Sao Tome and Principe", iso_code: "ST" },
  { country_id: 195, name: "Saudi Arabia", iso_code: "SA" },
  { country_id: 196, name: "Senegal", iso_code: "SN" },
  { country_id: 197, name: "Serbia", iso_code: "RS" },
  { country_id: 198, name: "Seychelles", iso_code: "SC" },
  { country_id: 199, name: "Sierra Leone", iso_code: "SL" },
  { country_id: 200, name: "Singapore", iso_code: "SG" },
  { country_id: 201, name: "Sint Maarten (Dutch part)", iso_code: "SX" },
  { country_id: 202, name: "Slovakia", iso_code: "SK" },
  { country_id: 203, name: "Slovenia", iso_code: "SI" },
  { country_id: 204, name: "Solomon Islands", iso_code: "SB" },
  { country_id: 205, name: "Somalia", iso_code: "SO" },
  { country_id: 206, name: "South Africa", iso_code: "ZA" },
  {
    country_id: 207,
    name: "South Georgia and the South Sandwich Islands",
    iso_code: "GS",
  },
  { country_id: 208, name: "South Sudan", iso_code: "SS" },
  { country_id: 209, name: "Spain", iso_code: "ES" },
  { country_id: 210, name: "Sri Lanka", iso_code: "LK" },
  { country_id: 211, name: "Sudan", iso_code: "SD" },
  { country_id: 212, name: "Suriname", iso_code: "SR" },
  { country_id: 213, name: "Svalbard and Jan Mayen", iso_code: "SJ" },
  { country_id: 214, name: "Swaziland", iso_code: "SZ" },
  { country_id: 215, name: "Sweden", iso_code: "SE" },
  { country_id: 216, name: "Switzerland", iso_code: "CH" },
  { country_id: 217, name: "Syrian Arab Republic", iso_code: "SY" },
  { country_id: 218, name: "Taiwan (Province of China)", iso_code: "TW" },
  { country_id: 219, name: "Tajikistan", iso_code: "TJ" },
  { country_id: 220, name: "Tanzania, United Republic of", iso_code: "TZ" },
  { country_id: 221, name: "Thailand", iso_code: "TH" },
  { country_id: 222, name: "Timor-Leste", iso_code: "TL" },
  { country_id: 223, name: "Togo", iso_code: "TG" },
  { country_id: 224, name: "Tokelau", iso_code: "TK" },
  { country_id: 225, name: "Tonga", iso_code: "TO" },
  { country_id: 226, name: "Trinidad and Tobago", iso_code: "TT" },
  { country_id: 227, name: "Tunisia", iso_code: "TN" },
  { country_id: 228, name: "Turkey", iso_code: "TR" },
  { country_id: 229, name: "Turkmenistan", iso_code: "TM" },
  { country_id: 230, name: "Turks and Caicos Islands", iso_code: "TC" },
  { country_id: 231, name: "Tuvalu", iso_code: "TV" },
  { country_id: 232, name: "Uganda", iso_code: "UG" },
  { country_id: 233, name: "Ukraine", iso_code: "UA" },
  { country_id: 234, name: "United Arab Emirates", iso_code: "AE" },
  { country_id: 235, name: "United Kingdom", iso_code: "GB" },
  { country_id: 236, name: "United States", iso_code: "US" },
  {
    country_id: 237,
    name: "United States Minor Outlying Islands",
    iso_code: "UM",
  },
  { country_id: 238, name: "Uruguay", iso_code: "UY" },
  { country_id: 239, name: "Uzbekistan", iso_code: "UZ" },
  { country_id: 240, name: "Vanuatu", iso_code: "VU" },
  { country_id: 241, name: "Venezuela", iso_code: "VE" },
  { country_id: 242, name: "Viet Nam", iso_code: "VN" },
  { country_id: 243, name: "Virgin Islands (British)", iso_code: "VG" },
  { country_id: 244, name: "Virgin Islands (U.S.)", iso_code: "VI" },
  { country_id: 245, name: "Wallis and Futuna", iso_code: "WF" },
  { country_id: 246, name: "Western Sahara", iso_code: "EH" },
  { country_id: 247, name: "Yemen", iso_code: "YE" },
  { country_id: 248, name: "Zambia", iso_code: "ZM" },
  { country_id: 249, name: "Zimbabwe", iso_code: "ZW" },
];

const payload: CountryDataPayload = {
  country_id: null,
  name: null,
  iso_code: null,
};

export const countryData = {
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
        payload.name = COUNTRY_DATA[mid].name;
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
  searchByName: (predicate: CountryName) => {
    let start = 0;
    let end = COUNTRY_DATA.length - 1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      if (COUNTRY_DATA[mid].name === predicate) {
        payload.country_id = COUNTRY_DATA[mid].country_id;
        payload.name = predicate;
        payload.iso_code = COUNTRY_DATA[mid].iso_code;
        return payload;
      } else if (COUNTRY_DATA[mid].name < predicate) {
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
        payload.name = data[mid].name;
        payload.iso_code = predicate;
        return payload;
      } else if (data[mid].name < predicate) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    return payload;
  },
};

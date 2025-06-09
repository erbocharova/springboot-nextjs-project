"use client";
import React from "react";

const countryCodeMap = {
  "+7": "🇷🇺 +7",
  "+1": "🇺🇸 +1",
  "+44": "🇬🇧 +44",
  "+49": "🇩🇪 +49",
  "+33": "🇫🇷 +33",
  "+39": "🇮🇹 +39",
  "+81": "🇯🇵 +81",
  "+86": "🇨🇳 +86",
  "+61": "🇦🇺 +61",
  "+55": "🇧🇷 +55",
  "+27": "🇿🇦 +27",
  "+34": "🇪🇸 +34",
  "+31": "🇳🇱 +31",
  "+46": "🇸🇪 +46",
  "+41": "🇨🇭 +41",
  "+380": "🇺🇦 +380",
};

const CountryCodeSelect = ({ value, onChange }) => {
  return (
    <select className="field__country" name="phoneCountry" value={value} onChange={onChange}>
      {Object.values(countryCodeMap).map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
};

export { countryCodeMap };
export default CountryCodeSelect;

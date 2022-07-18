

import { countries } from "../models/countries";

import { Select, SelectProps } from "./input";

export function CountrySelect(props: SelectProps) {
  return (
    <Select {...props}>
      {countries.map(c => (
        <option key={c.id} value={c.id}>{c.countryName}</option>
      ))}
    </Select>
  )
}

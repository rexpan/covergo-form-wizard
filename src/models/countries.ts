
export interface ICountry { id:string, countryName:string, currencyCode:string, rate: number }

export const countries:ICountry[] = [
  { id:'HKD', countryName:"Hong Kong", currencyCode:"HKD", rate:1 },
  { id:'USD', countryName:"USA"      , currencyCode:"USD", rate:2 },
  { id:'AUD', countryName:"AUD"      , currencyCode:"AUD", rate:3 },
];

export const mCountry = new Map(countries.map(c => [c.id, c]));

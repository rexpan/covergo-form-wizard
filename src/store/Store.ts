import { observable, computed, action, makeObservable } from 'mobx';

import { mCountry, countries } from "../models/countries";
import { mPackage, packages } from "../models/packages";

import { ShouldClearFieldsWhenReset } from "../config";

export type Page = 1|2|2.5|3;

export class Store {
  constructor() {
    makeObservable(this, {
      name           : observable, setName     : action.bound,
      age            : observable, setAge      : action.bound,
      countryId      : observable, setCountryId: action.bound,
      packageId      : observable, setPackageId: action.bound,
      page           : observable,
      country        : computed,
      package        : computed,
      standardPremium: computed,
      packages       : computed,
      premium        : computed,
      currencyFormat : computed,
      restart        : action.bound,
      buy            : action.bound,
      goBack         : action.bound,
      goNext         : action.bound,
    });
  }

  name       = ""   ; setName(v: string) { this.name = v }
  age        = 50   ; setAge (v: number) { this.age  = v }
  countryId  = "HKD"; setCountryId(id: string) { this.countryId = id; }
  packageId  = "sd" ; setPackageId(id: string) { this.packageId = id; }
  page: Page = 2    ;

  get country() { return mCountry.get(this.countryId) ?? countries[0] }
  get package() { return mPackage.get(this.packageId) ?? packages [0] }

  get standardPremium() { return (10 * this.age * this.country.rate); }
  get packages() { return packages.map(p => ({ ...p, addPrice:this.standardPremium *  p.addRatio })) }
  get premium() { return this.standardPremium * (1 + this.package.addRatio) }

  get currencyFormat() { return new Intl.NumberFormat(undefined, { style: 'currency', currency: this.country.currencyCode }); }

  restart() {
    this.page = 1;
    if (ShouldClearFieldsWhenReset) {
      this.name = "";
      this.age = 50;
      this.countryId = "HKD";
      this.packageId = "sd";
    }
  }
  submit() {
    // validate input
    if (100 < this.age) { this.page = 2.5; return; }

    // if everything ok
    this.goNext();
  }
  buy() {
    // send buy request with to server
    // if success, restart
    this.restart();
  }

  goBack() { this.page = (this.page - 1) as Page; }
  goNext() { this.page = (this.page + 1) as Page; }
}

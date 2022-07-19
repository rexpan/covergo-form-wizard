import { describe, expect, it, test } from 'vitest';
import { Store } from './Store';
import { ShouldClearFieldsWhenReset } from "../config";

function setup() {
    const store = new Store;
    return { store };
}

describe('Store', () => {
  it('should init without crash', () => {
    const { store } = setup();
    expectStoreInitField(store);
  });

  it('should navigate', () => {
    const { store } = setup();

    store.goNext();
    expect(store.page).equals(2);
  });

  it('should be able to update country', () => {
    const { store } = setup();

    expect(store.country.id).equals(store.countryId, "Store.country should match wit Store.countryId");

    store.setCountryId('HKD');
    expect(store.countryId).equals('HKD');

    store.setCountryId('USA');
    expect(store.countryId).equals('USA');

    store.setCountryId('AUD');
    expect(store.countryId).equals('AUD');

    store.setCountryId('invalid');
    expect(store.countryId).equals('invalid');
    expect(store.country.id).equals('HKD', "when invalid country id, fallback to Hong Kong");
  });

  it('should be able to update package', () => {
    const { store } = setup();

    expect(store.package.id).equals(store.packageId, "Store.package should match wit Store.packageId");

    store.setPackageId('sf');
    expect(store.packageId).equals('sf', "should be able to update to package Safe");

    store.setPackageId('ss');
    expect(store.packageId).equals('ss', "should be able to update to package Super Safe");

    store.setPackageId('sd');
    expect(store.packageId).equals('sd', "should be able to update to package Standard");

    store.setPackageId('invalid');
    expect(store.packageId).equals('invalid');
    expect(store.package.id).equals('sd', "when invalid package id, fallback to package Standard");
  });

  it('should require name when submit', () => {
    const { store } = setup();

    expect(store.page).equals(1);
    store.goNext();
    expect(store.page).equals(2, "should be able to go to Page 2");
    store.setName("");
    expect(store.name).equals("");
    store.submit();
    expect(store.page).equals(2, "should stay on Page 2 when name is empty");
  });

  it('should be able to submit if user input name', () => {
    const { store } = setup();

    expect(store.page).equals(1);
    store.goNext();
    expect(store.page).equals(2);
    store.setName("A");
    store.submit();
    expect(store.page).equals(3, "should continue to Page 3");
  });

  it('should navigate to error if age > 100', () => {
    const { store } = setup();

    store.setName("A")
    store.setAge(101);
    store.submit();
    expect(store.page).equals(2.5, "should direct to Page 2 error");
  });

  it.each([
    [750, 'sf'],
    [875, 'ss'],
    [500, 'sd'],
  ])('Premium should be %d when package is %s', (premium, packageId) => {
    const { store } = setup();

    store.setAge(50);
    store.setCountryId('HKD');
    expect(store.standardPremium).equals(500)

    store.setPackageId(packageId);
    expect(store.premium).equals(premium);
  });

  it('should be able to buy', () => {
    const { store } = setup();

    expect(store.page).equals(1);
    store.goNext();
    expect(store.page).equals(2);
    store.setName("A");
    store.submit();
    expect(store.page).equals(3);
    store.buy();
    expect(store.page).equals(1, "After user buy, should go back to Page 1");
    if (ShouldClearFieldsWhenReset) expectStoreInitField(store);
  });

  it('should be able to restart', () => {
    const { store } = setup();

    expect(store.page).equals(1);
    store.goNext();
    expect(store.page).equals(2);
    store.setName("A");
    store.setAge(101);
    store.submit();
    expect(store.page).equals(2.5);
    store.restart();
    expect(store.page).equals(1, "After user restart, should go back to Page 1");
    if (ShouldClearFieldsWhenReset) expectStoreInitField(store);
  });
});

function expectStoreInitField(store:Store) {
  expect(store.page).equals(1);
  expect(store.name).equals("", "name should be clear");
  expect(store.age).equals(50, "age should be reset to 50");
  expect(store.countryId).equals("HKD", "country should be reset to Hong Kong");
  expect(store.packageId).equals("sd", "package should be reset to Standard");
}

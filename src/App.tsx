import { ChangeEvent, FormEvent, HTMLProps, ReactNode, useCallback, useRef } from 'react';
import { observable, computed, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

interface ICountry { id:string, countryName:string, currencyCode:string, rate: number }
const countries:ICountry[] = [
  { id:'HKD', countryName:"Hong Kong", currencyCode:"HKD", rate:1 },
  { id:'USD', countryName:"USA"      , currencyCode:"USD", rate:2 },
  { id:'AUD', countryName:"AUD"      , currencyCode:"AUD", rate:3 },
];
const mCountry = new Map(countries.map(c => [c.id, c]));

const packages = [
  { id:"sd", packageName:"Standard"  , addRatio:0, },
  { id:"sf", packageName:"Safe"      , addRatio:.5 },
  { id:"ss", packageName:"Super Safe", addRatio:.75},
];
const mPackage = new Map(packages.map(p => [p.id, p]));

type Page = 1|2|2.5|3;

const ShouldClearFieldsWhenReset = true;

class Store {
  constructor() {
    makeObservable(this, {
      name           : observable, setName     : action.bound,
      age            : observable, setAge      : action.bound,
      countryId      : observable, setCountryId: action.bound,
      packageId      : observable, setPackageId: action.bound,
      page           : observable,
      country        : computed,
      package        : computed,
      currencyCode   : computed,
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
  page: Page = 1    ;

  get country() { return mCountry.get(this.countryId) ?? countries[0] }
  get package() { return mPackage.get(this.packageId) ?? packages [0] }

  get currencyCode() { return this.country.currencyCode }
  get standardPremium() { return (10 * this.age * this.country.rate); }
  get packages() { return packages.map(p => ({ ...p, addPrice:this.standardPremium *  p.addRatio })) }
  get premium() { return this.standardPremium * (1 + this.package.addRatio) }

  get currencyFormat() { return new Intl.NumberFormat(undefined, { style: 'currency', currency: store.currencyCode }); }

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
// @ts-ignore
const store = window.store = new Store;

const percentFormat = new Intl.NumberFormat(undefined, { style: 'percent' });

const Page1 = observer<{}>(function Page1() {
  return (
    <PageCard title="Hello There!">
      <p>Let's buy some insurance. It is going to take only a few steps</p>
      <Button buttonType="primary" onClick={() => store.goNext()}>Start</Button>
    </PageCard>
  );
});
const Page2 = observer<{}>(function Page2() {
  const onSubmit = useCallback((event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    store.submit();
  }, []);

  return (
    <PageCard title="Tell us about yourself">
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <Input value={store.name} onChange={store.setName} required placeholder="Add text"/>

        <label>Age</label>
        <NumberInput type="number" value={store.age} onChange={store.setAge} />

        <label>Where do you live</label>
        <CountrySelect value={store.countryId} onChange={store.setCountryId} />

        {store.packages.map(p => (<label>
          <input type="radio" name="package" value={p.id} checked={store.packageId == p.id} onChange={e => store.packageId = e.target.value} />
          {p.packageName}
          {(p.addPrice > 0) && (<>
            (+{store.currencyFormat.format(p.addPrice)}{store.currencyCode}, {percentFormat.format(p.addRatio)})
          </>)}
        </label>))}

        <h2>Your premium is: {store.currencyFormat.format(store.premium)}</h2>

        <Button buttonType="secondary" onClick={() => store.goBack()}>Back</Button>
        <Button buttonType="primary"   type="submit">Next</Button>
      </form>
    </PageCard>
  );
});
const Page2Error = observer<{}>(function Page2Error() {
  return (
    <PageCard title="Ooops">
      Your age is over our accepted limit.
      We are sorry but we cannnot insure you now

      <Button buttonType="primary" onClick={() => store.restart()}>Ok {":("}</Button>
    </PageCard>
  );
});
const Page3 = observer<{}>(function Page3() {
  return (
    <PageCard title="Summary">
      {store.name},

      Name: {store.name}
      Age: {store.age}
      Where do you live: {store.country.countryName}
      Package: {store.package.packageName}
      Premium: {store.premium}{store.currencyCode}

      <Button buttonType="secondary" onClick={() => store.goBack()}>Back</Button>
      <Button buttonType="primary" onClick={() => store.buy()}>Buy</Button>
    </PageCard>
  );
});
const Page404 = observer<{}>(function Page404() {
  return (
    <PageCard title="Ooops">
      Something went wrong.

      <Button buttonType="primary" onClick={() => store.restart()}>Ok {":("}</Button>
    </PageCard>
  );
});


const App = observer<{}>(function App() {
  return (
    <div>
      {store.page == 1 ? (<Page1 />) :
      (store.page == 2) ? (<Page2 />) :
      (store.page == 2.5) ? (<Page2Error />) :
      (store.page == 3) ? (<Page3 />) :
      (<Page404 />)}
    </div>
  );
});
export default App;

function PageCard({ title, children }: { title:ReactNode, children?:ReactNode }) {
  return (
    <div>
        <h1>{title}</h1>

        {children}
      </div>
  )
}

type ButtonType = "primary"|"secondary";

interface ButtontProps extends HTMLProps<HTMLButtonElement> {
  buttonType:ButtonType,
}
function Button(props: ButtontProps) {
  return (
    <button {...props} />
  )
}

interface InputProps extends Omit<HTMLProps<HTMLInputElement>,"onChange"> {
  onChange?: (value:string) => void;
}
function Input(props: InputProps) {
  const rProps = useRef(props); rProps.current = props;
  const onChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
    rProps.current.onChange?.(event.target.value);
  }, []);
  return (
    <input {...props} onChange={onChange} />
  )
}

interface NumberInputProps extends Omit<HTMLProps<HTMLInputElement>,"onChange"> {
  onChange?: (value:number) => void;
}
function NumberInput(props: NumberInputProps) {
  const rProps = useRef(props); rProps.current = props;
  const onChange = useCallback((event:ChangeEvent<HTMLInputElement>) => {
    rProps.current.onChange?.(event.target.valueAsNumber);
  }, []);
  return (
    <input type="number" {...props} onChange={onChange} />
  )
}

interface SelectProps extends Omit<HTMLProps<HTMLSelectElement>,"onChange"> {
  onChange?: (value:string) => void;
}
function Select(props: SelectProps) {
  const rProps = useRef(props); rProps.current = props;
  return (
    <select {...props} onChange={(event) => { rProps.current.onChange?.(event.target.value) }} />
  )
}

function CountrySelect(props: SelectProps) {
  return (
    <Select {...props}>
      {countries.map(c => (
        <option key={c.id} value={c.id}>{c.countryName}</option>
      ))}
    </Select>
  )
}

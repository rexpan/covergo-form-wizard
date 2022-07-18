import { ChangeEvent, FormEvent, HTMLProps, ReactNode, useCallback, useRef, useState } from 'react';
import { observable, computed, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { nanoid } from "nanoid";

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
// @ts-ignore
const store = window.store = new Store;

const percentFormat = new Intl.NumberFormat(undefined, { style: 'percent' });

const Page1 = observer<{}>(function Page1() {
  return (
    <PageCard title="Hello There!">
      <p className="pt-6 md:p-8 text-center space-y-4">Let's buy some insurance. It is going to take only a few steps</p>
      <ButtonGroup>
        <Button buttonType="primary" onClick={() => store.goNext()}>Start</Button>
      </ButtonGroup>
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
      <form onSubmit={onSubmit} className="">
        <div className="mt-4 space-y-4">
          <FormItem label="Name" htmlFor="name" input={(
            <Input name="name" value={store.name} onChange={store.setName} required
              placeholder="Add text" className="w-full" />
          )} />
        </div>

        <div className="mt-4 space-y-4">
          <FormItem label="Age" htmlFor="age" input={(
            <NumberInput type="number" value={store.age} onChange={store.setAge} className="w-full" />
          )} />
        </div>

        <div className="mt-4 space-y-4">
          <FormItem label="Where do you live" htmlFor="country" input={(
            <CountrySelect value={store.countryId} onChange={store.setCountryId} />
          )} />
        </div>

        <div className="mt-4 space-y-4">
          <RadioGroup value={store.packageId} onChange={store.setPackageId} options={
            store.packages.map(p => ({ value:p.id, label:(<>
              {p.packageName}
              {(p.addPrice > 0) && (<>
                {" (+"}{store.currencyFormat.format(p.addPrice)}, {percentFormat.format(p.addRatio)}{")"}
              </>)}
            </>) }))}
          />
        </div>

        <h2 className="text-lg font-medium mt-8">
          Your premium is: {store.currencyFormat.format(store.premium)}
        </h2>

        <ButtonGroup className="mt-8">
          <Button buttonType="secondary" onClick={() => store.goBack()}>Back</Button>
          <Button buttonType="primary"   type="submit">Next</Button>
        </ButtonGroup>
      </form>
    </PageCard>
  );
});

function ButtonGroup({ className, children }: { className?: string, children: ReactNode }) {
  return (
    <div className={"flex flex-row justify-center items-center "+ className}>
      <div className="flex gap-4">
        {children}
      </div>
    </div>
  )
}

const Page2Error = observer<{}>(function Page2Error() {
  return (
    <PageCard title="Ooops">
      <div className="text-center">
        <p>Your age is over our accepted limit.</p>
        <p>We are sorry but we cannnot insure you now</p>
      </div>

      <ButtonGroup className="mt-8">
        <Button buttonType="primary" onClick={store.restart}>Ok {":("}</Button>
      </ButtonGroup>
    </PageCard>
  );
});
const Page3 = observer<{}>(function Page3() {
  return (
    <PageCard title="Summary">
      <p className="text-center text-lg font-medium">{store.name},</p>


      <ul className="text-center my-8">
        <li className="my-4">Name: {store.name}</li>
        <li className="my-4">Age: {store.age}</li>
        <li className="my-4">Where do you live: {store.country.countryName}</li>
        <li className="my-4">Package: {store.package.packageName}</li>
        <li className="my-4">Premium: {store.currencyFormat.format(store.premium)}</li>
      </ul>

      <ButtonGroup>
        <Button buttonType="secondary" onClick={() => store.goBack()}>Back</Button>
        <Button buttonType="primary" onClick={() => store.buy()}>Buy</Button>
      </ButtonGroup>
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
    <div className="grid h-screen place-items-center">
      <div className="mt-4 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-900/5 rounded-xl p-8 w-1/2 sm:w-full md:w-1/2 ">
        <div className="pt-6 md:p-8 text-center space-y-4">
          <h1 className="text-xl font-medium">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  )
}

type ButtonType = "primary"|"secondary";

interface ButtontProps extends HTMLProps<HTMLButtonElement> {
  buttonType:ButtonType,
}
function Button(props: ButtontProps) {
  return (
    <button className={["h-10 px-6 font-semibold rounded-md", props.buttonType ==  "primary" ? "bg-black text-white" : "border border-slate-200 text-slate-900"].join(" ")}
      {...props} />
  );
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
    <input className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" {...props} onChange={onChange} />
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
    <select className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md w-full"
      {...props}
      onChange={(event) => { rProps.current.onChange?.(event.target.value) }}  />
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

function RadioGroup(props: { value:string, onChange:(v:string) => void, options:{ value:string, label:ReactNode }[] }) {
  const rProps = useRef(props); rProps.current = props;
  const { value, options } =  props;
  const [name] = useState(nanoid);
  const onChange = useCallback((event:ChangeEvent<HTMLInputElement>) => { rProps.current.onChange?.(event.target.value); }, []);
  return (
    <fieldset>
      {options.map(o => {
        const id = name+o.value
        return (
          <div className="flex items-center">
            <input type="radio"
              id={id}
              name={name}
              value={o.value}
              checked={value == o.value}
              onChange={onChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-700">
              {o.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  )
}

function FormItem({ label, htmlFor, input }: { label:ReactNode, htmlFor:string, input:ReactNode }) {
  return (
    <>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {input}
      </div>
    </>
  )
}

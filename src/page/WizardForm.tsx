import { FormEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from "../store/StoreContext";

import { Button, ButtonGroup } from "../components/button";
import { FormItem, Input, NumberInput, RadioGroup } from "../components/input";
import { PageCard } from "../components/PageCard";

const percentFormat = new Intl.NumberFormat(undefined, { style: 'percent' });

export const WizardForm = observer<{}>(function WizardForm() {
  const store = useStore();
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

const Page1 = observer<{}>(function Page1() {
  const store = useStore();
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
  const store = useStore();
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

const Page2Error = observer<{}>(function Page2Error() {
  const store = useStore();
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
  const store = useStore();
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
  const store = useStore();
  return (
    <PageCard title="Ooops">
      Something went wrong.

      <Button buttonType="primary" onClick={() => store.restart()}>Ok {":("}</Button>
    </PageCard>
  );
});

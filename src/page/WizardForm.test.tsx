/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi,  } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { WizardForm } from './WizardForm';
import { Store } from "../store/Store";
import { StoreContext } from "../store/StoreContext";

function setup() {
    const store = new Store;
    const wizardForm = render(
        <StoreContext.Provider value={store}>
            <WizardForm />
        </StoreContext.Provider>
    );
    function expectInPage1() { return expect(wizardForm.container.querySelector("h1")?.textContent).equal("Hello There!", "should be in Page 1"); }
    function expectInPage2() { return expect(wizardForm.container.querySelector("h1")?.textContent).equal("Tell us about yourself", "should be in Page 2"); }
    function expectInPage3() { return expect(wizardForm.container.querySelector("h1")?.textContent).equal("Summary", "should be in Page 3"); }
    return { wizardForm, store, expectInPage1, expectInPage2, expectInPage3 };
}

describe('WizardForm', () => {
  it('renders without crashing', () => {
    setup();
  });
  it('should be able to navigate to page 2', () => {
    const { wizardForm, store, expectInPage1, expectInPage2 } = setup();

    const p1StartBtn = wizardForm.container.querySelector('button');
    expect(p1StartBtn).not.null; if (p1StartBtn == null) return;
    fireEvent.click(p1StartBtn);
    expect(store.page).equals(2, "should be able to navigate to page 2");
    expectInPage2();

    const p2BackBtn = wizardForm.container.querySelector('button:not([type="submit"])');
    expect(p2BackBtn).not.null; if (p2BackBtn == null) return;
    fireEvent.click(p2BackBtn);
    expect(store.page).equals(1, "should be able to navigate back to page 1");
    expectInPage1();
  });

  it('should be able to input in page 2', async () => {
    const { wizardForm, store, expectInPage2, expectInPage3 } = setup();

    const p1StartBtn = wizardForm.container.querySelector('button');
    expect(p1StartBtn).not.null; if (p1StartBtn == null) return;
    fireEvent.click(p1StartBtn);

    const p2NextBtn = wizardForm.container.querySelector('button[type="submit"]');
    expect(p2NextBtn).not.null; if (p2NextBtn == null) return;
    await waitFor(() => fireEvent.click(p2NextBtn));
    expect(store.page).equals(2, "should not allow to submit");
    expectInPage2();

    const nameInput = wizardForm.container.querySelector('input[name="name"]');
    expect(nameInput).not.null; if (nameInput == null) return;
    fireEvent.change(nameInput, { target: { value: 'A' } });
    expect(store.name).equals('A', "should binding to store");

    const ageInput = wizardForm.container.querySelector('input[name="age"]');
    expect(ageInput).not.null; if (ageInput == null) return;
    fireEvent.change(ageInput, { target: { value: '60' } });
    expect(store.age).equals(60, "should binding to store");

    const countrySelect = wizardForm.container.querySelector('select');
    expect(countrySelect).not.null; if (countrySelect == null) return;
    fireEvent.change(countrySelect, { target: { value: 'USD' } });
    expect(store.countryId).equals('USD', "should binding to store");

    const premium = await wizardForm.findByText('Your premium is: $1,200.00', { exact:false,  });
    expect(premium.innerText).not.null;

    await waitFor(() => fireEvent.click(p2NextBtn));
    expect(store.page).equals(3, "should allow to submit when user input name");
    expectInPage3();
  });

  it('should navigate to page 2 error if age > 100', async () => {
    const { wizardForm, store, expectInPage1 } = setup();

    const p1StartBtn = wizardForm.container.querySelector('button');
    expect(p1StartBtn).not.null; if (p1StartBtn == null) return;
    fireEvent.click(p1StartBtn);

    const nameInput = wizardForm.container.querySelector('input[name="name"]');
    expect(nameInput).not.null; if (nameInput == null) return;
    fireEvent.change(nameInput, { target: { value: 'A' } });

    const ageInput = wizardForm.container.querySelector('input[name="age"]');
    expect(ageInput).not.null; if (ageInput == null) return;
    fireEvent.change(ageInput, { target: { value: '101' } });
    expect(store.age).equals(101, "should binding to store");

    const p2NextBtn = wizardForm.container.querySelector('button[type="submit"]');
    expect(p2NextBtn).not.null; if (p2NextBtn == null) return;
    await waitFor(() => fireEvent.click(p2NextBtn));
    expect(store.page).equals(2.5, "should go to page 2 error");

    const page2ErrorTitle = await wizardForm.findByText('Ooops');
    expect(page2ErrorTitle).not.null;

    const p2ErrorOkBtn = wizardForm.container.querySelector('button');
    expect(p2ErrorOkBtn).not.null; if (p2ErrorOkBtn == null) return;
    await waitFor(() => fireEvent.click(p2ErrorOkBtn));
    expect(store.page).equals(1, "should reset to page 1");
    expectInPage1();
  });

  it('should be able to navigate to page 3', async () => {
    const { wizardForm, expectInPage1, expectInPage2, expectInPage3 } = setup();

    const p1StartBtn = wizardForm.container.querySelector('button');
    expect(p1StartBtn).not.null; if (p1StartBtn == null) return;
    fireEvent.click(p1StartBtn);

    const nameInput = wizardForm.container.querySelector('input[name="name"]');
    expect(nameInput).not.null; if (nameInput == null) return;
    fireEvent.change(nameInput, { target: { value: 'A' } });

    const p2NextBtn = wizardForm.container.querySelector('button[type="submit"]');
    expect(p2NextBtn).not.null; if (p2NextBtn == null) return;
    await waitFor(() => fireEvent.click(p2NextBtn));

    const p3BackBtn = Array.from(wizardForm.container.querySelectorAll('button')).find(btn => btn.textContent == 'Back');
    expect(p3BackBtn).not.null; if (p3BackBtn == null) return;
    await waitFor(() => fireEvent.click(p3BackBtn));
    expectInPage2();

    const p2NextBtn2 = wizardForm.container.querySelector('button[type="submit"]');
    expect(p2NextBtn2).not.null; if (p2NextBtn2 == null) return;
    fireEvent.click(p2NextBtn2);

    expectInPage3();

    const p3BuyBtn = Array.from(wizardForm.container.querySelectorAll('button')).find(btn => btn.textContent == 'Buy');
    expect(p3BuyBtn).not.null; if (p3BuyBtn == null) return;
    fireEvent.click(p3BuyBtn);
    expectInPage1();
  });
});


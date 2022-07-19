# Solution

To run the project

```sh
npm run dev
```

To run unit test

```sh
npm test
```

## Technical stack

- Use ReactJS with TypeScript and Tailwind
- Frontend tooling: [ViteJS](https://vitejs.dev/)
- Test runner: [Vitest](https://vitest.dev/)
- Testing library: [React Testing library](https://github.com/testing-library/react-testing-library)

## Code organization

- `src/models` includes the data layer of the application: include data model definition.
    In practical application, we may want to have an Data Store layer that manage the data as a single source of truth for our application.
    In this demo, we can simply include in the data layer.

- `src/store` is the Global store of our application.
    In practical application, we may want to have multiple view stores that query to the data stores.
    For this simple demo, the global is also the view store of the Wizard form view.
    
    The store include the business logic of the application -- the Wizard form.
    It include the query for data like get the select `country` or `package` instance,
    calculated the premium of selected options, navigate from step of Wizard, handle user interaction.

- `src/components` include the definition of our basic components in the application like `Button`, `Input` or layout like `ButtonGroup`, `PageCard`.

- `src/page` include the entry views of our app.
    In this demo, we have a single entry which is the `WizardForm`.
    The `WizardForm` view is for display and binding the UI to the view store.
    Simply handle the event and delegate the handling to the store, 
    or may feed back the handled result like display loading state, error message...

- The `Store.test.ts` is the unit test for the `Store.ts` file for testing the business logic includes wizard navigation, premium calculation.
- The `WizardForm.test.ts` is the end-to-end test for the Wizard form, include navigation, input binding...


## Idea for improving

- Push to history stack to allow user navigate back with Back button or gesture. Allow better improving especial for mobile users.
- Add unit test for `src/components`.

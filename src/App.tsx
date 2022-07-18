import { useState } from 'react';

import { Store } from "./store/Store";
import { StoreContext } from "./store/StoreContext";

import { WizardForm } from "./page/WizardForm";

function App() {
  const [store] = useState(() => new Store);
  return (
    <StoreContext.Provider value={store}>
      <WizardForm />
    </StoreContext.Provider>
  );
}

export default App;

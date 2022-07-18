import { createContext, useContext } from "react";
import { Store } from "./Store";

export const StoreContext = createContext<Store>(new Store);
export function useStore() { return useContext(StoreContext); }

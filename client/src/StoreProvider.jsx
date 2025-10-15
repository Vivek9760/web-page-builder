import { createContext, useContext, useMemo, useState } from "react";

const Store = createContext();

const useStore = () => useContext(Store);

const StoreProvider = ({ children }) => {
  const [store, setStore] = useState({
    user: null,
    isAuthenticate: false,
  });

  // Function to update the store
  const updateStore = (newState) => {
    setStore((prevState) => ({ ...prevState, ...newState }));
  };

  const storeValue = useMemo(() => ({ store, updateStore }), [store]);

  return <Store.Provider value={storeValue}>{children}</Store.Provider>;
};

export { useStore, StoreProvider };

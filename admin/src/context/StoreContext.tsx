import axios from "axios";
import React, { ReactNode, useEffect } from "react";
import { createContext } from "react";

interface ContextProviderProps {
  children: ReactNode;
}

interface StoreContextType {
  //Define all the function
  serverUrl: String;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);

const ContextProvider: React.FC<ContextProviderProps> = (props) => {
  const serverUrl = "http://localhost:3000";

  const contextValue: StoreContextType = {
    // Initialize all the function to be passed
    serverUrl,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default ContextProvider;

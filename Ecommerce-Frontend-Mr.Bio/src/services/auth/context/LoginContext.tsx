/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface LoginContextType {
  loginType: "ADMIN" | "USER";
  setLoginType: (type: "ADMIN" | "USER") => void;
}

// Create the context
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Create a provider component
export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loginType, setLoginType] = useState<"ADMIN" | "USER">("USER");

  return (
    <LoginContext.Provider value={{ loginType, setLoginType }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to access the login context
export const useLoginContext = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
};

import React, { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: true,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
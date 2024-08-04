import React, { createContext, ReactNode, useState } from "react";
import { AuthContextValue, User } from "../types/types";

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getToken = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;
  const getUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [token, setToken] = useState<string | null>(getToken);
  const [user, setUser] = useState<User | null>(getUser);
  const handleSetToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleSetUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    handleSetToken,
    handleSetUser,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

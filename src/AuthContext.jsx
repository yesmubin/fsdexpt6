import { createContext, useContext, useMemo, useState } from "react";
import {
  api,
  clearStoredUser,
  clearToken,
  getStoredUser,
  saveToken,
  saveUser,
} from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    saveToken(data.token);
    saveUser(data.user);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    clearToken();
    clearStoredUser();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
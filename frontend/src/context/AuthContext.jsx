import { createContext, useContext, useState } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // userId is persisted via the HttpOnly cookie on the backend.
  // We keep a lightweight copy in state so the UI knows who is logged in.
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId"));

  const login = (userId) => {
    // Token is already stored as an HttpOnly cookie by the server — never touch it here
    sessionStorage.setItem("userId", userId);
    setUserId(userId);
  };

  const logout = async () => {
    try {
      // Ask the server to clear the HttpOnly cookie (the only way to delete it)
      await api.post("/auth/logout");
    } catch (_) {
      // Proceed even if the request fails
    } finally {
      sessionStorage.removeItem("userId");
      setUserId(null);
    }
  };

  const isAuthenticated = Boolean(userId);

  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};

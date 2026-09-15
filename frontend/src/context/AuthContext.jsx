import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          authService.logout();
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (payload) => {
    const u = await authService.login(payload);
    setUser(u);
    return u;
  };

  const register = async (payload) => {
    const u = await authService.register(payload);
    setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    const profile = await authService.getProfile();
    setUser(profile);
    return profile;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

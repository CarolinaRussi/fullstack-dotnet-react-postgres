import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  userType: string;
  loading: boolean; // adiciona loading
}

interface JwtPayloadCustom {
  aud: string;
  email: string;
  iss: string;
  jti: string;
  sub: string;
  userType: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("customer");
  const [loading, setLoading] = useState(true); // estado loading

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayloadCustom>(token);
        setUserType(decoded.userType ?? "customer");
        setIsAuthenticated(true);
      } catch {
        setUserType("customer");
        setIsAuthenticated(false);
      }
    } else {
      setUserType("customer");
      setIsAuthenticated(false);
    }
    setLoading(false); // terminou de checar
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode<JwtPayloadCustom>(token);
      setUserType(decoded.userType ?? "customer");
    } catch {
      setUserType("customer");
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserType("customer");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userType, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};

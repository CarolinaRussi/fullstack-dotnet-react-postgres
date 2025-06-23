import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, name: string) => void;
  logout: () => void;
  userType: string;
  loading: boolean;
  userName: string | null;
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
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

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

    setUserName(storedName ?? null);
    setLoading(false);
  }, []);

  const login = (token: string, name: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    setUserName(name);

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
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserType("customer");
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userType, loading, userName }}
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

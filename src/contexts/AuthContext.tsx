import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  login as svcLogin,
  logout as svcLogout,
  validateToken as svcValidateToken,
  validateRefreshToken as svcValidateRefreshToken,
  sendVerificationEmail as svcSendVerificationEmail,
} from "../services/auth/auth.service";

type User = {
  email?: string;
  firstName?: string;
  lastName?: string;
  userDisplayName?: string;
};

type AuthContextValue = {
  loading: boolean;
  isAuthenticated: boolean;
  emailVerified: boolean;
  user?: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const validation = await svcValidateToken(accessToken);
      if (validation.success) {
        const u = validation.data || validation.data?.user;
        setUser({
          email: u?.email || localStorage.getItem("email") || undefined,
          firstName: u?.firstName || u?.name || undefined,
          lastName: u?.lastName || undefined,
        });
        setIsAuthenticated(true);
        setEmailVerified(Boolean(u?.emailVerified));
        setLoading(false);
        return;
      }

      if (refreshToken) {
        const r = await svcValidateRefreshToken({ refreshToken });
        if (r.success) {
          localStorage.setItem("accessToken", r.data?.accessToken || "");
          localStorage.setItem("refreshToken", r.data?.refreshToken || "");
          const validated = await svcValidateToken(r.data?.accessToken || "");
          if (validated.success) {
            const u = validated.data || validated.data?.user;
            setUser({
              email: u?.email || localStorage.getItem("email") || undefined,
              firstName: u?.firstName || u?.name || undefined,
              lastName: u?.lastName || undefined,
            });
            setIsAuthenticated(true);
            setEmailVerified(Boolean(u?.emailVerified));
            setLoading(false);
            return;
          }
        }
      }

      // not authenticated
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      setEmailVerified(false);
      setLoading(false);
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await svcLogin({ email, password });
    if (resp.success) {
      const data = resp.data;
      if (data?.accessToken)
        localStorage.setItem("accessToken", data.accessToken);
      if (data?.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);
      if (data?.firstName) localStorage.setItem("firstName", data.firstName);
      if (data?.lastName) localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("email", email);
      setUser({
        email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        userDisplayName: data?.userDisplayName,
      });
      setIsAuthenticated(true);
      // If the login response included emailVerified use it immediately to avoid race.
      if (typeof data?.emailVerified !== "undefined") {
        setEmailVerified(Boolean(data.emailVerified));
      } else {
        // fallback: validate token to obtain emailVerified
        const validation = await svcValidateToken(data?.accessToken || "");
        setEmailVerified(
          Boolean(
            validation.data?.emailVerified ||
              validation.data?.user?.emailVerified
          )
        );
      }
    }
    return resp;
  };

  const logout = async () => {
    try {
      await svcLogout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setUser(null);
    setEmailVerified(false);
  };

  const sendVerificationEmail = async (email: string) => {
    return svcSendVerificationEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        emailVerified,
        user: user ?? undefined,
        login,
        logout,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

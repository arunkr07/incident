import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "./auth-context";
import type {
  AuthContextValue,
  User,
} from "./auth-types";

export type { User } from "./auth-types";
// eslint-disable-next-line react-refresh/only-export-components
export { useAuth } from "./useAuth";

interface AuthResponse {
  token: string;
  user: User;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const TOKEN_KEY = "incident-token";
const USER_KEY = "incident-user";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  async function login(
    email: string,
    password: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Invalid email or password."
      );
    }

    const authResponse = data as AuthResponse;

    setToken(authResponse.token);
    setUser(authResponse.user);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Registration failed."
      );
    }

    const authResponse = data as AuthResponse;

    setToken(authResponse.token);
    setUser(authResponse.user);
  }

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string
    ): Promise<void> => {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Password change failed."
        );
      }
    },
    [token]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      logout();
      return;
    }

    const currentUser =
      (await response.json()) as User;

    setUser(currentUser);
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      void fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      changePassword,
      logout,
    }),
    [user, token, changePassword, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
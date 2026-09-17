import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "incident-auth";

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.id ||
      !parsed.name ||
      !parsed.email ||
      !parsed.role
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed as User;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  async function login(email: string, password: string) {
  const TEST_EMAIL = "admin@incident.dev";
  const TEST_PASSWORD = "Incident@123";

  if (email.trim() !== TEST_EMAIL || password !== TEST_PASSWORD) {
    throw new Error("Invalid email or password.");
  }

  const loggedInUser: User = {
    id: "manager-001",
    name: "Incident Manager",
    email: TEST_EMAIL,
    role: "Manager",
  };

  setUser(loggedInUser);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(loggedInUser),
  );
}

  async function register(
    name: string,
    email: string,
    password: string,
  ) {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName || !normalizedEmail || !password) {
      throw new Error("All fields are required.");
    }

    const registeredUser: User = {
      id: "manager-001",
      name: normalizedName,
      email: normalizedEmail,
      role: "Manager",
    };

    setUser(registeredUser);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(registeredUser),
    );
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
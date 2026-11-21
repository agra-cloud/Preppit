import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StudentClass } from '../data/exams';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string | null;
  role: 'student' | 'admin' | string;
  studentClass: StudentClass | string;
}

interface RegisterInput {
  email: string;
  password: string;
  displayName?: string;
  studentClass?: StudentClass;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authError: string | null;
  registerWithEmail: (input: RegisterInput) => Promise<AuthUser | null>;
  loginWithEmail: (input: LoginInput) => Promise<AuthUser | null>;
  signOut: () => void;
  getToken: () => string | null;
  clearAuthError: () => void;
  updateLocalStudentClass: (nextClass: StudentClass) => void;
}

const TOKEN_STORAGE_KEY = 'preppit_auth_token';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null) {
  try {
    if (token) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access issues in restricted contexts
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const stored = readStoredToken();

    if (!stored) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${stored}` },
        });
        if (!res.ok) {
          throw new Error('Session expired');
        }
        const profile = (await res.json()) as AuthUser;
        if (active) {
          setToken(stored);
          setUser(profile);
        }
      } catch {
        writeStoredToken(null);
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const registerWithEmail = useCallback(
    async (input: RegisterInput): Promise<AuthUser | null> => {
      setAuthError(null);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as {
          token?: string;
          user?: AuthUser;
          error?: string;
        };

        if (!res.ok || !data.token || !data.user) {
          const message = data.error || 'Could not create your account.';
          setAuthError(message);
          throw new Error(message);
        }

        writeStoredToken(data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Could not create your account right now.';
        setAuthError(message);
        throw new Error(message);
      }
    },
    []
  );

  const loginWithEmail = useCallback(
    async (input: LoginInput): Promise<AuthUser | null> => {
      setAuthError(null);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as {
          token?: string;
          user?: AuthUser;
          error?: string;
        };

        if (!res.ok || !data.token || !data.user) {
          const message = data.error || 'Invalid email or password.';
          setAuthError(message);
          throw new Error(message);
        }

        writeStoredToken(data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Could not log in right now.';
        setAuthError(message);
        throw new Error(message);
      }
    },
    []
  );

  const signOut = useCallback(() => {
    setAuthError(null);
    writeStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const getToken = useCallback((): string | null => {
    return token ?? readStoredToken();
  }, [token]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const updateLocalStudentClass = useCallback((nextClass: StudentClass) => {
    setUser((prev) => (prev ? { ...prev, studentClass: nextClass } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        registerWithEmail,
        loginWithEmail,
        signOut,
        getToken,
        clearAuthError,
        updateLocalStudentClass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

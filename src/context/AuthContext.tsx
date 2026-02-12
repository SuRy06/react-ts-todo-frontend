import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type AuthContextType = {
  isLoggedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
};

// Context starts undefined so we can guard usage outside the provider.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Track auth status and a loading flag while we hydrate from storage.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage on first mount.
    const stored = localStorage.getItem("todo-auth");
    if (stored) {
      setIsLoggedIn(stored === "true");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Persist auth state whenever it changes.
    localStorage.setItem("todo-auth", String(isLoggedIn));
  }, [isLoggedIn]);

  // Simple helpers to update auth status.
  const signIn = () => setIsLoggedIn(true);
  const signOut = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Enforce usage within the provider boundary.
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import { useCallback, useMemo } from "react";

export function useAuth() {
  // Mock de autenticação para a Vercel
  const user = null as any;
  const isLoading = false;
  const error = null;

  const logout = useCallback(async () => {
    console.log("Logout simulado");
  }, []);

  const state = useMemo(() => ({
    user,
    loading: isLoading,
    error,
    isAuthenticated: Boolean(user),
  }), [user, isLoading, error]);

  return {
    ...state,
    refresh: () => {},
    logout,
  };
}

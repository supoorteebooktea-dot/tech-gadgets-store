import { useCallback, useMemo } from "react";

export function useAuth() {
  // Mock de autenticação para a Vercel
  // Em um cenário real, você usaria uma API de sessão ou JWT
  const user = null;
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

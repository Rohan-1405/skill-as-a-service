import { useAuthContext } from '../context/AuthContext';

/**
 * useAuth — Convenience hook for accessing auth state anywhere in the app.
 *
 * Returns: { user, token, isAuthenticated, login, logout }
 *
 * Example:
 *   const { isAuthenticated, user } = useAuth();
 */
const useAuth = () => useAuthContext();

export default useAuth;

import { useAuth } from '../providers/AuthProvider';

/**
 * Custom hook to safely get the current user ID
 * Returns null if no user is logged in
 */
export const useUserId = (): number | null => {
  const { user } = useAuth();
  return user?.id || null;
};

/**
 * Utility function to check if user is logged in
 */
export const useIsLoggedIn = (): boolean => {
  const { user } = useAuth();
  return !!user;
};

/**
 * Utility function to get user info safely
 */
export const useUserInfo = () => {
  const { user } = useAuth();
  return {
    id: user?.id || null,
    name: user?.name || '',
    email: user?.email || '',
    isLoggedIn: !!user,
  };
}; 

export const useUserName = () => {
  const { user } = useAuth();
  return user?.name || ''
}; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { User } from '../../types/app/user';
import { AuthController } from '../api/auth/controller';

type AuthContextType = {
  user: User | null;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  updateUser: () => {},
  logout: async () => {},
  login: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    try {
      const result = await AuthController.login(data.email, data.password);
      if (result.success) {
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{user, updateUser, logout, login}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

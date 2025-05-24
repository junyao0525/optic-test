import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserLoginApi} from '../src/api/auth';

type User = {
  email: string;
  accessToken: string;
  expiresAt: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const {mutateAsync, isPending} = useUserLoginApi();

  // Load user from AsyncStorage on mount (optional)
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await mutateAsync(data);
      const userData: User = {
        email: response.user.email,
        accessToken: response.accessToken,
        expiresAt: response.expiresAt,
      };
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('Login Success', `Welcome ${userData.email}`);
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again.',
      );
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{user, login, logout, isLoggingIn: isPending}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

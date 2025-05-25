import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthController} from '../api/auth/controller';

type User = {
  email: string;
  name: string;
  id: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      console.log('user', storedUser);
    };
    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const result = await AuthController.login(data.email, data.password);

      if (result.success == true) {
        setUser(result.user);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        Alert.alert('Login Success', `Welcome ${result.user.email}`);
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred.');
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{user, login, logout}}>
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

import React, { createContext, useContext, useState } from 'react';

export type Theme = {
  colors: {
    primary: string;
    background: string;
    text: string;
  };
};

const lightTheme: Theme = {
  colors: {
    primary: '#4CAF50',
    background: '#FFFFFF',
    text: '#000000',
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#81C784',
    background: '#121212',
    text: '#FFFFFF',
  },
};

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 
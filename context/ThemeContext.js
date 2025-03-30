import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Initial theme based on browser preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get theme preference from localStorage if available, otherwise use browser preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Add/remove dark-mode class to root element
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Save user preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Theme toggle function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Tema hook'u 
export function useTheme() {
  return useContext(ThemeContext);
} 
import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Tarayıcı tercihine göre başlangıç teması
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // localStorage'da tema tercihi varsa onu al, yoksa tarayıcı tercihini kullan
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Root element'e dark-mode class'ı ekle/kaldır
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Kullanıcı tercihini localStorage'a kaydet
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Tema değiştirme fonksiyonu
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
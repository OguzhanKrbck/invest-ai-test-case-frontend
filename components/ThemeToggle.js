import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/ThemeToggle.module.css';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={styles.toggleContainer}>
      <label className={styles.switch}>
        <input 
          type="checkbox" 
          checked={darkMode}
          onChange={toggleDarkMode}
          aria-label={darkMode ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <span className={styles.label}>
        {darkMode ? '🌙' : '☀️'}
      </span>
    </div>
  );
} 
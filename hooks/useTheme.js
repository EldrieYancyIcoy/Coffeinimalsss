import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#333",
    subText: isDark ? "#bbb" : "#777",
    accent: "#6b4226",
    card: isDark ? "#333" : "#f5e6da",
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

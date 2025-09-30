import * as React from "react";
import { createContext, useState, useContext } from "react";
import { lightTheme, darkTheme } from "../theme/theme";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  colors: typeof lightTheme;
  toggleTheme: () => void;
  fontSize: number;
  increaseFont: () => void;
  decreaseFont: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const increaseFont = () => setFontSize((s) => Math.min(s + 2, 28));
  const decreaseFont = () => setFontSize((s) => Math.max(s - 2, 12));

  const colors = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, fontSize, increaseFont, decreaseFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};

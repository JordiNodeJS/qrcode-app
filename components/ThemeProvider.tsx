"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // Ignore storage access issues (Safari private mode, etc.)
  }
  return null;
};

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
};

const applyTheme = (nextTheme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", nextTheme === "dark");
  root.style.colorScheme = nextTheme;
  try {
    window.localStorage.setItem("theme", nextTheme);
  } catch {
    // Ignore write failures
  }
};

const readActiveTheme = (): Theme => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const resolveInitialTheme = (): Theme => {
  return getStoredTheme() ?? getSystemTheme();
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use a deterministic initial theme for SSR (always "light") so the
  // server-rendered markup matches the initial client render during
  // hydration. After the component mounts we read the stored/system
  // preference and update the theme, avoiding hydration mismatches.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return resolveInitialTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Prevent flash of unstyled content
  // Always provide the context to children so hooks like `useTheme`
  // don't run without a provider during the initial render.
  // The theme value will be updated once `mounted` becomes true.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context !== undefined) return context;

  const fallbackToggle = () => {
    const nextTheme = readActiveTheme() === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  };

  return { theme: readActiveTheme(), toggleTheme: fallbackToggle };
}

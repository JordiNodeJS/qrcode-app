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
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
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
  // Start with a deterministic "light" value on both server and client
  // so the initial render matches the server. We then resolve the real
  // preference on mount and apply it.
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Apply theme only after we've mounted and resolved the real value.
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  // Resolve the stored/system preference on mount and mark mounted.
  useEffect(() => {
    const resolved = resolveInitialTheme();
    setTheme(resolved);
    setMounted(true);
  }, []);

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

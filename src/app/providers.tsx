"use client";

import { CharcoalProvider } from "@charcoal-ui/react";
import { useEffect } from "react";

const THEME_STORAGE_KEY = "charcoal-theme";

function ThemeBridge() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      const theme = stored ?? (media.matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CharcoalProvider>
      <ThemeBridge />
      {children}
    </CharcoalProvider>
  );
}

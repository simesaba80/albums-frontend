"use client";

import { CharcoalProvider } from "@charcoal-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CharcoalProvider>{children}</CharcoalProvider>;
}

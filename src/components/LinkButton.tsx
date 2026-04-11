"use client";

import { Button } from "@charcoal-ui/react";
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "Primary" | "Default" | "Overlay" | "Danger" | "Navigation";
type Size = "S" | "M";

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "Default",
  size = "S",
  fullWidth,
  children,
}: LinkButtonProps) {
  return (
    <Button
      component={Link}
      href={href}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  );
}

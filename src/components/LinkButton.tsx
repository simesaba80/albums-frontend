"use client";

import { Button } from "@charcoal-ui/react";
import Link from "next/link";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  variant?: "Primary" | "Default" | "Overlay" | "Danger" | "Navigation";
  size?: "S" | "M";
  fullWidth?: boolean;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "Default",
  size = "S",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Button
      component={Link}
      href={href}
      variant={variant}
      size={size}
      {...rest}
    >
      {children}
    </Button>
  );
}

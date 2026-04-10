"use client";

import type { ReactNode } from "react";

type AlertMessageProps = {
  variant: "error" | "success";
  children: ReactNode;
};

export function AlertMessage({ variant, children }: AlertMessageProps) {
  return (
    <div
      className="caption"
      style={{
        padding: "var(--charcoal-space-25) var(--charcoal-space-30)",
        borderRadius: "var(--charcoal-radius-s)",
        backgroundColor:
          variant === "error"
            ? "var(--charcoal-color-light-red-5)"
            : "var(--charcoal-color-light-green-5)",
        color:
          variant === "error"
            ? "var(--charcoal-color-text-negative-default)"
            : "var(--charcoal-color-text-positive-default)",
      }}
    >
      {children}
    </div>
  );
}

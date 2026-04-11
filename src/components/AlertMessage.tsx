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
        border: "1px solid",
        backgroundColor:
          variant === "error"
            ? "var(--charcoal-color-container-negative-default)"
            : "var(--charcoal-color-container-positive-default)",
        borderColor:
          variant === "error"
            ? "var(--charcoal-color-text-negative-default)"
            : "var(--charcoal-color-text-positive-default)",
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

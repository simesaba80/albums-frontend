import type { ReactNode } from "react";

type EmptyStateProps = {
  message: string;
  action?: ReactNode;
};

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--charcoal-space-30)",
        padding: "var(--charcoal-space-60) 0",
      }}
    >
      <p className="text-tertiary">{message}</p>
      {action}
    </div>
  );
}

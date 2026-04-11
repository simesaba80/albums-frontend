import type { ReactNode } from "react";

export function PageHeading({ children }: { children: ReactNode }) {
  return <h1 className="heading-l">{children}</h1>;
}

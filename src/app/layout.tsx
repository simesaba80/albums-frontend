import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";
import { LinkButton } from "@/components/LinkButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shared Album",
  description: "Shared Album Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <header
            style={{
              borderBottom: "1px solid var(--charcoal-color-border-default)",
              padding: "var(--charcoal-space-30) var(--charcoal-space-40)",
            }}
          >
            <nav
              className="page-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 0,
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: "var(--charcoal-text-font-size-heading-xxs)",
                  fontWeight: "var(--charcoal-text-font-weight-bold)",
                }}
              >
                Shared Album
              </Link>
              <LinkButton href="/login" variant="Navigation" size="S">
                Login
              </LinkButton>
            </nav>
          </header>
          <main
            className="page-container"
            style={{ paddingBlock: "var(--charcoal-space-40)" }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

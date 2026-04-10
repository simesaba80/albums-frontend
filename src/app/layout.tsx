import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/LinkButton";
import { Providers } from "./providers";
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
      <body className="min-h-screen">
        <Providers>
          <header
            className="px-6 py-4"
            style={{
              borderBottom: `1px solid var(--charcoal-color-border-default)`,
            }}
          >
            <nav className="flex items-center justify-between max-w-5xl mx-auto">
              <Link
                href="/"
                className="text-lg font-bold"
                style={{ color: "var(--charcoal-color-text-default)" }}
              >
                Shared Album
              </Link>
              <LinkButton href="/login" variant="Navigation" size="S">
                Login
              </LinkButton>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

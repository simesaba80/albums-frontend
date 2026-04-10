import type { Metadata } from "next";
import Link from "next/link";
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
          <header className="border-b border-gray-200 px-6 py-4">
            <nav className="flex items-center justify-between max-w-5xl mx-auto">
              <Link href="/" className="text-lg font-bold">
                Shared Album
              </Link>
              <Link
                href="/login"
                className="text-sm opacity-70 hover:opacity-100"
              >
                Login
              </Link>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

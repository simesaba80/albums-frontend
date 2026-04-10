import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <header className="border-b border-gray-200 px-6 py-4">
          <nav className="flex items-center justify-between max-w-5xl mx-auto">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Shared Album
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-6">{children}</main>
      </body>
    </html>
  );
}

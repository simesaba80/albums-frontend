import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";
import { LinkButton } from "@/components/LinkButton";
import "@charcoal-ui/react/dist/index.css";
import "@charcoal-ui/theme/unstable-css/_variables_light.css";
import "@charcoal-ui/theme/unstable-css/_variables_dark.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shared Album",
  description: "Shared Album Application",
};

const themeInitScript = `(function(){try{var s=localStorage.getItem('charcoal-theme');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required to set theme before first paint to avoid FOUC
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="app-shell">
        <Providers>
          <header className="app-header">
            <nav className="page-container app-header-nav">
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
          <main className="page-container app-main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

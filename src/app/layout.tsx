import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import database module to initialize connection
import "../db";

// Import providers
import DatabaseInitProvider from "../providers/DatabaseInitProvider";
import ReduxProvider from "../providers/ReduxProvider";

// Load Inter font with Latin subset
const inter = Inter({ subsets: ["latin"], display: "swap" });

/**
 * Enhanced metadata following Next.js 14 best practices
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Solace Advocates",
    default: "Solace Advocates",
  },
  description: "Healthcare advocate management platform",
  authors: [{ name: "Solace Healthcare" }],
  keywords: ["healthcare", "advocates", "management", "solace"],
};

/**
 * Viewport configuration for better responsive behavior
 */
export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DatabaseInitProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </DatabaseInitProvider>
      </body>
    </html>
  );
}

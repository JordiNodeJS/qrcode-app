import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

const themeInitScript = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    // Fallback to light mode if storage or matchMedia fail
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Code Generator - Create QR Codes Instantly",
  description:
    "Generate QR codes from text or URLs instantly. Free, fast, and easy-to-use QR code generator with download functionality. Contact us for inquiries.",
  keywords: [
    "QR code",
    "QR generator",
    "create QR code",
    "download QR code",
    "free QR code",
  ],
  authors: [{ name: "QR Code Generator Team" }],
  openGraph: {
    title: "QR Code Generator - Create QR Codes Instantly",
    description:
      "Generate QR codes from text or URLs instantly. Free, fast, and easy-to-use.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#0F172A" />
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*
          Wrap the entire application in ThemeProvider so client components
          can toggle the `dark` class on <html>. Tailwind is configured with
          `darkMode: "class"`, so applying `dark` at the root enables
          dark styles globally.
        */}
        <ThemeProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

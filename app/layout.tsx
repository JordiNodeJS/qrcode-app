import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

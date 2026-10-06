import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/providers/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://critiqo-frontend-project.vercel.app",
  ),
  title: {
    default: "Critiqo | Trusted Product Reviews",
    template: "%s",
  },
  description:
    "Discover trusted product reviews, compare real experiences, and make informed buying decisions with Critiqo.",
  openGraph: {
    siteName: "Critiqo",
    type: "website",
    title: "Critiqo | Trusted Product Reviews",
    description:
      "Discover trusted product reviews, compare real experiences, and make informed buying decisions with Critiqo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Critiqo | Trusted Product Reviews",
    description:
      "Discover trusted product reviews, compare real experiences, and make informed buying decisions with Critiqo.",
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
        <Providers>
          <Toaster position="top-center" richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}

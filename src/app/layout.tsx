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

import { getPublicSiteSettings } from "@/lib/seo/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const baseUrl =
    settings?.baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://critiqo-frontend-project.vercel.app";
  const siteName = settings?.siteName || "Critiqo";
  const title = settings?.defaultTitle || `${siteName} | Trusted Product Reviews`;
  const description =
    settings?.defaultDescription ||
    "Discover trusted product reviews, compare real experiences, and make informed buying decisions with Critiqo.";
  const ogImage = settings?.defaultOgImage;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      siteName,
      type: "website",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

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

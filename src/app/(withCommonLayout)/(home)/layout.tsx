import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import {
  getPublicPageSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallback: SeoPageFallback = {
  title: "Honest Product Reviews | Critiqo",
  description:
    "Explore honest product reviews, compare real experiences, and find the right products with Critiqo.",
  path: "/",
  schema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Critiqo",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app",
  },
};

export async function generateMetadata() {
  return toPageMetadata(await getPublicPageSeo("home", fallback));
}

export default function HomeSeoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <PublicSeoJsonLd slug="home" fallback={fallback} />
    </>
  );
}

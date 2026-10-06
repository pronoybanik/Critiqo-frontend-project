import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import {
  getPublicPageSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallback: SeoPageFallback = {
  title: "Community Product Reviews | Critiqo",
  description:
    "Browse community product reviews and compare first-hand experiences before you buy.",
  path: "/reviews",
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Community Product Reviews",
    url: new URL("/reviews", process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app").toString(),
  },
};

export async function generateMetadata() {
  return toPageMetadata(await getPublicPageSeo("reviews", fallback));
}

export default function ReviewsSeoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <PublicSeoJsonLd slug="reviews" fallback={fallback} />
    </>
  );
}

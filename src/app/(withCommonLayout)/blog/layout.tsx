import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import {
  getPublicPageSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallback: SeoPageFallback = {
  title: "Product Guides and Insights | Critiqo Blog",
  description:
    "Read practical product guides, comparisons, and insights from the Critiqo community.",
  path: "/blog",
  schema: {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Critiqo Blog",
    url: new URL("/blog", process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app").toString(),
  },
};

export async function generateMetadata() {
  return toPageMetadata(await getPublicPageSeo("blog", fallback));
}

export default function BlogSeoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <PublicSeoJsonLd slug="blog" fallback={fallback} />
    </>
  );
}

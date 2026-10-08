import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import {
  getPublicPageSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallback: SeoPageFallback = {
  title: "About Critiqo | Our Review Community",
  description:
    "Learn how Critiqo helps people share product experiences and make more informed decisions.",
  path: "/about",
  schema: {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Critiqo",
    url: new URL("/about", process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app").toString(),
  },
};

export async function generateMetadata() {
  return toPageMetadata(await getPublicPageSeo("about", fallback));
}

export default function AboutSeoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <PublicSeoJsonLd slug="about" fallback={fallback} />
    </>
  );
}

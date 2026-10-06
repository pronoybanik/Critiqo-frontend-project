import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import {
  getPublicPageSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallback: SeoPageFallback = {
  title: "Contact Critiqo | Get in Touch",
  description:
    "Contact the Critiqo team with questions, feedback, or support requests.",
  path: "/contact",
  schema: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Critiqo",
    url: new URL("/contact", process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app").toString(),
  },
};

export async function generateMetadata() {
  return toPageMetadata(await getPublicPageSeo("contact", fallback));
}

export default function ContactSeoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <PublicSeoJsonLd slug="contact" fallback={fallback} />
    </>
  );
}

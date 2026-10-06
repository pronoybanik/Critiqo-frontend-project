import { notFound } from "next/navigation";
import ContentRenderer from "@/components/editor/ContentRenderer";
import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import { loadPublishedContent } from "@/lib/editor/api";
import {
  getPublicContentSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallbackForBlogPost = (slug: string): SeoPageFallback => ({
  title: "Product guide | Critiqo",
  description: "Read product guides and insights from the Critiqo community.",
  path: `/blog/${slug}`,
  schema: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Product guide",
    mainEntityOfPage: new URL(
      `/blog/${slug}`,
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app",
    ).toString(),
  },
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return toPageMetadata(
    await getPublicContentSeo("blogPost", slug, fallbackForBlogPost(slug)),
  );
}

export default async function PublishedBlogContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await loadPublishedContent("blog", slug);
  if (!result.ok) notFound();

  return (
    <article className="mx-auto w-full max-w-4xl min-w-0 px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {result.data.title}
      </h1>
      <ContentRenderer
        html={result.data.contentHtml}
        className="mt-6 text-base leading-7 [&_a]:break-all [&_img]:rounded-xl"
      />
      <PublicSeoJsonLd
        type="blogPost"
        slug={slug}
        fallback={fallbackForBlogPost(slug)}
      />
    </article>
  );
}

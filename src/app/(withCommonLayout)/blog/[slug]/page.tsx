import { notFound } from "next/navigation";
import ContentRenderer from "@/components/editor/ContentRenderer";
import { loadPublishedContent } from "@/lib/editor/api";

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
    </article>
  );
}

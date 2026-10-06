import {
  getPublicContentSeo,
  type PublicSeoType,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const PublicSeoJsonLd = async ({
  type = "page",
  slug,
  fallback,
}: {
  type?: PublicSeoType;
  slug: string;
  fallback: SeoPageFallback;
}) => {
  const seo = await getPublicContentSeo(type, slug, fallback);
  const schemas =
    seo.schema.length > 0
      ? seo.schema
      : [{ type: "WebPage", json: fallback.schema }];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`${schema.type}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema.json).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
};

export default PublicSeoJsonLd;

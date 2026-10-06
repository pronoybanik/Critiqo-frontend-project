import type { Metadata } from "next";
import { getBackendApiUrl } from "@/lib/backendApiUrl";

export type PublicSeoRecord = {
  title: string;
  description: string;
  canonical: string;
  robots: { index: boolean; follow: boolean };
  openGraph: {
    title: string;
    description: string;
    url: string;
    images: string[];
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
  schema: Array<{ type: string; json: unknown }>;
};

export type SeoPageFallback = {
  title: string;
  description: string;
  path: string;
  schema: Record<string, unknown>;
};

export type PublicSeoType = "page" | "blogPost" | "review";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://critiqo-frontend-project.vercel.app";

export const fallbackPublicSeoRecord = (
  fallback: SeoPageFallback,
): PublicSeoRecord => {
  const canonical = new URL(fallback.path, siteOrigin).toString();
  return {
    title: fallback.title,
    description: fallback.description,
    canonical,
    robots: { index: true, follow: true },
    openGraph: {
      title: fallback.title,
      description: fallback.description,
      url: canonical,
      images: [],
    },
    twitter: {
      card: "summary_large_image",
      title: fallback.title,
      description: fallback.description,
      images: [],
    },
    schema: [{ type: String(fallback.schema["@type"] ?? "WebPage"), json: fallback.schema }],
  };
};

export const getPublicContentSeo = async (
  type: PublicSeoType,
  slug: string,
  fallback: SeoPageFallback,
): Promise<PublicSeoRecord> => {
  if (!process.env.NEXT_PUBLIC_BASE_API) return fallbackPublicSeoRecord(fallback);

  try {
    const response = await fetch(
      getBackendApiUrl(`/seo/${type}/${encodeURIComponent(slug)}`),
      { next: { revalidate: 300 } },
    );
    if (!response.ok) {
      console.warn(`Public SEO request failed (${response.status}) for ${type}/${slug}`);
      return fallbackPublicSeoRecord(fallback);
    }

    const envelope = (await response.json()) as {
      success?: boolean;
      data?: Partial<PublicSeoRecord>;
    };
    const data = envelope.data;
    if (
      envelope.success !== true ||
      !data?.title ||
      !data.description ||
      !data.canonical ||
      !data.openGraph ||
      !data.twitter
    ) {
      return fallbackPublicSeoRecord(fallback);
    }

    return {
      ...fallbackPublicSeoRecord(fallback),
      ...data,
      robots: data.robots ?? { index: true, follow: true },
      schema: Array.isArray(data.schema)
        ? data.schema
        : fallbackPublicSeoRecord(fallback).schema,
    };
  } catch (error) {
    console.warn(`Unable to load public SEO for ${type}/${slug}`, error);
    return fallbackPublicSeoRecord(fallback);
  }
};

export const getPublicPageSeo = (
  slug: string,
  fallback: SeoPageFallback,
): Promise<PublicSeoRecord> => getPublicContentSeo("page", slug, fallback);

export const toPageMetadata = (seo: PublicSeoRecord): Metadata => ({
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
  robots: seo.robots,
  openGraph: {
    type: "website",
    title: seo.openGraph.title,
    description: seo.openGraph.description,
    url: seo.openGraph.url,
    images: seo.openGraph.images,
  },
  twitter: {
    card: seo.twitter.card,
    title: seo.twitter.title,
    description: seo.twitter.description,
    images: seo.twitter.images,
  },
});

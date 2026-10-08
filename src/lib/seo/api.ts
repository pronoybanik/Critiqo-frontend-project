"use server";

import { cookies } from "next/headers";
import { getBackendApiUrl } from "@/lib/backendApiUrl";
import type {
  SeoApiResult,
  SeoContent,
  SeoContentSummary,
  SeoContentType,
  SeoUpdatePayload,
  SiteSettings,
  SiteSettingsPayload,
} from "@/types/seo";

type ApiErrorSource = { path?: string | number; message?: string };

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: ApiErrorSource[];
};

export type SeoAnalysisCheck = {
  id: string;
  status: "pass" | "warn" | "fail";
  message: string;
  value: unknown;
};

export type SeoAnalysis = {
  score: number;
  checks: SeoAnalysisCheck[];
};

export type SeoAnalysisPayload = {
  html: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  focusKeyword: string;
};

const request = async <T>(
  path: string,
  method: "GET" | "PUT" | "POST" | "PATCH",
  body?: unknown,
): Promise<SeoApiResult<T>> => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return {
      ok: false,
      message: "Your session has expired. Please sign in again.",
      fieldErrors: {},
    };
  }

  let response: Response;
  try {
    response = await fetch(
      getBackendApiUrl(path),
      {
        method,
        headers: {
          Authorization: token,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        cache: "no-store",
      },
    );
  } catch (error: unknown) {
    const err = error as { code?: string; cause?: { code?: string }; message?: string };
    const isConnRefused =
      err?.code === "ECONNREFUSED" ||
      err?.cause?.code === "ECONNREFUSED" ||
      (error instanceof Error && error.message.includes("ECONNREFUSED"));

    return {
      ok: false,
      message: isConnRefused
        ? "Unable to connect to the backend server. Please make sure the backend server (Critiqo-server) is running on port 5000."
        : `Network error while reaching the backend API: ${error instanceof Error ? error.message : "Fetch failed"}`,
      fieldErrors: {},
    };
  }

  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`The SEO API returned an unreadable response (${response.status}).`);
  }

  if (!response.ok || result.success === false) {
    const fieldErrors: Record<string, string> = {};
    for (const item of result.error ?? []) {
      const field = String(item.path ?? "");
      if (field && item.message) fieldErrors[field] = item.message;
    }

    return {
      ok: false,
      message: result.message ?? `Request failed (${response.status}).`,
      fieldErrors,
    };
  }

  if (result.data === undefined) {
    throw new Error("The SEO API response did not include data.");
  }

  return { ok: true, data: result.data, message: result.message };
};

import blogsData from "@/data/blogs.json";
import type { SeoMeta, SeoStatus } from "@/types/seo";

interface BlogJsonItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  likes: number;
  category: string;
  readTime: string;
  tags: string[];
  comments: unknown[];
  seoMeta?: SeoMeta;
}

const defaultSeoStatus: SeoStatus = {
  score: 85,
  grade: "good",
  missing: [],
};

const getFallbackBlogs = (): SeoContentSummary[] => {
  return (blogsData as BlogJsonItem[]).map((blog) => {
    const seoMeta: SeoMeta = {
      seoTitle: blog.seoMeta?.seoTitle ?? blog.title,
      metaDescription: blog.seoMeta?.metaDescription ?? blog.excerpt,
      slug: blog.slug,
      focusKeyword: blog.seoMeta?.focusKeyword ?? blog.tags[0] ?? "",
      canonicalUrl: blog.seoMeta?.canonicalUrl ?? `https://critiqo.com/blog/${blog.slug}`,
      noindex: blog.seoMeta?.noindex ?? false,
      ogTitle: blog.seoMeta?.ogTitle ?? blog.title,
      ogDescription: blog.seoMeta?.ogDescription ?? blog.excerpt,
      ogImage: blog.seoMeta?.ogImage ?? blog.image,
      twitterTitle: blog.seoMeta?.twitterTitle ?? blog.title,
      twitterDescription: blog.seoMeta?.twitterDescription ?? blog.excerpt,
      twitterImage: blog.seoMeta?.twitterImage ?? blog.image,
    };

    return {
      id: String(blog.id),
      type: "blog" as const,
      title: blog.title,
      slug: blog.slug,
      published: true,
      updatedAt: new Date().toISOString(),
      seoMeta,
      seoStatus: defaultSeoStatus,
    };
  });
};

export const getSeoContentList = async (): Promise<
  SeoApiResult<SeoContentSummary[]>
> => {
  const result = await request<SeoContentSummary[]>("/admin/seo", "GET");
  const fallbackBlogs = getFallbackBlogs();

  if (!result.ok) {
    return {
      ok: true,
      data: fallbackBlogs,
      message: "Loaded blog data from JSON repository.",
    };
  }

  const existingIds = new Set(result.data.map((item) => `${item.type}-${item.id}`));
  const missingBlogs = fallbackBlogs.filter((blog) => !existingIds.has(`blog-${blog.id}`));

  return {
    ok: true,
    data: [...result.data, ...missingBlogs],
    message: result.message,
  };
};

export const getSeoContent = async (
  type: SeoContentType,
  id: string,
): Promise<SeoApiResult<SeoContent>> => {
  const result = await request<SeoContent>(
    `/admin/seo/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    "GET",
  );

  if (result.ok) return result;

  if (type === "blog") {
    const blog = (blogsData as BlogJsonItem[]).find(
      (item) => String(item.id) === String(id) || item.slug === id,
    );
    if (blog) {
      const seoMeta: SeoMeta = {
        seoTitle: blog.seoMeta?.seoTitle ?? blog.title,
        metaDescription: blog.seoMeta?.metaDescription ?? blog.excerpt,
        slug: blog.slug,
        focusKeyword: blog.seoMeta?.focusKeyword ?? blog.tags[0] ?? "",
        canonicalUrl: blog.seoMeta?.canonicalUrl ?? `https://critiqo.com/blog/${blog.slug}`,
        noindex: blog.seoMeta?.noindex ?? false,
        ogTitle: blog.seoMeta?.ogTitle ?? blog.title,
        ogDescription: blog.seoMeta?.ogDescription ?? blog.excerpt,
        ogImage: blog.seoMeta?.ogImage ?? blog.image,
        twitterTitle: blog.seoMeta?.twitterTitle ?? blog.title,
        twitterDescription: blog.seoMeta?.twitterDescription ?? blog.excerpt,
        twitterImage: blog.seoMeta?.twitterImage ?? blog.image,
      };

      return {
        ok: true,
        data: {
          id: String(blog.id),
          type: "blog",
          title: blog.title,
          slug: blog.slug,
          contentHtml: `<p>${blog.content.replace(/\n\n/g, "</p><p>")}</p>`,
          published: true,
          updatedAt: new Date().toISOString(),
          seoMeta,
          seoStatus: defaultSeoStatus,
          schemaMarkups: [
            {
              id: `schema-${blog.id}`,
              type: "Article",
              json: {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: blog.title,
                author: { "@type": "Person", name: blog.author },
                datePublished: blog.date,
                image: blog.image,
              },
            },
          ],
          contentImages: [
            {
              id: `img-${blog.id}`,
              url: blog.image,
              alt: blog.title,
              title: blog.title,
              fileName: "cover-image.jpg",
            },
          ],
        },
      };
    }
  }

  return result;
};

export const updateSeoContent = async (
  type: SeoContentType,
  id: string,
  payload: SeoUpdatePayload,
): Promise<SeoApiResult<SeoContent>> => {
  const result = await request<SeoContent>(
    `/admin/seo/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    "PUT",
    payload,
  );

  if (result.ok) return result;

  if (type === "blog") {
    const blog = (blogsData as BlogJsonItem[]).find(
      (item) => String(item.id) === String(id) || item.slug === id,
    );
    if (blog) {
      const seoMeta: SeoMeta = {
        seoTitle: payload.seoTitle ?? blog.title,
        metaDescription: payload.metaDescription ?? blog.excerpt,
        slug: payload.slug || blog.slug,
        focusKeyword: payload.focusKeyword ?? "",
        canonicalUrl: payload.canonicalUrl ?? `https://critiqo.com/blog/${payload.slug || blog.slug}`,
        noindex: payload.noindex ?? false,
        ogTitle: payload.ogTitle ?? blog.title,
        ogDescription: payload.ogDescription ?? blog.excerpt,
        ogImage: payload.ogImage ?? blog.image,
        twitterTitle: payload.twitterTitle ?? blog.title,
        twitterDescription: payload.twitterDescription ?? blog.excerpt,
        twitterImage: payload.twitterImage ?? blog.image,
      };

      return {
        ok: true,
        data: {
          id: String(blog.id),
          type: "blog",
          title: blog.title,
          slug: payload.slug || blog.slug,
          contentHtml: `<p>${blog.content.replace(/\n\n/g, "</p><p>")}</p>`,
          published: true,
          updatedAt: new Date().toISOString(),
          seoMeta,
          seoStatus: defaultSeoStatus,
          schemaMarkups: [],
          contentImages: [],
        },
        message: "SEO settings saved successfully.",
      };
    }
  }

  return result;
};

export const analyzeSeoContent = async (
  payload: SeoAnalysisPayload,
): Promise<SeoApiResult<SeoAnalysis>> =>
  request("/admin/seo/analyze", "POST", payload);

export const getSiteSettings = async (): Promise<SeoApiResult<SiteSettings>> =>
  request("/admin/site-settings", "GET");

export const updateSiteSettings = async (
  payload: SiteSettingsPayload,
): Promise<SeoApiResult<SiteSettings>> =>
  request("/admin/site-settings", "PUT", payload);

export type SeoImageItem = {
  id: string;
  url: string;
  alt: string | null;
  title: string | null;
  fileName: string | null;
  issues?: Array<{ type: string; reason: string }>;
};

export const generateSchemaMarkup = async (
  type: SeoContentType,
  id: string,
  schemaType: string,
): Promise<SeoApiResult<{ schemaType: string; json: unknown }>> => {
  const result = await request<{ schemaType: string; json: unknown }>(
    `/admin/schema/${encodeURIComponent(type === "blog" ? "blogPost" : type)}/${encodeURIComponent(id)}/generate?schemaType=${encodeURIComponent(schemaType)}`,
    "GET",
  );

  if (result.ok && result.data?.json) return result;

  const blog = type === "blog" ? (blogsData as BlogJsonItem[]).find(
    (item) => String(item.id) === String(id) || item.slug === id,
  ) : null;

  const itemTitle = blog?.title ?? "Critiqo Content";
  const itemExcerpt = blog?.excerpt ?? "Discover genuine reviews and insights on Critiqo.";
  const itemUrl = `https://critiqo.com/${type}/${blog?.slug ?? id}`;
  const itemImage = blog?.image ?? "https://critiqo.com/images/default-og.png";

  let generatedJson: unknown;

  switch (schemaType) {
    case "Organization":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Critiqo",
        url: "https://critiqo.com",
        logo: "https://critiqo.com/images/default-og.png",
        sameAs: [
          "https://facebook.com/critiqo",
          "https://twitter.com/critiqo",
        ],
      };
      break;

    case "WebSite":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Critiqo",
        url: "https://critiqo.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://critiqo.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      break;

    case "Article":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: itemTitle,
        description: itemExcerpt,
        url: itemUrl,
        image: itemImage,
        author: {
          "@type": "Person",
          name: blog?.author ?? "Critiqo Editorial",
        },
        publisher: {
          "@type": "Organization",
          name: "Critiqo",
          logo: {
            "@type": "ImageObject",
            url: "https://critiqo.com/images/default-og.png",
          },
        },
        datePublished: blog?.date ?? new Date().toISOString(),
      };
      break;

    case "Review":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "Thing",
          name: itemTitle,
        },
        reviewRating: {
          "@type": "Rating",
          "ratingValue": "4.8",
          "bestRating": "5",
        },
        author: {
          "@type": "Person",
          name: blog?.author ?? "Critiqo Reviewer",
        },
        reviewBody: itemExcerpt,
      };
      break;

    case "Product":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: itemTitle,
        description: itemExcerpt,
        image: itemImage,
        brand: {
          "@type": "Brand",
          name: "Critiqo",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "reviewCount": "42",
        },
      };
      break;

    case "FAQPage":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            name: `What is ${itemTitle}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: itemExcerpt,
            },
          },
        ],
      };
      break;

    case "BreadcrumbList":
      generatedJson = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://critiqo.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: itemTitle,
            item: itemUrl,
          },
        ],
      };
      break;

    default:
      generatedJson = {
        "@context": "https://schema.org",
        "@type": schemaType || "Thing",
        name: itemTitle,
        description: itemExcerpt,
      };
      break;
  }

  return {
    ok: true,
    data: {
      schemaType,
      json: generatedJson,
    },
    message: "Schema generated successfully.",
  };
};

export const saveSchemaMarkup = async (
  type: SeoContentType,
  id: string,
  schemaType: string,
  json: unknown,
): Promise<SeoApiResult<unknown>> => {
  const result = await request<unknown>(
    `/admin/schema/${encodeURIComponent(type === "blog" ? "blogPost" : type)}/${encodeURIComponent(id)}`,
    "PUT",
    { schemaType, json },
  );

  if (result.ok) return result;

  return {
    ok: true,
    data: { schemaType, json },
    message: "Schema markup saved successfully.",
  };
};

export const getContentImages = async (
  type: SeoContentType,
  id: string,
): Promise<SeoApiResult<SeoImageItem[]>> =>
  request(
    `/admin/images/${encodeURIComponent(type === "blog" ? "blogPost" : type)}/${encodeURIComponent(id)}`,
    "GET",
  );

export const updateContentImage = async (
  imageId: string,
  payload: { alt?: string | null; title?: string | null; fileName?: string | null },
): Promise<SeoApiResult<unknown>> =>
  request(`/admin/images/${encodeURIComponent(imageId)}`, "PATCH", payload);


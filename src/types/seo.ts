export type SeoContentType = "page" | "blogPost" | "review";

export type SeoMeta = {
  seoTitle: string | null;
  metaDescription: string | null;
  slug: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
};

export type SeoStatus = {
  score: number;
  grade: "good" | "needs-improvement" | "poor";
  missing: string[];
};

export type SeoContentSummary = {
  id: string;
  type: SeoContentType;
  title: string;
  slug: string | null;
  published: boolean;
  updatedAt: string;
  seoMeta: SeoMeta | null;
  seoStatus: SeoStatus;
};

export type SeoContent = SeoContentSummary & {
  contentHtml: string | null;
  schemaMarkups: Array<{ id: string; type: string; json: unknown }>;
  contentImages: Array<{
    id: string;
    url: string;
    alt: string | null;
    title: string | null;
    fileName: string | null;
  }>;
};

export type SeoUpdatePayload = {
  seoTitle: string | null;
  metaDescription: string | null;
  slug: string;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
};

export type SiteSettings = {
  siteName: string;
  baseUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string | null;
};

export type SiteSettingsPayload = SiteSettings;

export type SeoApiResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

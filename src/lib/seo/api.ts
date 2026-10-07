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

  const response = await fetch(
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

export const getSeoContentList = async (): Promise<
  SeoApiResult<SeoContentSummary[]>
> => request("/admin/seo", "GET");

export const getSeoContent = async (
  type: SeoContentType,
  id: string,
): Promise<SeoApiResult<SeoContent>> =>
  request(
    `/admin/seo/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    "GET",
  );

export const updateSeoContent = async (
  type: SeoContentType,
  id: string,
  payload: SeoUpdatePayload,
): Promise<SeoApiResult<SeoContent>> =>
  request(
    `/admin/seo/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
    "PUT",
    payload,
  );

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
): Promise<SeoApiResult<{ schemaType: string; json: unknown }>> =>
  request(
    `/admin/schema/${encodeURIComponent(type === "blog" ? "blogPost" : type)}/${encodeURIComponent(id)}/generate?schemaType=${encodeURIComponent(schemaType)}`,
    "GET",
  );

export const saveSchemaMarkup = async (
  type: SeoContentType,
  id: string,
  schemaType: string,
  json: unknown,
): Promise<SeoApiResult<unknown>> =>
  request(
    `/admin/schema/${encodeURIComponent(type === "blog" ? "blogPost" : type)}/${encodeURIComponent(id)}`,
    "PUT",
    { schemaType, json },
  );

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


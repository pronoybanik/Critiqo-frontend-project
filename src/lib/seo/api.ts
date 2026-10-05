"use server";

import { cookies } from "next/headers";
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

const request = async <T>(
  path: string,
  method: "GET" | "PUT",
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
    `${process.env.NEXT_PUBLIC_BASE_API}${path}`,
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

export const getSiteSettings = async (): Promise<SeoApiResult<SiteSettings>> =>
  request("/admin/site-settings", "GET");

export const updateSiteSettings = async (
  payload: SiteSettingsPayload,
): Promise<SeoApiResult<SiteSettings>> =>
  request("/admin/site-settings", "PUT", payload);

"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getBackendApiUrl } from "@/lib/backendApiUrl";
import { getSeoContent } from "@/lib/seo/api";
import type { SeoContent, SeoContentType } from "@/types/seo";

export type ManagedContentType = "blog" | "review";

export type EditorContent = {
  id: string;
  title: string;
  slug: string | null;
  contentHtml: string | null;
  published: boolean;
  categoryId?: string;
  rating?: number;
};

export type ContentCategory = { id: string; name: string };

export type ContentRequestResult<T = Record<string, unknown>> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: Array<{ path?: string | number; message?: string }>;
};

const getAdminToken = async () => (await cookies()).get("accessToken")?.value;

const fetchApi = async <T>(
  path: string,
  method: "GET" | "POST" | "PUT",
  body?: unknown,
  authenticated = true,
): Promise<ContentRequestResult<T>> => {
  const token = authenticated ? await getAdminToken() : undefined;
  if (authenticated && !token) {
    return {
      ok: false,
      message: "Your session has expired. Sign in again to continue.",
      fieldErrors: {},
    };
  }

  let response: Response;
  try {
    response = await fetch(getBackendApiUrl(path), {
      method,
      headers: {
        ...(token ? { Authorization: token } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
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
        : `Network error while reaching backend API: ${error instanceof Error ? error.message : "Fetch failed"}`,
      fieldErrors: {},
    };
  }

  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`The content API returned an unreadable response (${response.status}).`);
  }

  if (!response.ok || result.success === false) {
    const fieldErrors: Record<string, string> = {};
    for (const error of result.error ?? []) {
      if (error.path !== undefined && error.message) {
        fieldErrors[String(error.path)] = error.message;
      }
    }
    return {
      ok: false,
      message: result.message ?? `Content request failed (${response.status}).`,
      fieldErrors,
    };
  }

  if (result.data === undefined) {
    throw new Error("The content API response did not include data.");
  }
  return { ok: true, data: result.data, message: result.message };
};

const editorType = (type: ManagedContentType): SeoContentType => type;

const asEditorContent = (content: SeoContent): EditorContent => ({
  id: content.id,
  title: content.title,
  slug: content.slug,
  contentHtml: content.contentHtml,
  published: content.published,
});

export const loadManagedContent = async (
  type: ManagedContentType,
  id: string,
): Promise<ContentRequestResult<EditorContent | null>> => {
  if (id === "new") return { ok: true, data: null };
  const result = await getSeoContent(editorType(type), id);
  if (!result.ok) return result;
  return { ok: true, data: asEditorContent(result.data) };
};

export const loadContentCategories = async (): Promise<
  ContentRequestResult<ContentCategory[]>
> => {
  const result = await fetchApi<
    ContentCategory[] | { data?: ContentCategory[] }
  >("/categories", "GET");
  if (!result.ok) return result;
  const categories = Array.isArray(result.data)
    ? result.data
    : result.data.data ?? [];
  return { ok: true, data: categories };
};

export type SaveManagedContentPayload = {
  title: string;
  slug: string;
  contentHtml: string;
  published: boolean;
  categoryId?: string;
  rating?: number;
};

export const saveManagedContent = async (
  type: ManagedContentType,
  id: string,
  payload: SaveManagedContentPayload,
): Promise<ContentRequestResult<{ id: string }>> => {
  const apiType = type === "blog" ? "blogPost" : "review";
  const creating = id === "new";
  const result = await fetchApi<{ id: string }>(
    creating
      ? `/admin/content/${apiType}`
      : `/admin/content/${apiType}/${encodeURIComponent(id)}`,
    creating ? "POST" : "PUT",
    payload,
  );

  if (result.ok) {
    revalidatePath("/blog");
    revalidatePath("/reviews");
    revalidatePath(`/${type}/${payload.slug}`);
    if (result.data.id) {
      revalidatePath(`/admin/${type}/${result.data.id}`);
    }
  }
  return result;
};

export const loadPublishedContent = async (
  type: ManagedContentType,
  slug: string,
): Promise<ContentRequestResult<EditorContent>> => {
  const apiType = type === "blog" ? "blogPost" : "review";
  return fetchApi<EditorContent>(
    `/content/${apiType}/${encodeURIComponent(slug)}`,
    "GET",
    undefined,
    false,
  );
};

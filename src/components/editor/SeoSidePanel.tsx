"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  parseSchemaJson,
  truncateGoogleText,
} from "@/lib/seo/editorValidation.mjs";

type ContentType = "blog" | "blogPost" | "review";
type Tab = "analysis" | "preview" | "schema" | "images";
type CheckStatus = "pass" | "warn" | "fail";
type SeoCheck = {
  id: string;
  status: CheckStatus;
  message: string;
  value: unknown;
};
type SchemaType =
  | "Organization"
  | "WebSite"
  | "Article"
  | "Review"
  | "Product"
  | "FAQPage"
  | "BreadcrumbList";
type ImageIssue = { type: string; reason: string };
type SeoImage = {
  id: string;
  url: string;
  alt: string | null;
  title: string | null;
  fileName: string | null;
  issues: ImageIssue[];
};
type SeoSidePanelProps = {
  type: ContentType;
  id: string;
  contentHtml: string;
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  baseUrl?: string;
  className?: string;
};
type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: Array<{ path?: string | number; message?: string }>;
};

const schemaTypes: Array<{ value: SchemaType; label: string }> = [
  { value: "Organization", label: "Organization" },
  { value: "WebSite", label: "WebSite" },
  { value: "Article", label: "Article" },
  { value: "Review", label: "Review" },
  { value: "Product", label: "Product" },
  { value: "FAQPage", label: "FAQPage" },
  { value: "BreadcrumbList", label: "BreadcrumbList" },
];

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "analysis", label: "Analysis" },
  { id: "preview", label: "Preview" },
  { id: "schema", label: "Schema" },
  { id: "images", label: "Images" },
];

const apiContentType = (type: ContentType) =>
  type === "blog" ? "blogPost" : type;

const fetchJson = async <T,>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  let result: ApiEnvelope<T>;
  try {
    result = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new Error(`The SEO service returned an unreadable response (${response.status}).`);
  }
  if (!response.ok || result.success === false) {
    const fieldReasons = (result.error ?? [])
      .map((item) => item.message)
      .filter((message): message is string => Boolean(message));
    throw new Error(
      [result.message, ...fieldReasons].filter(Boolean).join(": ") ||
        `Request failed (${response.status}).`,
    );
  }
  return result;
};

const prettyValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return JSON.stringify(value, null, 2);
};

const statusStyle: Record<CheckStatus, string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  fail: "border-rose-200 bg-rose-50 text-rose-900",
};

const StatusIcon = ({ status }: { status: CheckStatus }) => (
  <span
    aria-label={status}
    className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${statusStyle[status]}`}
  >
    {status === "pass" ? "✓" : status === "warn" ? "!" : "×"}
  </span>
);

const SeoSidePanel = ({
  type,
  id,
  contentHtml,
  title,
  slug,
  seoTitle,
  metaDescription,
  focusKeyword,
  baseUrl = "",
  className = "",
}: SeoSidePanelProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("analysis");
  const [analysis, setAnalysis] = useState<{ score: number; checks: SeoCheck[] } | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const analysisSequence = useRef(0);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [schemaJson, setSchemaJson] = useState("");
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaSaving, setSchemaSaving] = useState(false);
  const [schemaError, setSchemaError] = useState("");
  const [schemaSuccess, setSchemaSuccess] = useState("");
  const [images, setImages] = useState<SeoImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState("");
  const [imageSaving, setImageSaving] = useState<string | null>(null);
  const [imageMessages, setImageMessages] = useState<Record<string, string>>({});
  const [imageValues, setImageValues] = useState<
    Record<string, { alt: string; title: string; fileName: string }>
  >({});

  const requestPath = useMemo(
    () => `/api/editor/admin/${apiContentType(type)}/${encodeURIComponent(id)}`,
    [id, type],
  );
  const schemaPath = useMemo(
    () =>
      `/api/editor/admin/schema/${apiContentType(type)}/${encodeURIComponent(id)}`,
    [id, type],
  );
  const imagesPath = useMemo(
    () =>
      `/api/editor/admin/images/${apiContentType(type)}/${encodeURIComponent(id)}`,
    [id, type],
  );

  useEffect(() => {
    if (!id || id === "new") {
      setAnalysis(null);
      setAnalysisError("Save the content first to analyze or manage its schema and images.");
      return;
    }

    const controller = new AbortController();
    const sequence = ++analysisSequence.current;
    setAnalysisLoading(true);
    setAnalysisError("");
    const timer = setTimeout(() => {
      void fetchJson<{ score: number; checks: SeoCheck[] }>(
        "/api/editor/admin/seo/analyze",
        {
          method: "POST",
          body: JSON.stringify({
            html: contentHtml,
            seoTitle,
            metaDescription,
            slug,
            focusKeyword,
          }),
          signal: controller.signal,
        },
      )
        .then((result) => {
          if (sequence === analysisSequence.current && result.data) {
            setAnalysis(result.data);
          }
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted || sequence !== analysisSequence.current) return;
          setAnalysisError(
            error instanceof Error ? error.message : "Unable to analyze SEO content.",
          );
        })
        .finally(() => {
          if (sequence === analysisSequence.current) setAnalysisLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [contentHtml, focusKeyword, id, metaDescription, requestPath, seoTitle, slug]);

  const reloadImages = useCallback(async () => {
    if (!id || id === "new") return;
    setImagesLoading(true);
    setImagesError("");
    try {
      const result = await fetchJson<SeoImage[]>(imagesPath);
      setImages(result.data ?? []);
      setImageValues(
        Object.fromEntries(
          (result.data ?? []).map((image) => [
            image.id,
            {
              alt: image.alt ?? "",
              title: image.title ?? "",
              fileName: image.fileName ?? "",
            },
          ]),
        ),
      );
    } catch (error: unknown) {
      setImagesError(error instanceof Error ? error.message : "Unable to load images.");
    } finally {
      setImagesLoading(false);
    }
  }, [id, imagesPath]);

  useEffect(() => {
    if (activeTab === "images" && id && id !== "new" && images.length === 0) {
      void reloadImages();
    }
  }, [activeTab, id, images.length, reloadImages]);

  const generateSchema = async () => {
    setSchemaLoading(true);
    setSchemaError("");
    setSchemaSuccess("");
    try {
      const result = await fetchJson<{ schemaType: SchemaType; json: unknown }>(
        `${schemaPath}/generate?schemaType=${encodeURIComponent(schemaType)}`,
      );
      setSchemaJson(JSON.stringify(result.data?.json ?? {}, null, 2));
    } catch (error: unknown) {
      setSchemaError(error instanceof Error ? error.message : "Unable to generate schema.");
    } finally {
      setSchemaLoading(false);
    }
  };

  const saveSchema = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSchemaError("");
    setSchemaSuccess("");
    let parsedSchema: unknown;
    try {
      parsedSchema = parseSchemaJson(schemaJson);
    } catch (error: unknown) {
      const reason =
        error instanceof Error ? error.message : "The JSON could not be parsed.";
      setSchemaError(`Invalid JSON: ${reason}`);
      return;
    }

    setSchemaSaving(true);
    try {
      await fetchJson(schemaPath, {
        method: "PUT",
        body: JSON.stringify({ schemaType, json: parsedSchema }),
      });
      setSchemaSuccess("Schema saved successfully.");
    } catch (error: unknown) {
      setSchemaError(error instanceof Error ? error.message : "Unable to save schema.");
    } finally {
      setSchemaSaving(false);
    }
  };

  const saveImage = async (image: SeoImage) => {
    const values = imageValues[image.id];
    if (!values) return;
    setImageSaving(image.id);
    setImageMessages((current) => ({ ...current, [image.id]: "" }));
    try {
      await fetchJson(`/api/editor/admin/images/${encodeURIComponent(image.id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          alt: values.alt.trim() || null,
          title: values.title.trim() || null,
          fileName: values.fileName.trim() || null,
        }),
      });
      setImageMessages((current) => ({
        ...current,
        [image.id]: "Image metadata saved.",
      }));
      await reloadImages();
    } catch (error: unknown) {
      setImageMessages((current) => ({
        ...current,
        [image.id]: error instanceof Error ? error.message : "Unable to save image metadata.",
      }));
    } finally {
      setImageSaving(null);
    }
  };

  const updateImageField = (
    imageId: string,
    field: "alt" | "title" | "fileName",
    value: string,
  ) => {
    setImageValues((current) => ({
      ...current,
      [imageId]: { ...current[imageId], [field]: value },
    }));
  };

  const resultTitle = seoTitle.trim() || title.trim() || "Page title";
  const fullUrl = `${(baseUrl || "https://example.com").replace(/\/+$/, "")}/${slug.replace(/^\/+/, "")}`;
  const displayUrl = (fullUrl || slug || "example.com").replace(/^https?:\/\//, "");
  const resultDescription =
    metaDescription.trim() || "Add a meta description to preview how this page may appear in search results.";

  return (
    <section className={`min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div
        role="tablist"
        aria-label="SEO tools"
        className="flex min-w-0 gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 p-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`seo-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`seo-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`seo-panel-${activeTab}`}
        aria-labelledby={`seo-tab-${activeTab}`}
        className="max-h-[70vh] min-w-0 overflow-y-auto p-3 sm:p-4"
      >
        {activeTab === "analysis" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                role="img"
                aria-label={`SEO score: ${analysis?.score ?? 0} out of 100`}
                className={`flex size-20 shrink-0 items-center justify-center rounded-full border-[7px] text-xl font-bold ${
                  (analysis?.score ?? 0) >= 80
                    ? "border-emerald-400 text-emerald-700"
                    : (analysis?.score ?? 0) >= 50
                      ? "border-amber-400 text-amber-700"
                      : "border-rose-400 text-rose-700"
                }`}
              >
                {analysisLoading && !analysis ? "…" : analysis?.score ?? 0}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">SEO score <span className="text-sm font-normal text-slate-500">/ 100</span></p>
                <p aria-live="polite" className="mt-1 text-xs text-slate-500">
                  {analysisLoading ? "Updating analysis…" : "Analysis updates as content changes."}
                </p>
              </div>
            </div>
            {analysisError && (
              <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {analysisError}
              </p>
            )}
            {analysis?.checks.length ? (
              <ul className="space-y-2">
                {analysis.checks.map((check) => (
                  <li
                    key={check.id}
                    className="flex min-w-0 items-start gap-2 rounded-lg border border-slate-200 p-3"
                  >
                    <StatusIcon status={check.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 text-slate-800">{check.message}</p>
                      <pre className="mt-1 whitespace-pre-wrap break-words font-sans text-xs text-slate-500">
                        Value: {prettyValue(check.value)}
                      </pre>
                    </div>
                  </li>
                ))}
              </ul>
            ) : !analysisError ? (
              <p className="text-sm text-slate-500">Analysis will appear when content is ready.</p>
            ) : null}
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-4">
            <div className="flex gap-2" aria-label="Preview size">
              {(["desktop", "mobile"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={previewMode === mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                    previewMode === mode
                      ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                      : "border-slate-300 text-slate-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className={`mx-auto min-w-0 rounded-xl border border-slate-200 bg-white p-4 ${
              previewMode === "mobile" ? "max-w-[320px]" : "max-w-full"
            }`}>
              <p className="truncate text-xs text-emerald-800">
                {truncateGoogleText(displayUrl, 75)}
              </p>
              <h3 className="mt-1 break-words text-xl leading-6 text-[#1a0dab]">
                {truncateGoogleText(resultTitle, 60)}
              </h3>
              <p className="mt-1 break-words text-sm leading-5 text-[#4d5156]">
                {truncateGoogleText(resultDescription, 160)}
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Preview is an estimate; search engines may choose different text.
            </p>
          </div>
        )}

        {activeTab === "schema" && (
          <form onSubmit={saveSchema} className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Schema type</span>
              <select
                value={schemaType}
                onChange={(event) => setSchemaType(event.target.value as SchemaType)}
                className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {schemaTypes.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={schemaLoading || id === "new"}
              onClick={() => void generateSchema()}
              className="w-full rounded-lg border border-indigo-300 px-3 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
            >
              {schemaLoading ? "Generating…" : "Generate"}
            </button>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">JSON-LD JSON</span>
              <textarea
                value={schemaJson}
                onChange={(event) => {
                  setSchemaJson(event.target.value);
                  setSchemaError("");
                  setSchemaSuccess("");
                }}
                rows={14}
                spellCheck={false}
                placeholder={'{\n  "@context": "https://schema.org"\n}'}
                className="w-full min-w-0 resize-y rounded-lg border border-slate-300 p-3 font-mono text-xs leading-5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                aria-label="Schema JSON editor"
              />
            </label>
            {schemaError && (
              <p role="alert" className="break-words rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                {schemaError}
              </p>
            )}
            {schemaSuccess && (
              <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                {schemaSuccess}
              </p>
            )}
            <button
              type="submit"
              disabled={schemaSaving || !schemaJson.trim() || id === "new"}
              className="w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {schemaSaving ? "Saving…" : "Save schema"}
            </button>
          </form>
        )}

        {activeTab === "images" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800">Content images</h3>
              <button
                type="button"
                onClick={() => void reloadImages()}
                disabled={imagesLoading || id === "new"}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
            {imagesLoading && <p role="status" className="text-sm text-slate-500">Loading images…</p>}
            {imagesError && <p role="alert" className="break-words rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{imagesError}</p>}
            {!imagesLoading && !imagesError && images.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No embedded content images were found.
              </p>
            )}
            <div className="space-y-3">
              {images.map((image) => {
                const values = imageValues[image.id] ?? {
                  alt: image.alt ?? "",
                  title: image.title ?? "",
                  fileName: image.fileName ?? "",
                };
                return (
                  <article key={image.id} className="min-w-0 rounded-xl border border-slate-200 p-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <Image
                        src={image.url}
                        alt={values.alt}
                        width={64}
                        height={64}
                        unoptimized
                        className="size-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="break-all text-xs text-slate-500">{image.url}</p>
                        {image.issues.length > 0 ? (
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {image.issues.map((issue, index) => (
                              <li
                                key={`${issue.type}-${index}`}
                                title={issue.reason}
                                className="max-w-full break-words rounded-full bg-amber-50 px-2 py-1 text-[11px] text-amber-900"
                              >
                                {issue.type.replaceAll("-", " ")}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-800">
                            No image issues
                          </span>
                        )}
                        {image.issues.length > 0 && (
                          <ul className="mt-1 space-y-1 text-xs text-slate-600">
                            {image.issues.map((issue, index) => (
                              <li key={`${issue.type}-reason-${index}`}>{issue.reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {([
                        ["alt", "Alt text"],
                        ["title", "Title"],
                        ["fileName", "File name"],
                      ] as const).map(([field, label]) => (
                        <label key={field} className="block min-w-0">
                          <span className="mb-1 block text-xs font-medium text-slate-700">{label}</span>
                          <input
                            value={values[field]}
                            onChange={(event) => updateImageField(image.id, field, event.target.value)}
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />
                        </label>
                      ))}
                    </div>
                    {imageMessages[image.id] && (
                      <p
                        role="status"
                        className={`mt-2 break-words text-xs ${
                          imageMessages[image.id].includes("saved")
                            ? "text-emerald-700"
                            : "text-rose-700"
                        }`}
                      >
                        {imageMessages[image.id]}
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={imageSaving === image.id}
                      onClick={() => void saveImage(image)}
                      className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {imageSaving === image.id ? "Saving…" : "Save image"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SeoSidePanel;

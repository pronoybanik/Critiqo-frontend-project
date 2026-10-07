"use client";

import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { z } from "zod";
import {
  analyzeSeoContent,
  generateSchemaMarkup,
  getContentImages,
  getSeoContent,
  saveSchemaMarkup,
  updateContentImage,
  updateSeoContent,
  type SeoAnalysis,
  type SeoImageItem,
} from "@/lib/seo/api";
import { parseSchemaJson, truncateGoogleText } from "@/lib/seo/editorValidation.mjs";
import type { SeoContentType, SeoUpdatePayload } from "@/types/seo";

type SchemaType =
  | "Organization"
  | "WebSite"
  | "Article"
  | "Review"
  | "Product"
  | "FAQPage"
  | "BreadcrumbList";

const schemaTypes: Array<{ value: SchemaType; label: string }> = [
  { value: "Organization", label: "Organization" },
  { value: "WebSite", label: "WebSite" },
  { value: "Article", label: "Article" },
  { value: "Review", label: "Review" },
  { value: "Product", label: "Product" },
  { value: "FAQPage", label: "FAQPage" },
  { value: "BreadcrumbList", label: "BreadcrumbList" },
];

const seoFormSchema = z.object({
  seoTitle: z.string().max(60, "SEO title must be 60 characters or fewer"),
  metaDescription: z.string().max(160, "Description must be 160 characters or fewer"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens"),
  focusKeyword: z.string(),
  canonicalUrl: z.string().refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Enter a valid HTTP or HTTPS URL",
  ),
  noindex: z.boolean(),
  ogTitle: z.string().max(60, "Open Graph title must be 60 characters or fewer"),
  ogDescription: z.string().max(160, "Open Graph description must be 160 characters or fewer"),
  ogImage: z.string().refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Enter a valid HTTP or HTTPS URL",
  ),
  twitterTitle: z.string().max(60, "Twitter title must be 60 characters or fewer"),
  twitterDescription: z.string().max(160, "Twitter description must be 160 characters or fewer"),
  twitterImage: z.string().refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Enter a valid HTTP or HTTPS URL",
  ),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

const fields: Array<{
  name: Exclude<FieldPath<SeoFormValues>, "noindex">;
  label: string;
  section: string;
  multiline?: boolean;
  counter?: number;
  placeholder?: string;
}> = [
  { name: "seoTitle", label: "SEO title", section: "Search metadata", counter: 60 },
  { name: "metaDescription", label: "Meta description", section: "Search metadata", multiline: true, counter: 160 },
  { name: "slug", label: "URL slug", section: "Search metadata", placeholder: "lowercase-words-separated-by-hyphens" },
  { name: "focusKeyword", label: "Focus keyword", section: "Search metadata" },
  { name: "canonicalUrl", label: "Canonical URL", section: "Search metadata", placeholder: "https://example.com/page" },
  { name: "ogTitle", label: "Open Graph title", section: "Open Graph", counter: 60 },
  { name: "ogDescription", label: "Open Graph description", section: "Open Graph", multiline: true, counter: 160 },
  { name: "ogImage", label: "Open Graph image URL", section: "Open Graph", placeholder: "https://example.com/image.jpg" },
  { name: "twitterTitle", label: "Twitter card title", section: "Twitter card", counter: 60 },
  { name: "twitterDescription", label: "Twitter card description", section: "Twitter card", multiline: true, counter: 160 },
  { name: "twitterImage", label: "Twitter card image URL", section: "Twitter card", placeholder: "https://example.com/image.jpg" },
];

const optionalValue = (value: string) => value.trim() || null;
const validTypes: SeoContentType[] = ["page", "blog", "review"];
const checkLabels: Record<string, string> = {
  "keyword-density": "Keyword density",
  "word-count": "Word count",
  "keyword-placement": "Keyword placement",
  headings: "Headings",
  links: "Links",
  "title-length": "Title length",
  "description-length": "Description length",
  "paragraph-length": "Paragraph length",
};
const checkOrder = [
  "keyword-density",
  "word-count",
  "keyword-placement",
  "headings",
  "links",
  "title-length",
  "description-length",
  "paragraph-length",
];
const checkStatusClass = {
  pass: "text-emerald-700",
  warn: "text-amber-700",
  fail: "text-rose-700",
} as const;

const SeoContentForm = () => {
  const params = useParams<{ type: string; id: string }>();
  const type = params.type as SeoContentType;
  const id = params.id;
  const [contentTitle, setContentTitle] = useState("");
  const [savedContentHtml, setSavedContentHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  
  // Analysis State
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const analysisSequence = useRef(0);

  // Preview Mode
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Schema Markup State
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [schemaJson, setSchemaJson] = useState("");
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaSaving, setSchemaSaving] = useState(false);
  const [schemaError, setSchemaError] = useState("");
  const [schemaSuccess, setSchemaSuccess] = useState("");

  // Content Images State
  const [images, setImages] = useState<SeoImageItem[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState("");
  const [imageSaving, setImageSaving] = useState<string | null>(null);
  const [imageMessages, setImageMessages] = useState<Record<string, string>>({});
  const [imageValues, setImageValues] = useState<
    Record<string, { alt: string; title: string; fileName: string }>
  >({});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      seoTitle: "",
      metaDescription: "",
      slug: "",
      focusKeyword: "",
      canonicalUrl: "",
      noindex: false,
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
    },
  });
  const watchedValues = watch();

  const reloadImages = useCallback(async () => {
    if (!id || !validTypes.includes(type)) return;
    setImagesLoading(true);
    setImagesError("");
    try {
      const result = await getContentImages(type, id);
      if (result.ok) {
        setImages(result.data);
        setImageValues(
          Object.fromEntries(
            result.data.map((image) => [
              image.id,
              {
                alt: image.alt ?? "",
                title: image.title ?? "",
                fileName: image.fileName ?? "",
              },
            ]),
          ),
        );
      } else {
        setImagesError(result.message);
      }
    } catch (error: unknown) {
      setImagesError(error instanceof Error ? error.message : "Unable to load images.");
    } finally {
      setImagesLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    let isMounted = true;
    if (!validTypes.includes(type) || !id) {
      setLoadError("This content type or ID is not valid.");
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    getSeoContent(type, id)
      .then((result) => {
        if (!isMounted) return;
        if (!result.ok) {
          setLoadError(result.message);
          return;
        }

        const item = result.data;
        setContentTitle(item.title);
        setSavedContentHtml(item.contentHtml);
        reset({
          seoTitle: item.seoMeta?.seoTitle ?? "",
          metaDescription: item.seoMeta?.metaDescription ?? "",
          slug: item.seoMeta?.slug ?? item.slug ?? "",
          focusKeyword: item.seoMeta?.focusKeyword ?? "",
          canonicalUrl: item.seoMeta?.canonicalUrl ?? "",
          noindex: item.seoMeta?.noindex ?? false,
          ogTitle: item.seoMeta?.ogTitle ?? "",
          ogDescription: item.seoMeta?.ogDescription ?? "",
          ogImage: item.seoMeta?.ogImage ?? "",
          twitterTitle: item.seoMeta?.twitterTitle ?? "",
          twitterDescription: item.seoMeta?.twitterDescription ?? "",
          twitterImage: item.seoMeta?.twitterImage ?? "",
        });

        if (item.schemaMarkups && item.schemaMarkups.length > 0) {
          const firstSchema = item.schemaMarkups[0];
          if (firstSchema?.type && schemaTypes.some((s) => s.value === firstSchema.type)) {
            setSchemaType(firstSchema.type as SchemaType);
          }
          if (firstSchema?.json) {
            setSchemaJson(JSON.stringify(firstSchema.json, null, 2));
          }
        }

        if (item.contentImages && item.contentImages.length > 0) {
          setImages(item.contentImages);
          setImageValues(
            Object.fromEntries(
              item.contentImages.map((image) => [
                image.id,
                {
                  alt: image.alt ?? "",
                  title: image.title ?? "",
                  fileName: image.fileName ?? "",
                },
              ]),
            ),
          );
        }
      })
      .catch((reason: unknown) => {
        if (isMounted) {
          setLoadError(reason instanceof Error ? reason.message : "Unable to load SEO data.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, reset, type]);

  const runSeoAnalysis = async (
    values: Pick<
      SeoFormValues,
      "seoTitle" | "metaDescription" | "slug" | "focusKeyword"
    >,
  ) => {
    const sequence = ++analysisSequence.current;
    setAnalysisLoading(true);
    setAnalysisError("");
    try {
      const result = await analyzeSeoContent({
        html: savedContentHtml ?? "",
        seoTitle: values.seoTitle.trim(),
        metaDescription: values.metaDescription.trim(),
        slug: values.slug.trim(),
        focusKeyword: values.focusKeyword.trim(),
      });
      if (sequence !== analysisSequence.current) return;
      if (!result.ok) {
        setAnalysisError(result.message);
        return;
      }
      setAnalysis(result.data);
    } catch (reason: unknown) {
      if (sequence === analysisSequence.current) {
        setAnalysisError(
          reason instanceof Error ? reason.message : "Unable to calculate the SEO score.",
        );
      }
    } finally {
      if (sequence === analysisSequence.current) setAnalysisLoading(false);
    }
  };

  const handleGenerateSchema = async () => {
    setSchemaLoading(true);
    setSchemaError("");
    setSchemaSuccess("");
    try {
      const result = await generateSchemaMarkup(type, id, schemaType);
      if (result.ok && result.data) {
        setSchemaJson(JSON.stringify(result.data.json ?? {}, null, 2));
        setSchemaSuccess("Schema JSON generated successfully.");
      } else if (!result.ok) {
        setSchemaError(result.message);
      }
    } catch (error: unknown) {
      setSchemaError(error instanceof Error ? error.message : "Unable to generate schema.");
    } finally {
      setSchemaLoading(false);
    }
  };

  const handleSaveSchema = async (event: FormEvent<HTMLFormElement>) => {
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
      const result = await saveSchemaMarkup(type, id, schemaType, parsedSchema);
      if (result.ok) {
        setSchemaSuccess("Schema markup saved successfully.");
      } else {
        setSchemaError(result.message);
      }
    } catch (error: unknown) {
      setSchemaError(error instanceof Error ? error.message : "Unable to save schema.");
    } finally {
      setSchemaSaving(false);
    }
  };

  const handleSaveImage = async (image: SeoImageItem) => {
    const values = imageValues[image.id];
    if (!values) return;
    setImageSaving(image.id);
    setImageMessages((current) => ({ ...current, [image.id]: "" }));
    try {
      const result = await updateContentImage(image.id, {
        alt: values.alt.trim() || null,
        title: values.title.trim() || null,
        fileName: values.fileName.trim() || null,
      });
      if (result.ok) {
        setImageMessages((current) => ({
          ...current,
          [image.id]: "Image metadata saved.",
        }));
        await reloadImages();
      } else {
        setImageMessages((current) => ({
          ...current,
          [image.id]: result.message,
        }));
      }
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

  const onSubmit = async (values: SeoFormValues) => {
    setSuccess("");
    const payload: SeoUpdatePayload = {
      seoTitle: optionalValue(values.seoTitle),
      metaDescription: optionalValue(values.metaDescription),
      slug: values.slug.trim(),
      focusKeyword: optionalValue(values.focusKeyword),
      canonicalUrl: optionalValue(values.canonicalUrl),
      noindex: values.noindex,
      ogTitle: optionalValue(values.ogTitle),
      ogDescription: optionalValue(values.ogDescription),
      ogImage: optionalValue(values.ogImage),
      twitterTitle: optionalValue(values.twitterTitle),
      twitterDescription: optionalValue(values.twitterDescription),
      twitterImage: optionalValue(values.twitterImage),
    };

    let result;
    try {
      result = await updateSeoContent(type, id, payload);
    } catch (reason: unknown) {
      setLoadError(
        reason instanceof Error ? reason.message : "Unable to save SEO settings.",
      );
      return;
    }
    if (!result.ok) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        const knownField = fields.find((candidate) => candidate.name === field)?.name ??
          (field === "noindex" ? "noindex" : undefined);
        if (knownField) {
          setError(knownField, { type: "server", message });
        }
      }
      setLoadError(result.message);
      return;
    }

    setLoadError("");
    setSuccess("SEO settings saved successfully.");
    void runSeoAnalysis({
      seoTitle: payload.seoTitle ?? "",
      metaDescription: payload.metaDescription ?? "",
      slug: payload.slug,
      focusKeyword: payload.focusKeyword ?? "",
    });
  };

  const previewTitle = watchedValues.seoTitle.trim() || contentTitle || "Page Title";
  const previewSlug = watchedValues.slug.trim() || "page-slug";
  const previewDescription =
    watchedValues.metaDescription.trim() ||
    "Add a meta description to preview how this content will appear in search engine result pages.";
  const previewUrl = `https://critiqo.com/${previewSlug}`;

  if (isLoading) {
    return (
      <div role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Loading SEO management panel…
      </div>
    );
  }

  if (loadError && !contentTitle) {
    return (
      <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        {loadError}
      </div>
    );
  }

  const sections = ["Search metadata", "Open Graph", "Twitter card"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin/seo" className="text-sm font-medium text-indigo-700 hover:underline">
            ← Back to SEO Content List
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="break-words text-2xl font-bold text-slate-900">{contentTitle}</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
              {type}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Manage search metadata, Google preview, schema JSON-LD, content images, and SEO score calculations.
          </p>
        </div>
        <button
          type="submit"
          form="seo-metadata-form"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Saving…" : "Save SEO Settings"}
        </button>
      </div>

      {loadError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800">
          {loadError}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
          {success}
        </p>
      )}

      {/* Google Search Result Preview */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Google Search Preview</h2>
            <p className="text-xs text-slate-500">Live preview of how search engines display your snippet.</p>
          </div>
          <div className="flex rounded-lg border border-slate-200 p-1" aria-label="Preview view mode">
            {(["desktop", "mobile"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={previewMode === mode}
                onClick={() => setPreviewMode(mode)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
                  previewMode === mode
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs ${
          previewMode === "mobile" ? "max-w-md mx-auto" : "w-full"
        }`}>
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              C
            </div>
            <div className="min-w-0 flex-1 truncate text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Critiqo</span>
              <span className="ml-1 text-slate-400">›</span>
              <span className="ml-1 text-slate-600 truncate">{truncateGoogleText(previewUrl, 60)}</span>
            </div>
          </div>
          <h3 className="mt-1.5 break-words text-lg font-medium leading-snug text-[#1a0dab] hover:underline">
            {truncateGoogleText(previewTitle, 60)}
          </h3>
          <p className="mt-1 break-words text-sm leading-relaxed text-[#4d5156]">
            {truncateGoogleText(previewDescription, 160)}
          </p>
        </div>
      </section>

      {/* SEO Metadata Form */}
      <form id="seo-metadata-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {sections.map((section) => (
          <section key={section} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">{section}</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              {fields
                .filter((field) => field.section === section)
                .map((field) => {
                  const fieldError = errors[field.name]?.message;
                  const characterCount = watchedValues[field.name]?.length ?? 0;
                  return (
                    <label key={field.name} className={`block min-w-0 ${field.multiline ? "sm:col-span-2" : ""}`}>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">{field.label}</span>
                      {field.multiline ? (
                        <textarea
                          {...register(field.name)}
                          rows={3}
                          maxLength={field.counter}
                          placeholder={field.placeholder}
                          aria-invalid={Boolean(fieldError)}
                          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
                        />
                      ) : (
                        <input
                          {...register(field.name)}
                          maxLength={field.counter}
                          placeholder={field.placeholder}
                          aria-invalid={Boolean(fieldError)}
                          className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
                        />
                      )}
                      <div className="mt-1 flex justify-between gap-2 text-xs">
                        {fieldError ? (
                          <span className="text-rose-700">{fieldError}</span>
                        ) : <span />}
                        {field.counter && (
                          <span className="shrink-0 text-slate-500">{characterCount}/{field.counter}</span>
                        )}
                      </div>
                    </label>
                  );
                })}
            </div>
          </section>
        ))}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              {...register("noindex")}
              className="mt-0.5 size-4 rounded border-slate-300 accent-indigo-600"
            />
            <span>
              <span className="block text-sm font-medium text-slate-800">Noindex this content</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Ask search engines not to include this page in search results.
              </span>
              {errors.noindex?.message && (
                <span className="mt-1 block text-xs text-rose-700">{errors.noindex.message}</span>
              )}
            </span>
          </label>
        </section>
      </form>

      {/* SEO Score Check & Detailed Analysis */}
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">SEO Score & Analysis</h2>
            <p className="text-xs text-slate-500">Evaluate content against search engine guidelines.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              void runSeoAnalysis({
                seoTitle: watchedValues.seoTitle,
                metaDescription: watchedValues.metaDescription,
                slug: watchedValues.slug,
                focusKeyword: watchedValues.focusKeyword,
              })
            }
            disabled={analysisLoading || isSubmitting}
            className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 border border-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analysisLoading ? "Checking score…" : "Check score"}
          </button>
        </div>

        {analysis ? (
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div
              className={`flex size-20 shrink-0 items-center justify-center rounded-full border-4 text-2xl font-bold ${
                analysis.score < 50
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : analysis.score < 80
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-emerald-400 bg-emerald-50 text-emerald-700"
              }`}
            >
              {analysis.score}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                SEO Score: <span className="font-bold">{analysis.score} / 100</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {analysis.score >= 80
                  ? "Excellent! Your content metadata meets standard SEO recommendations."
                  : analysis.score >= 50
                    ? "Good start. Review the highlighted warnings below for further optimization."
                    : "Action required. Address the failing checks below to improve search visibility."}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 break-words text-sm text-slate-600">
            Click &quot;Check score&quot; to calculate the SEO score for this content.
          </p>
        )}

        {analysisError && (
          <p role="alert" className="mt-3 break-words rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {analysisError}
          </p>
        )}

        {analysis && (
          <div className="mt-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">SEO Check Audit Breakdown</h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {checkOrder.map((checkId) => {
                const check = analysis.checks.find((item) => item.id === checkId);
                if (!check) return null;
                return (
                  <li
                    key={check.id}
                    className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm bg-white"
                  >
                    <span
                      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        check.status === "pass"
                          ? "bg-emerald-100 text-emerald-800"
                          : check.status === "warn"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {check.status === "pass" ? "✓" : check.status === "warn" ? "!" : "×"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-900">{checkLabels[check.id]}</span>
                        <span className={`text-xs font-semibold capitalize ${checkStatusClass[check.status]}`}>
                          {check.status}
                        </span>
                      </div>
                      <p className="mt-1 break-words text-xs text-slate-600">{check.message}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Schema Markup Management */}
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">Schema Markup (JSON-LD)</h2>
        <p className="text-xs text-slate-500">Manage structured data for rich snippet search results.</p>

        <form onSubmit={handleSaveSchema} className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[180px] flex-1">
              <label className="block text-xs font-medium text-slate-700">Schema Type</label>
              <select
                value={schemaType}
                onChange={(event) => setSchemaType(event.target.value as SchemaType)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {schemaTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={schemaLoading}
              onClick={() => void handleGenerateSchema()}
              className="mt-5 rounded-lg border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
            >
              {schemaLoading ? "Generating…" : "Generate Schema"}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">JSON-LD Data</label>
            <textarea
              value={schemaJson}
              onChange={(event) => {
                setSchemaJson(event.target.value);
                setSchemaError("");
                setSchemaSuccess("");
              }}
              rows={10}
              spellCheck={false}
              placeholder={'{\n  "@context": "https://schema.org"\n}'}
              className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs leading-relaxed outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {schemaError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              {schemaError}
            </p>
          )}
          {schemaSuccess && (
            <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              {schemaSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={schemaSaving || !schemaJson.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {schemaSaving ? "Saving Schema…" : "Save Schema Markup"}
          </button>
        </form>
      </section>

      {/* Content Images Audit & Metadata */}
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Content Images & Alt Metadata</h2>
            <p className="text-xs text-slate-500">Audit image alt attributes and filenames for image SEO.</p>
          </div>
          <button
            type="button"
            onClick={() => void reloadImages()}
            disabled={imagesLoading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {imagesLoading ? "Refreshing…" : "Refresh Images"}
          </button>
        </div>

        {imagesError && (
          <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {imagesError}
          </p>
        )}

        {!imagesLoading && !imagesError && images.length === 0 && (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
            No embedded content images were found for this item.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {images.map((image) => {
            const values = imageValues[image.id] ?? {
              alt: image.alt ?? "",
              title: image.title ?? "",
              fileName: image.fileName ?? "",
            };
            return (
              <div key={image.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <div className="flex flex-wrap items-start gap-4">
                  <Image
                    src={image.url}
                    alt={values.alt || "Content image"}
                    width={72}
                    height={72}
                    unoptimized
                    className="size-18 shrink-0 rounded-lg border border-slate-200 object-cover bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-xs font-mono text-slate-500">{image.url}</p>
                    {image.issues && image.issues.length > 0 ? (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {image.issues.map((issue, index) => (
                          <li
                            key={`${issue.type}-${index}`}
                            title={issue.reason}
                            className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                          >
                            {issue.type.replaceAll("-", " ")}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        No image issues detected
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="block min-w-0">
                    <span className="mb-1 block text-xs font-medium text-slate-700">Alt text</span>
                    <input
                      value={values.alt}
                      onChange={(event) => updateImageField(image.id, "alt", event.target.value)}
                      placeholder="Descriptive alt text"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-xs font-medium text-slate-700">Title attribute</span>
                    <input
                      value={values.title}
                      onChange={(event) => updateImageField(image.id, "title", event.target.value)}
                      placeholder="Image title"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-xs font-medium text-slate-700">File name</span>
                    <input
                      value={values.fileName}
                      onChange={(event) => updateImageField(image.id, "fileName", event.target.value)}
                      placeholder="image-filename.jpg"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>
                </div>

                {imageMessages[image.id] && (
                  <p
                    role="status"
                    className={`mt-2 text-xs font-medium ${
                      imageMessages[image.id].includes("saved") ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {imageMessages[image.id]}
                  </p>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    disabled={imageSaving === image.id}
                    onClick={() => void handleSaveImage(image)}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {imageSaving === image.id ? "Saving…" : "Save Image Metadata"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SeoContentForm;

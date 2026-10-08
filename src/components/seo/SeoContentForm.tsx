"use client";

import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Globe,
  Share2,
  Twitter,
  Eye,
  BarChart3,
  Code,
  ImageIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sparkles,
  Smartphone,
  Monitor,
  ChevronUp,
  Tag,
  Link2,
  Loader2,
} from "lucide-react";
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
  pass: "text-emerald-700 bg-emerald-50 border-emerald-200",
  warn: "text-amber-700 bg-amber-50 border-amber-200",
  fail: "text-rose-700 bg-rose-50 border-rose-200",
} as const;

const NAV_TABS = [
  {
    id: "metadata",
    label: "Search Metadata",
    icon: Globe,
    description: "Primary title, URL slug, description, focus keywords & indexing directives.",
  },
  {
    id: "og",
    label: "Open Graph",
    icon: Share2,
    description: "Meta tags for Facebook, LinkedIn, Discord, and messaging apps.",
  },
  {
    id: "twitter",
    label: "Twitter Card",
    icon: Twitter,
    description: "Card metadata tailored for X / Twitter posts.",
  },
  {
    id: "preview",
    label: "Google SERP",
    icon: Eye,
    description: "Interactive live preview of how your page appears in Google search results.",
  },
  {
    id: "audit",
    label: "SEO Audit",
    icon: BarChart3,
    description: "Algorithmic audit check against title, description, headings, and keyword density.",
  },
  {
    id: "schema",
    label: "Schema JSON-LD",
    icon: Code,
    description: "Structured data microdata generator and JSON-LD code editor.",
  },
  {
    id: "images",
    label: "Content Images",
    icon: ImageIcon,
    description: "Audit embedded images for missing alt tags, titles, and descriptive filenames.",
  },
] as const;

const SeoContentForm = () => {
  const params = useParams<{ type: string; id: string }>();
  const type = params.type as SeoContentType;
  const id = params.id;
  const [contentTitle, setContentTitle] = useState("");
  const [savedContentHtml, setSavedContentHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<string>("metadata");
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Handle Scroll to Top Button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const onInvalid = (formErrors: FieldErrors<SeoFormValues>) => {
    if (
      formErrors.seoTitle ||
      formErrors.metaDescription ||
      formErrors.slug ||
      formErrors.focusKeyword ||
      formErrors.canonicalUrl ||
      formErrors.noindex
    ) {
      setActiveTab("metadata");
    } else if (formErrors.ogTitle || formErrors.ogDescription || formErrors.ogImage) {
      setActiveTab("og");
    } else if (formErrors.twitterTitle || formErrors.twitterDescription || formErrors.twitterImage) {
      setActiveTab("twitter");
    }
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
        if (field in seoFormSchema.shape || field === "noindex") {
          setError(field as keyof SeoFormValues, { type: "server", message });
        }
      }
      setLoadError(result.message);
      onInvalid(errors);
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

  const currentTabObj = NAV_TABS.find((t) => t.id === activeTab) || NAV_TABS[0];
  const activeTabIdx = NAV_TABS.findIndex((t) => t.id === activeTab);

  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm text-sm text-slate-600">
        <div className="flex items-center gap-3 font-medium">
          <Loader2 className="size-6 animate-spin text-indigo-600" />
          Loading SEO management panel…
        </div>
      </div>
    );
  }

  if (loadError && !contentTitle) {
    return (
      <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">
        <AlertTriangle className="size-5 shrink-0 text-rose-600" />
        <div>
          <h3 className="font-semibold text-rose-900">Error Loading Content</h3>
          <p className="mt-1">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-6 pb-20 scroll-smooth">
      {/* Header Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <ArrowLeft className="size-3.5" /> Back to SEO List
            </Link>
            <div className="mt-1.5 flex items-center gap-3">
              <h1 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {contentTitle}
              </h1>
              <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-semibold capitalize text-indigo-700">
                {type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                handleTabChange("audit");
                void runSeoAnalysis({
                  seoTitle: watchedValues.seoTitle,
                  metaDescription: watchedValues.metaDescription,
                  slug: watchedValues.slug,
                  focusKeyword: watchedValues.focusKeyword,
                });
              }}
              disabled={analysisLoading || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className={`size-4 text-amber-500 ${analysisLoading ? "animate-spin" : ""}`} />
              {analysisLoading ? "Checking Score…" : "Check Score"}
            </button>
            {["metadata", "og", "twitter"].includes(activeTab) && (
              <button
                type="submit"
                form="seo-metadata-form"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save SEO Settings
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tab Header Buttons */}
        <div className="mt-5 flex gap-2 overflow-x-auto border-t border-slate-100 pt-3 pb-1 scrollbar-none">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasError =
              (tab.id === "metadata" &&
                Boolean(
                  errors.seoTitle ||
                    errors.metaDescription ||
                    errors.slug ||
                    errors.focusKeyword ||
                    errors.canonicalUrl ||
                    errors.noindex,
                )) ||
              (tab.id === "og" &&
                Boolean(errors.ogTitle || errors.ogDescription || errors.ogImage)) ||
              (tab.id === "twitter" &&
                Boolean(errors.twitterTitle || errors.twitterDescription || errors.twitterImage));

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`relative inline-flex items-center gap-2 shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {hasError && (
                  <span
                    className="size-2 rounded-full bg-rose-500 animate-pulse"
                    title="Validation error in this tab"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs">
        <div className="flex items-center gap-2.5 text-indigo-900">
          <currentTabObj.icon className="size-4 text-indigo-600 shrink-0" />
          <span className="font-bold">{currentTabObj.label}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{currentTabObj.description}</span>
        </div>
        <span className="rounded-md bg-indigo-100/80 px-2.5 py-1 font-mono font-bold text-indigo-700">
          Tab {activeTabIdx + 1} of {NAV_TABS.length}
        </span>
      </div>

      {/* Top Feedback Messages */}
      {loadError && (
        <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertTriangle className="size-5 shrink-0 text-rose-600" />
          <span>{loadError}</span>
        </div>
      )}
      {success && (
        <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form Container for Form Tabs */}
      <form id="seo-metadata-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        {/* SECTION 1: Core Search Metadata */}
        <section
          id="metadata"
          className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
            activeTab === "metadata" ? "block" : "hidden"
          }`}
        >
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Globe className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Search Metadata</h2>
              <p className="text-xs text-slate-500">
                Primary title, URL slug, description, and keywords indexed by search engines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* SEO Title */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="seoTitle" className="block text-sm font-semibold text-slate-800">
                  SEO Title
                </label>
                <span
                  className={`text-xs font-semibold ${
                    (watchedValues.seoTitle?.length || 0) > 60
                      ? "text-rose-600 font-bold"
                      : (watchedValues.seoTitle?.length || 0) > 50
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                >
                  {watchedValues.seoTitle?.length || 0}/60 chars
                </span>
              </div>
              <input
                id="seoTitle"
                {...register("seoTitle")}
                maxLength={60}
                placeholder="Target title (under 60 characters)"
                aria-invalid={Boolean(errors.seoTitle)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
              />
              {errors.seoTitle?.message ? (
                <p className="mt-1 text-xs text-rose-600">{errors.seoTitle.message}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Recommended length is 50-60 characters for optimal desktop display.
                </p>
              )}
            </div>

            {/* URL Slug */}
            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-semibold text-slate-800">
                URL Slug
              </label>
              <div className="flex rounded-xl border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 overflow-hidden">
                <span className="inline-flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 font-mono">
                  critiqo.com/
                </span>
                <input
                  id="slug"
                  {...register("slug")}
                  placeholder="my-page-slug"
                  aria-invalid={Boolean(errors.slug)}
                  className="w-full min-w-0 px-3 py-2.5 text-sm text-slate-900 outline-none"
                />
              </div>
              {errors.slug?.message ? (
                <p className="mt-1 text-xs text-rose-600">{errors.slug.message}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Use lowercase letters, numbers, and hyphens.
                </p>
              )}
            </div>

            {/* Focus Keyword */}
            <div>
              <label htmlFor="focusKeyword" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Focus Keyword
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  id="focusKeyword"
                  {...register("focusKeyword")}
                  placeholder="e.g. best tech reviews"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Primary keyword to evaluate content density and placement.
              </p>
            </div>

            {/* Canonical URL */}
            <div className="sm:col-span-2">
              <label htmlFor="canonicalUrl" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Canonical URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <input
                  id="canonicalUrl"
                  {...register("canonicalUrl")}
                  placeholder="https://critiqo.com/original-page-url"
                  aria-invalid={Boolean(errors.canonicalUrl)}
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
                />
              </div>
              {errors.canonicalUrl?.message ? (
                <p className="mt-1 text-xs text-rose-600">{errors.canonicalUrl.message}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Specify the preferred authoritative URL to prevent duplicate content penalties.
                </p>
              )}
            </div>

            {/* Meta Description */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="metaDescription" className="block text-sm font-semibold text-slate-800">
                  Meta Description
                </label>
                <span
                  className={`text-xs font-semibold ${
                    (watchedValues.metaDescription?.length || 0) > 160
                      ? "text-rose-600 font-bold"
                      : (watchedValues.metaDescription?.length || 0) > 140
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                >
                  {watchedValues.metaDescription?.length || 0}/160 chars
                </span>
              </div>
              <textarea
                id="metaDescription"
                {...register("metaDescription")}
                rows={3}
                maxLength={160}
                placeholder="Provide a compelling summary for search result snippets..."
                aria-invalid={Boolean(errors.metaDescription)}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
              />
              {errors.metaDescription?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.metaDescription.message}</p>
              )}
            </div>
          </div>

          {/* Search Indexing Directive (Noindex toggle) */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("noindex")}
                className="mt-1 size-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Noindex directive</span>
                  {watchedValues.noindex && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                      Index Restricted
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-600">
                  Instruct search crawlers not to index or show this page in public search results.
                </p>
                {errors.noindex?.message && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">{errors.noindex.message}</p>
                )}
              </div>
            </label>
          </div>

          {/* Save Button for Metadata Tab */}
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Search Metadata
                </>
              )}
            </button>
          </div>
        </section>

        {/* SECTION 2: Open Graph Metadata */}
        <section
          id="og"
          className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
            activeTab === "og" ? "block" : "hidden"
          }`}
        >
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Share2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Open Graph (Facebook & Social)</h2>
              <p className="text-xs text-slate-500">
                Controls how content displays when shared on Facebook, LinkedIn, Discord, and messaging apps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ogTitle" className="block text-sm font-semibold text-slate-800">
                  OG Title
                </label>
                <span className="text-xs text-slate-500">
                  {watchedValues.ogTitle?.length || 0}/60
                </span>
              </div>
              <input
                id="ogTitle"
                {...register("ogTitle")}
                maxLength={60}
                placeholder="Social media share title"
                aria-invalid={Boolean(errors.ogTitle)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.ogTitle?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.ogTitle.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ogImage" className="mb-1.5 block text-sm font-semibold text-slate-800">
                OG Image URL
              </label>
              <input
                id="ogImage"
                {...register("ogImage")}
                placeholder="https://example.com/social-cover.jpg"
                aria-invalid={Boolean(errors.ogImage)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.ogImage?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.ogImage.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ogDescription" className="block text-sm font-semibold text-slate-800">
                  OG Description
                </label>
                <span className="text-xs text-slate-500">
                  {watchedValues.ogDescription?.length || 0}/160
                </span>
              </div>
              <textarea
                id="ogDescription"
                {...register("ogDescription")}
                rows={2}
                maxLength={160}
                placeholder="Summary displayed below title on social posts..."
                aria-invalid={Boolean(errors.ogDescription)}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.ogDescription?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.ogDescription.message}</p>
              )}
            </div>

            {/* OG Live Image Preview Thumbnail */}
            {watchedValues.ogImage && /^https?:\/\/.+/i.test(watchedValues.ogImage) && (
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-500 block mb-2">OG Image Preview:</span>
                <div className="relative h-36 w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <Image
                    src={watchedValues.ogImage}
                    alt="OG Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button for Open Graph Tab */}
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Open Graph Settings
                </>
              )}
            </button>
          </div>
        </section>

        {/* SECTION 3: Twitter Card Metadata */}
        <section
          id="twitter"
          className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
            activeTab === "twitter" ? "block" : "hidden"
          }`}
        >
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Twitter className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Twitter Card Metadata</h2>
              <p className="text-xs text-slate-500">
                Tailor tweet cards for maximum engagement on X / Twitter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="twitterTitle" className="block text-sm font-semibold text-slate-800">
                  Twitter Card Title
                </label>
                <span className="text-xs text-slate-500">
                  {watchedValues.twitterTitle?.length || 0}/60
                </span>
              </div>
              <input
                id="twitterTitle"
                {...register("twitterTitle")}
                maxLength={60}
                placeholder="Tweet card headline"
                aria-invalid={Boolean(errors.twitterTitle)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.twitterTitle?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.twitterTitle.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="twitterImage" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Twitter Card Image URL
              </label>
              <input
                id="twitterImage"
                {...register("twitterImage")}
                placeholder="https://example.com/twitter-card.jpg"
                aria-invalid={Boolean(errors.twitterImage)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.twitterImage?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.twitterImage.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="twitterDescription" className="block text-sm font-semibold text-slate-800">
                  Twitter Card Description
                </label>
                <span className="text-xs text-slate-500">
                  {watchedValues.twitterDescription?.length || 0}/160
                </span>
              </div>
              <textarea
                id="twitterDescription"
                {...register("twitterDescription")}
                rows={2}
                maxLength={160}
                placeholder="Tweet card summary description..."
                aria-invalid={Boolean(errors.twitterDescription)}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.twitterDescription?.message && (
                <p className="mt-1 text-xs text-rose-600">{errors.twitterDescription.message}</p>
              )}
            </div>

            {/* Twitter Live Image Preview Thumbnail */}
            {watchedValues.twitterImage && /^https?:\/\/.+/i.test(watchedValues.twitterImage) && (
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Twitter Card Image Preview:</span>
                <div className="relative h-36 w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <Image
                    src={watchedValues.twitterImage}
                    alt="Twitter Card Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button for Twitter Tab */}
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Twitter Card Settings
                </>
              )}
            </button>
          </div>
        </section>
      </form>

      {/* SECTION 4: Google Search Snippet Preview */}
      <section
        id="preview"
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
          activeTab === "preview" ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Eye className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Google Search Preview</h2>
              <p className="text-xs text-slate-500">
                Live interactive preview of how search engines display your page snippet.
              </p>
            </div>
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1" aria-label="Preview view mode">
            <button
              type="button"
              aria-pressed={previewMode === "desktop"}
              onClick={() => setPreviewMode("desktop")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                previewMode === "desktop"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Monitor className="size-3.5" /> Desktop
            </button>
            <button
              type="button"
              aria-pressed={previewMode === "mobile"}
              onClick={() => setPreviewMode("mobile")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                previewMode === "mobile"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="size-3.5" /> Mobile
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all ${
              previewMode === "mobile" ? "max-w-md mx-auto" : "w-full"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-xs font-extrabold text-white">
                C
              </div>
              <div className="min-w-0 flex-1 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Critiqo</span>
                <span className="mx-1 text-slate-400">›</span>
                <span className="text-slate-600 truncate">{truncateGoogleText(previewUrl, 60)}</span>
              </div>
            </div>
            <h3 className="mt-2 break-words text-xl font-medium leading-snug text-[#1a0dab] hover:underline cursor-pointer">
              {truncateGoogleText(previewTitle, 60)}
            </h3>
            <p className="mt-1.5 break-words text-sm leading-relaxed text-[#4d5156]">
              {truncateGoogleText(previewDescription, 160)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => handleTabChange("metadata")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit Titles & Descriptions
          </button>
        </div>
      </section>

      {/* SECTION 5: SEO Score & Audit */}
      <section
        id="audit"
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
          activeTab === "audit" ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">SEO Score & Detailed Audit</h2>
              <p className="text-xs text-slate-500">
                Real-time algorithmic check against key SEO factors.
              </p>
            </div>
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            <Sparkles className={`size-3.5 ${analysisLoading ? "animate-spin" : ""}`} />
            {analysisLoading ? "Evaluating..." : "Run Analysis"}
          </button>
        </div>

        {analysis ? (
          <div className="mt-5 space-y-6">
            <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-slate-50/80 p-5 border border-slate-200/80">
              <div
                className={`flex size-24 shrink-0 items-center justify-center rounded-full border-4 text-3xl font-extrabold shadow-sm ${
                  analysis.score < 50
                    ? "border-rose-400 bg-rose-50 text-rose-700"
                    : analysis.score < 80
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-emerald-400 bg-emerald-50 text-emerald-700"
                }`}
              >
                {analysis.score}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Overall SEO Score: <span className="text-indigo-600">{analysis.score} / 100</span>
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {analysis.score >= 80
                    ? "Great job! Your metadata and content structure adhere to modern SEO best practices."
                    : analysis.score >= 50
                    ? "Good foundation. Address the flagged warnings below to boost your search rating."
                    : "Needs improvement. Critical SEO checks failed. Review and update form fields."}
                </p>
              </div>
            </div>

            {/* Audit Items Container */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SEO Check Breakdown ({analysis.checks.length} Rules Audited)
              </h3>
              <div className="max-h-96 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {checkOrder.map((checkId) => {
                    const check = analysis.checks.find((item) => item.id === checkId);
                    if (!check) return null;
                    return (
                      <div
                        key={check.id}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-xs transition-all ${
                          checkStatusClass[check.status]
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {check.status === "pass" ? (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          ) : check.status === "warn" ? (
                            <AlertTriangle className="size-4 text-amber-600" />
                          ) : (
                            <XCircle className="size-4 text-rose-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              {checkLabels[check.id] || check.id}
                            </span>
                            <span className="font-semibold uppercase tracking-wider text-[10px]">
                              {check.status}
                            </span>
                          </div>
                          <p className="mt-1 leading-relaxed text-slate-700">{check.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <Sparkles className="mx-auto size-8 text-amber-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">No SEO score calculated yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Click &quot;Run Analysis&quot; or save your settings to generate a full SEO audit.
            </p>
          </div>
        )}

        {analysisError && (
          <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-700 border border-rose-200">
            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
            <span>{analysisError}</span>
          </div>
        )}
      </section>

      {/* SECTION 6: Schema Markup (JSON-LD) */}
      <section
        id="schema"
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
          activeTab === "schema" ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Code className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Schema Markup (JSON-LD)</h2>
            <p className="text-xs text-slate-500">
              Inject structured microdata for Google rich search results (Rich Snippets).
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSchema} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[200px] flex-1">
              <label htmlFor="schemaTypeSelect" className="block text-xs font-semibold text-slate-700 mb-1">
                Schema Type
              </label>
              <select
                id="schemaTypeSelect"
                value={schemaType}
                onChange={(event) => setSchemaType(event.target.value as SchemaType)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-purple-300 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-50"
            >
              <Sparkles className={`size-3.5 ${schemaLoading ? "animate-spin" : ""}`} />
              {schemaLoading ? "Generating..." : "Generate Auto Schema"}
            </button>
          </div>

          <div>
            <label htmlFor="schemaJsonTextarea" className="block text-xs font-semibold text-slate-700 mb-1">
              JSON-LD Code Editor
            </label>
            <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-inner">
              <textarea
                id="schemaJsonTextarea"
                value={schemaJson}
                onChange={(event) => {
                  setSchemaJson(event.target.value);
                  setSchemaError("");
                  setSchemaSuccess("");
                }}
                rows={10}
                spellCheck={false}
                placeholder={'{\n  "@context": "https://schema.org"\n}'}
                className="w-full max-h-[380px] overflow-y-auto bg-transparent font-mono text-xs leading-relaxed text-emerald-400 outline-none placeholder:text-slate-600 scrollbar-thin"
              />
            </div>
          </div>

          {schemaError && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>{schemaError}</span>
            </div>
          )}
          {schemaSuccess && (
            <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{schemaSuccess}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={schemaSaving || !schemaJson.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 shadow-sm"
            >
              {schemaSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving Schema…
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  Save Schema Markup
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 7: Content Images Audit & Metadata */}
      <section
        id="images"
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
          activeTab === "images" ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <ImageIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Content Images & Alt Metadata</h2>
              <p className="text-xs text-slate-500">
                Audit embedded images for missing alt tags, descriptive filenames, and titles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void reloadImages()}
            disabled={imagesLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${imagesLoading ? "animate-spin" : ""}`} />
            {imagesLoading ? "Refreshing…" : "Refresh Images"}
          </button>
        </div>

        {imagesError && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
            <span>{imagesError}</span>
          </div>
        )}

        {!imagesLoading && !imagesError && images.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <ImageIcon className="mx-auto size-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">No embedded images found</p>
            <p className="mt-1 text-xs text-slate-500">
              This content does not contain any embedded images requiring alt metadata.
            </p>
          </div>
        )}

        <div className="max-h-[600px] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {images.map((image) => {
            const values = imageValues[image.id] ?? {
              alt: image.alt ?? "",
              title: image.title ?? "",
              fileName: image.fileName ?? "",
            };
            return (
              <div
                key={image.id}
                className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                    <Image
                      src={image.url}
                      alt={values.alt || "Content image"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                      {image.url}
                    </p>
                    {image.issues && image.issues.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {image.issues.map((issue, index) => (
                          <span
                            key={`${issue.type}-${index}`}
                            title={issue.reason}
                            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                          >
                            <AlertTriangle className="size-3" />
                            {issue.type.replaceAll("-", " ")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="size-3" /> No image issues detected
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Alt text</label>
                    <input
                      value={values.alt}
                      onChange={(event) => updateImageField(image.id, "alt", event.target.value)}
                      placeholder="Descriptive alt text"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Title attribute</label>
                    <input
                      value={values.title}
                      onChange={(event) => updateImageField(image.id, "title", event.target.value)}
                      placeholder="Image title"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">File name</label>
                    <input
                      value={values.fileName}
                      onChange={(event) => updateImageField(image.id, "fileName", event.target.value)}
                      placeholder="image-filename.jpg"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {imageMessages[image.id] && (
                  <p
                    role="status"
                    className={`mt-2 text-xs font-semibold ${
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
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-all"
                  >
                    {imageSaving === image.id ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="size-3" />
                        Save Image Metadata
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 flex size-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
          aria-label="Scroll to top"
        >
          <ChevronUp className="size-6" />
        </button>
      )}
    </div>
  );
};

export default SeoContentForm;

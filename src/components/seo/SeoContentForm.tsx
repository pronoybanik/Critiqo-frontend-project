"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { z } from "zod";
import { getSeoContent, updateSeoContent } from "@/lib/seo/api";
import type { SeoContentType, SeoUpdatePayload } from "@/types/seo";

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
const validTypes: SeoContentType[] = ["page", "blogPost", "review"];

const SeoContentForm = () => {
  const params = useParams<{ type: string; id: string }>();
  const type = params.type as SeoContentType;
  const id = params.id;
  const [contentTitle, setContentTitle] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
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
  };

  if (isLoading) {
    return <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading SEO settings…</p>;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin/seo" className="text-sm font-medium text-indigo-700 hover:underline">
            ← Back to content
          </Link>
          <h2 className="mt-3 break-words text-xl font-semibold">{contentTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">Edit search and social sharing metadata.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Saving…" : "Save SEO"}
        </button>
      </div>

      {loadError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{loadError}</p>
      )}
      {success && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>
      )}

      {sections.map((section) => (
        <section key={section} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-4 text-base font-semibold">{section}</h3>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {fields.filter((field) => field.section === section).map((field) => {
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
  );
};

export default SeoContentForm;

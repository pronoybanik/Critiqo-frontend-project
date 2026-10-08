"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/lib/seo/api";
import type { SiteSettingsPayload } from "@/types/seo";

const settingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required").max(100),
  baseUrl: z.string().url("Enter a valid site URL").refine(
    (value) => /^https?:\/\//i.test(value),
    "URL must use HTTP or HTTPS",
  ),
  defaultTitle: z.string().trim().min(1, "Default title is required").max(60),
  defaultDescription: z.string().trim().min(1, "Default description is required").max(160),
  defaultOgImage: z.string().refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Enter a valid HTTP or HTTPS image URL",
  ),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SiteSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      baseUrl: "",
      defaultTitle: "",
      defaultDescription: "",
      defaultOgImage: "",
    },
  });
  const defaultTitle = watch("defaultTitle");
  const defaultDescription = watch("defaultDescription");

  useEffect(() => {
    let isMounted = true;

    getSiteSettings()
      .then((result) => {
        if (!isMounted) return;
        if (result.ok) {
          reset({
            ...result.data,
            defaultOgImage: result.data.defaultOgImage ?? "",
          });
        } else {
          setLoadError(result.message);
        }
      })
      .catch((reason: unknown) => {
        if (isMounted) {
          setLoadError(reason instanceof Error ? reason.message : "Unable to load site settings.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    setSuccess("");
    const payload: SiteSettingsPayload = {
      ...values,
      defaultOgImage: values.defaultOgImage.trim() || null,
    };
    let result;
    try {
      result = await updateSiteSettings(payload);
    } catch (reason: unknown) {
      setLoadError(
        reason instanceof Error ? reason.message : "Unable to save site settings.",
      );
      return;
    }
    if (!result.ok) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (
          field === "siteName" ||
          field === "baseUrl" ||
          field === "defaultTitle" ||
          field === "defaultDescription" ||
          field === "defaultOgImage"
        ) {
          setError(field, { type: "server", message });
        }
      }
      setLoadError(result.message);
      return;
    }
    setLoadError("");
    setSuccess("Site-wide defaults saved successfully.");
  };

  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-sm text-slate-600 shadow-sm">
        <div className="flex items-center gap-3 font-medium">
          <Loader2 className="size-5 animate-spin text-indigo-600" />
          Loading site settings…
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Site-wide defaults</h2>
        <p className="mt-1 text-sm text-slate-600">
          Configure fallback SEO metadata used when a content item has no custom values.
        </p>
      </div>

      {loadError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{loadError}</p>
      )}
      {success && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>
      )}

      <section className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
        <label className="block min-w-0">
          <span className="mb-1.5 block text-sm font-medium">Site name</span>
          <input {...register("siteName")} aria-invalid={Boolean(errors.siteName)} className={inputClass} />
          {errors.siteName && <span className="mt-1 block text-xs text-rose-700">{errors.siteName.message}</span>}
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-sm font-medium">Base URL</span>
          <input {...register("baseUrl")} placeholder="https://example.com" aria-invalid={Boolean(errors.baseUrl)} className={inputClass} />
          {errors.baseUrl && <span className="mt-1 block text-xs text-rose-700">{errors.baseUrl.message}</span>}
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-sm font-medium">Default SEO title</span>
          <input {...register("defaultTitle")} maxLength={60} aria-invalid={Boolean(errors.defaultTitle)} className={inputClass} />
          <div className="mt-1 flex justify-between text-xs">
            {errors.defaultTitle ? <span className="text-rose-700">{errors.defaultTitle.message}</span> : <span />}
            <span className="text-slate-500">{defaultTitle?.length ?? 0}/60</span>
          </div>
        </label>
        <label className="block min-w-0 sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Default meta description</span>
          <textarea {...register("defaultDescription")} rows={3} maxLength={160} aria-invalid={Boolean(errors.defaultDescription)} className={`${inputClass} resize-y`} />
          <div className="mt-1 flex justify-between text-xs">
            {errors.defaultDescription ? <span className="text-rose-700">{errors.defaultDescription.message}</span> : <span />}
            <span className="text-slate-500">{defaultDescription?.length ?? 0}/160</span>
          </div>
        </label>
        <label className="block min-w-0 sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Default Open Graph image URL</span>
          <input {...register("defaultOgImage")} placeholder="https://example.com/social-image.jpg" aria-invalid={Boolean(errors.defaultOgImage)} className={inputClass} />
          {errors.defaultOgImage && <span className="mt-1 block text-xs text-rose-700">{errors.defaultOgImage.message}</span>}
        </label>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving site settings…
          </>
        ) : (
          "Save site settings"
        )}
      </button>
    </form>
  );
};

export default SiteSettingsForm;

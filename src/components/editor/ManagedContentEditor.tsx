"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Editor } from "@tiptap/react";
import TiptapEditor from "@/components/editor/TiptapEditor";
import type {
  ContentCategory,
  EditorContent,
  ManagedContentType,
} from "@/lib/editor/api";
import { saveManagedContent } from "@/lib/editor/api";

type ManagedContentEditorProps = {
  type: ManagedContentType;
  id: string;
  initialContent: EditorContent | null;
  categories: ContentCategory[];
  initialError?: string;
};

const makeSlug = (title: string) =>
  title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ManagedContentEditor = ({
  type,
  id,
  initialContent,
  categories,
  initialError,
}: ManagedContentEditorProps) => {
  const router = useRouter();
  const editorRef = useRef<Editor | null>(null);
  const [title, setTitle] = useState(initialContent?.title ?? "");
  const [slug, setSlug] = useState(initialContent?.slug ?? "");
  const [contentHtml, setContentHtml] = useState(
    initialContent?.contentHtml ?? "<p></p>",
  );
  const [published, setPublished] = useState(initialContent?.published ?? false);
  const [categoryId, setCategoryId] = useState("");
  const [rating, setRating] = useState("5");
  const [slugEdited, setSlugEdited] = useState(Boolean(initialContent?.slug));
  const [error, setError] = useState(initialError ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEditorReady = useCallback((editor: Editor | null) => {
    editorRef.current = editor;
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) setSlug(makeSlug(value));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    if (!title.trim()) {
      setFieldErrors({ title: "A title is required." });
      return;
    }
    if (!slug.trim()) {
      setFieldErrors({ slug: "A URL slug is required." });
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      setFieldErrors({ slug: "Use lowercase letters, numbers, and hyphens." });
      return;
    }
    if (type === "review" && id === "new" && !categoryId) {
      setFieldErrors({ categoryId: "Choose a category for this review." });
      return;
    }

    const body = editorRef.current?.getHTML() ?? contentHtml;
    if (type === "review" && id === "new" && !rating) {
      setFieldErrors({ rating: "Choose a rating." });
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveManagedContent(type, id, {
        title: title.trim(),
        slug: slug.trim(),
        contentHtml: body,
        published,
        ...(type === "review" && id === "new"
          ? { categoryId, rating: Number(rating) }
          : {}),
      });
      if (!result.ok) {
        setError(result.message);
        setFieldErrors(result.fieldErrors);
        return;
      }
      setContentHtml(body);
      setSuccess("Content saved successfully.");
      if (id === "new") {
        router.replace(`/admin/${type}/${result.data.id}`);
      }
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to save content.");
    } finally {
      setIsSaving(false);
    }
  };

  const newRecord = id === "new";

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-600">
            Admin / {type === "blog" ? "Blog posts" : "Reviews"}
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {newRecord ? `Create ${type === "blog" ? "blog post" : "review"}` : `Edit ${type === "blog" ? "blog post" : "review"}`}
          </h1>
        </div>
        <button
          type="submit"
          form="managed-content-form"
          disabled={isSaving}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? "Saving…" : published ? "Save & publish" : "Save draft"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {success}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <form
          id="managed-content-form"
          onSubmit={handleSave}
          className="min-w-0 space-y-4"
        >
          <section className="min-w-0 space-y-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Title</span>
              <input
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                maxLength={255}
                aria-invalid={Boolean(fieldErrors.title)}
                className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
                required
              />
              {fieldErrors.title && <span className="mt-1 block text-xs text-rose-700">{fieldErrors.title}</span>}
            </label>
            <label className="block min-w-0">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">URL slug</span>
              <input
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugEdited(true);
                }}
                aria-invalid={Boolean(fieldErrors.slug)}
                className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
                required
              />
              {fieldErrors.slug && <span className="mt-1 block text-xs text-rose-700">{fieldErrors.slug}</span>}
            </label>
            {type === "review" && newRecord && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Category</span>
                  <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    aria-invalid={Boolean(fieldErrors.categoryId)}
                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400"
                    required
                  >
                    <option value="">Choose a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {fieldErrors.categoryId && <span className="mt-1 block text-xs text-rose-700">{fieldErrors.categoryId}</span>}
                  {categories.length === 0 && <span className="mt-1 block text-xs text-amber-700">No categories are available; create a category before adding a review.</span>}
                </label>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Rating</span>
                  <select
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
                  </select>
                </label>
              </div>
            )}
          </div>

          <TiptapEditor
            initialHtml={initialContent?.contentHtml ?? ""}
            onChange={setContentHtml}
            onEditorReady={handleEditorReady}
            ariaLabel={`${type === "blog" ? "Blog post" : "Review"} content editor`}
          />
          </section>
        </form>

        <aside className="min-w-0 xl:sticky xl:top-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Publishing</h3>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                form="managed-content-form"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="size-4 rounded border-slate-300 accent-indigo-600"
              />
              Publish this content
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ManagedContentEditor;

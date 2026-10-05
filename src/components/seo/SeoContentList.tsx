"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSeoContentList } from "@/hooks/seo/useSeoContentList";
import type { SeoContentSummary, SeoContentType } from "@/types/seo";

type TypeFilter = SeoContentType | "all";

const typeLabels: Record<SeoContentType, string> = {
  page: "Page",
  blog: "Blog post",
  review: "Review",
};

const editHref = (item: SeoContentSummary) =>
  `/admin/seo/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;

const SeoState = ({ item }: { item: SeoContentSummary }) => (
  <div className="flex flex-wrap gap-1.5 text-xs">
    <span
      className={`rounded-full px-2 py-1 font-medium ${
        item.seoMeta?.seoTitle
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      Title {item.seoMeta?.seoTitle ? "set" : "missing"}
    </span>
    <span
      className={`rounded-full px-2 py-1 font-medium ${
        item.seoMeta?.metaDescription
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      Description {item.seoMeta?.metaDescription ? "set" : "missing"}
    </span>
    {item.seoMeta?.noindex && (
      <span className="rounded-full bg-rose-50 px-2 py-1 font-medium text-rose-700">
        Noindex
      </span>
    )}
  </div>
);

const SeoContentList = () => {
  const { items, isLoading, error } = useSeoContentList();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesQuery =
        !normalizedQuery ||
        `${item.title} ${item.slug ?? ""}`.toLocaleLowerCase().includes(normalizedQuery);
      return matchesType && matchesQuery;
    });
  }, [items, query, typeFilter]);

  return (
    <section aria-labelledby="seo-content-heading">
      <div className="mb-6">
        <h2 id="seo-content-heading" className="text-lg font-semibold">
          Content metadata
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review SEO completeness and edit metadata for pages, blog posts, and reviews.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="block">
          <span className="sr-only">Search content</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or slug"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter by type</span>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All types</option>
            <option value="page">Pages</option>
            <option value="blog">Blog posts</option>
            <option value="review">Reviews</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading SEO content…
        </p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </p>
      ) : filteredItems.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No content matches your search.
        </p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">Content</th>
                    <th scope="col" className="px-5 py-3">Type</th>
                    <th scope="col" className="px-5 py-3">SEO status</th>
                    <th scope="col" className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={`${item.type}-${item.id}`}>
                      <td className="max-w-sm px-5 py-4">
                        <p className="truncate font-medium text-slate-900">{item.title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{item.slug || "No slug"}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{typeLabels[item.type]}</td>
                      <td className="px-5 py-4"><SeoState item={item} /></td>
                      <td className="px-5 py-4 text-right">
                        <Link href={editHref(item)} className="inline-flex rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                          Edit SEO
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid gap-3 lg:hidden">
            {filteredItems.map((item) => (
              <article key={`${item.type}-${item.id}`} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-semibold">{item.title}</p>
                    <p className="mt-1 break-all text-xs text-slate-500">{item.slug || "No slug"}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {typeLabels[item.type]}
                  </span>
                </div>
                <div className="mt-3"><SeoState item={item} /></div>
                <Link href={editHref(item)} className="mt-4 inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                  Edit SEO
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default SeoContentList;

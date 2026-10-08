"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Loader2,
  Search,
  SearchX,
  X,
  Filter,
  FileEdit,
  AlertCircle,
  ShieldAlert,
  RotateCcw,
  FileText,
  BookOpen,
  Star,
} from "lucide-react";
import { useSeoContentList } from "@/hooks/seo/useSeoContentList";
import type { SeoContentSummary, SeoContentType } from "@/types/seo";

type TypeFilter = SeoContentType | "all";

const typeLabels: Record<SeoContentType, string> = {
  page: "Page",
  blog: "Blog post",
  review: "Review",
};

const typeIcons: Record<SeoContentType, typeof FileText> = {
  page: FileText,
  blog: BookOpen,
  review: Star,
};

const editHref = (item: SeoContentSummary) =>
  `/admin/seo/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;

const SeoState = ({ item }: { item: SeoContentSummary }) => {
  const hasTitle = Boolean(item.seoMeta?.seoTitle);
  const hasDesc = Boolean(item.seoMeta?.metaDescription);
  const isNoindex = Boolean(item.seoMeta?.noindex);

  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium transition-all ${
          hasTitle
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
        }`}
      >
        <span className={`size-1.5 rounded-full ${hasTitle ? "bg-emerald-500" : "bg-amber-500"}`} />
        Title {hasTitle ? "set" : "missing"}
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium transition-all ${
          hasDesc
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
        }`}
      >
        <span className={`size-1.5 rounded-full ${hasDesc ? "bg-emerald-500" : "bg-amber-500"}`} />
        Desc {hasDesc ? "set" : "missing"}
      </span>
      {isNoindex && (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 font-medium text-rose-700 ring-1 ring-rose-200">
          <ShieldAlert className="size-3 text-rose-600" />
          Noindex
        </span>
      )}
    </div>
  );
};

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

  const hasActiveFilters = Boolean(query.trim() || typeFilter !== "all");

  const handleResetFilters = () => {
    setQuery("");
    setTypeFilter("all");
  };

  return (
    <section aria-labelledby="seo-content-heading" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div>
          <h2 id="seo-content-heading" className="text-xl font-bold tracking-tight text-slate-900">
            Content Metadata Overview
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Review SEO completeness, meta tags, index directives, and edit metadata across site content.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
          <span className="flex size-2 rounded-full bg-emerald-500" />
          Total Items: {items.length}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 size-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or URL slug..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="relative flex items-center">
          <Filter className="absolute left-3.5 size-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All content types</option>
            <option value="page">Pages</option>
            <option value="blog">Blog posts</option>
            <option value="review">Reviews</option>
          </select>
        </div>
      </div>

      {/* Active Filter Pill Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Active filters:</span>
          {query && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 border border-indigo-200">
              Query: &quot;{query}&quot;
              <button type="button" onClick={() => setQuery("")} className="hover:text-indigo-900">
                <X className="size-3" />
              </button>
            </span>
          )}
          {typeFilter !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 border border-indigo-200">
              Type: {typeLabels[typeFilter]}
              <button type="button" onClick={() => setTypeFilter("all")} className="hover:text-indigo-900">
                <X className="size-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            <RotateCcw className="size-3" /> Reset all
          </button>
        </div>
      )}

      {/* Main Content State Rendering */}
      {isLoading ? (
        <div role="status" className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-600 shadow-xs">
          <Loader2 className="size-8 animate-spin text-indigo-600 mb-3" />
          <p className="font-semibold text-slate-800">Loading SEO Content List</p>
          <p className="mt-1 text-xs text-slate-500">Fetching pages, blog posts, and review metadata...</p>
        </div>
      ) : error ? (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-xs">
          <AlertCircle className="size-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-rose-900">Failed to Load Content List</h3>
            <p className="mt-1 text-xs text-rose-700">{error}</p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        /* STUNNING EMPTY STATE */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-xs sm:p-14">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50 mb-4">
            <SearchX className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No content matches your search</h3>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
            {hasActiveFilters
              ? `We couldn't find any content matching "${query || typeFilter}". Try adjusting your query or clear active filters.`
              : "No content items are currently available in the SEO database."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
            >
              <RotateCcw className="size-3.5" />
              Clear Search & Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">Content</th>
                    <th scope="col" className="px-6 py-4">Type</th>
                    <th scope="col" className="px-6 py-4">SEO Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => {
                    const IconComponent = typeIcons[item.type] || FileText;
                    return (
                      <tr key={`${item.type}-${item.id}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="max-w-md px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <IconComponent className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold text-slate-900">{item.title}</p>
                              <p className="mt-0.5 truncate text-xs font-mono text-slate-500">
                                {item.slug ? `/${item.slug}` : "No slug specified"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 capitalize">
                            {typeLabels[item.type]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <SeoState item={item} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={editHref(item)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all"
                          >
                            <FileEdit className="size-3.5" />
                            Edit SEO
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Grid View */}
          <div className="grid gap-4 lg:hidden">
            {filteredItems.map((item) => {
              const IconComponent = typeIcons[item.type] || FileText;
              return (
                <article
                  key={`${item.type}-${item.id}`}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <IconComponent className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words font-bold text-slate-900">{item.title}</p>
                        <p className="mt-0.5 break-all text-xs font-mono text-slate-500">
                          {item.slug ? `/${item.slug}` : "No slug specified"}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {typeLabels[item.type]}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <SeoState item={item} />
                  </div>
                  <Link
                    href={editHref(item)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all"
                  >
                    <FileEdit className="size-4" />
                    Edit SEO Metadata
                  </Link>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default SeoContentList;


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

const SeoLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirectPath=${encodeURIComponent(pathname)}`);
    } else if (!isLoading && user?.role !== "ADMIN") {
      router.replace("/403");
    }
  }, [isLoading, pathname, router, user]);

  if (isLoading || user?.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm text-slate-600">
        {isLoading ? "Checking administrator access…" : "Redirecting…"}
      </main>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Critiqo Admin
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              SEO management
            </h1>
          </div>
          <nav aria-label="SEO management" className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin/seo"
              aria-current={pathname === "/admin/seo" ? "page" : undefined}
              className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700"
            >
              Content
            </Link>
            <Link
              href="/admin/seo/settings"
              aria-current={pathname === "/admin/seo/settings" ? "page" : undefined}
              className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-700"
            >
              Site settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default SeoLayout;

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
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
      <main className="flex min-h-screen items-center justify-center px-4 text-sm text-slate-600">
        {isLoading ? "Checking administrator access…" : "Redirecting…"}
      </main>
    );
  }

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="font-semibold text-slate-900">
            Critiqo Admin
          </Link>
          <Link
            href={pathname.startsWith("/admin/blog") ? "/admin/seo" : "/admin/reviews"}
            className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Back to {pathname.startsWith("/admin/blog") ? "SEO content" : "reviews"}
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1600px] min-w-0 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default EditorLayout;

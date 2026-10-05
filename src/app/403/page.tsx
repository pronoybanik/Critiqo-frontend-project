import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
          403 · Forbidden
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Administrator access required
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account does not have permission to access SEO management.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}

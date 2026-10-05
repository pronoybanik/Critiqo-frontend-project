import SeoLayout from "@/components/seo/SeoLayout";

export default function AdminSeoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SeoLayout>{children}</SeoLayout>;
}

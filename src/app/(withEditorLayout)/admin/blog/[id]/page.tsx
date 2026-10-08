import ManagedContentEditor from "@/components/editor/ManagedContentEditor";
import { loadManagedContent } from "@/lib/editor/api";

export default async function AdminBlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadManagedContent("blog", id);

  return (
    <ManagedContentEditor
      type="blog"
      id={id}
      initialContent={result.ok ? result.data : null}
      categories={[]}
      initialError={result.ok ? undefined : result.message}
    />
  );
}

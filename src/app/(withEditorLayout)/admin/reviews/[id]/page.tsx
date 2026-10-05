import ManagedContentEditor from "@/components/editor/ManagedContentEditor";
import {
  loadContentCategories,
  loadManagedContent,
} from "@/lib/editor/api";

export default async function AdminReviewEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [contentResult, categoryResult] = await Promise.all([
    loadManagedContent("review", id),
    id === "new"
      ? loadContentCategories()
      : Promise.resolve({ ok: true as const, data: [] }),
  ]);

  return (
    <ManagedContentEditor
      type="review"
      id={id}
      initialContent={contentResult.ok ? contentResult.data : null}
      categories={categoryResult.ok ? categoryResult.data : []}
      initialError={
        !contentResult.ok
          ? contentResult.message
          : !categoryResult.ok
            ? categoryResult.message
            : undefined
      }
    />
  );
}

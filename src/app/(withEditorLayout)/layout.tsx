import EditorLayout from "@/components/editor/EditorLayout";

export default function ContentEditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <EditorLayout>{children}</EditorLayout>;
}

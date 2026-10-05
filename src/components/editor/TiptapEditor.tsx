"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";
import UploadToCloudinary from "@/components/shared/UploadToCloudinary";

type TiptapEditorProps = {
  initialHtml?: string;
  onChange: (html: string) => void;
  onEditorReady?: (editor: Editor | null) => void;
  ariaLabel?: string;
};

const toolbarButtonClass =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const TiptapEditor = ({
  initialHtml = "",
  onChange,
  onEditorReady,
  ariaLabel = "Rich text content",
}: TiptapEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const onChangeRef = useRef(onChange);
  const onEditorReadyRef = useRef(onEditorReady);
  onChangeRef.current = onChange;
  onEditorReadyRef.current = onEditorReady;

  const editor = useEditor({
    immediatelyRender: false,
    content: initialHtml,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bold: false,
        bulletList: {},
        code: false,
        codeBlock: false,
        dropcursor: {},
        gapcursor: false,
        hardBreak: false,
        heading: { levels: [1, 2, 3, 4] },
        horizontalRule: false,
        italic: false,
        link: false,
        listItem: {},
        listKeymap: {},
        orderedList: {},
        paragraph: {},
        strike: false,
        trailingNode: false,
        underline: false,
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Image.configure({
        allowBase64: false,
        inline: false,
        HTMLAttributes: { class: "editor-content-image" },
      }),
    ],
    editorProps: {
      attributes: {
        "aria-label": ariaLabel,
        class:
          "prose prose-slate min-h-[320px] max-w-none break-words px-4 py-3 text-slate-900 outline-none focus:outline-none [&_a]:text-indigo-700 [&_a]:underline [&_h1]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:text-lg [&_h4]:font-semibold [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
      },
      handleKeyDown: (_view, event) => {
        const activeEditor = editorRef.current;
        if (!activeEditor || !(event.ctrlKey || event.metaKey)) return false;
        if (event.altKey) {
          const level = Number(event.key);
          if (level === 0) {
            activeEditor.chain().focus().setParagraph().run();
            return true;
          }
          if (level < 1 || level > 4) return false;
          activeEditor
            .chain()
            .focus()
            .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
            .run();
          return true;
        }
        if (!event.shiftKey && event.key.toLowerCase() === "k") {
          const currentHref = activeEditor.getAttributes("link").href as
            | string
            | undefined;
          const entered = window.prompt("Enter a link URL", currentHref ?? "https://");
          if (entered === null) return true;
          const href = entered.trim();
          if (!href) {
            activeEditor.chain().focus().unsetLink().run();
            return true;
          }
          if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
            toast.error("Use an HTTP(S), mail, telephone, relative, or anchor link.");
            return true;
          }
          activeEditor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
              href,
              target: "_blank",
              rel: "noopener noreferrer nofollow",
            })
            .run();
          return true;
        }
        if (event.shiftKey && event.code === "Digit8") {
          activeEditor.chain().focus().toggleBulletList().run();
          return true;
        }
        if (event.shiftKey && event.code === "Digit7") {
          activeEditor.chain().focus().toggleOrderedList().run();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onChangeRef.current(updatedEditor.getHTML());
      }, 350);
    },
  });
  editorRef.current = editor;

  useEffect(() => {
    onEditorReadyRef.current?.(editor);
    return () => onEditorReadyRef.current?.(null);
  }, [editor]);

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    [],
  );

  const addLink = () => {
    if (!editor) return;
    const existing = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("Enter a link URL", existing ?? "https://");
    if (input === null) return;
    const href = input.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const safeProtocol = /^(https?:|mailto:|tel:|\/|#)/i.test(href);
    if (!safeProtocol) {
      toast.error("Use an HTTP(S), mail, telephone, relative, or anchor link.");
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      })
      .run();
  };

  const addImageByUrl = () => {
    if (!editor) return;
    const url = window.prompt("Enter an image URL", "https://");
    if (url === null || !url.trim()) return;
    if (!/^https?:\/\/.+/i.test(url.trim())) {
      toast.error("Image URLs must use HTTP or HTTPS.");
      return;
    }
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const uploadImage = async (file?: File) => {
    if (!file || !editor) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    setIsUploading(true);
    try {
      const url = await UploadToCloudinary(file);
      if (!url) return;
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (error: unknown) {
      console.error("Editor image upload failed", error);
      toast.error("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const button = (
    label: string,
    shortcut: string,
    active: boolean | undefined,
    action: () => void,
  ) => (
    <button
      key={label}
      type="button"
      aria-label={`${label} (${shortcut})`}
      aria-pressed={active}
      title={`${label} · ${shortcut}`}
      onClick={action}
      disabled={!editor}
      className={`${toolbarButtonClass} ${
        active
          ? "border-indigo-600 bg-indigo-50 text-indigo-800"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );

  if (!editor) {
    return (
      <div className="min-h-[360px] animate-pulse rounded-xl border border-slate-200 bg-white" />
    );
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        role="toolbar"
        aria-label="Content formatting"
        className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-2"
      >
        {button("Paragraph", "Ctrl/⌘+Alt+0", editor.isActive("paragraph"), () =>
          editor.chain().focus().setParagraph().run(),
        )}
        {[1, 2, 3, 4].map((level) =>
          button(
            `H${level}`,
            `Ctrl/⌘+Alt+${level}`,
            editor.isActive("heading", { level }),
            () =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
                .run(),
          ),
        )}
        {button("Bullets", "Ctrl/⌘+Shift+8", editor.isActive("bulletList"), () =>
          editor.chain().focus().toggleBulletList().run(),
        )}
        {button("Numbered", "Ctrl/⌘+Shift+7", editor.isActive("orderedList"), () =>
          editor.chain().focus().toggleOrderedList().run(),
        )}
        {button("Link", "Ctrl/⌘+K", editor.isActive("link"), addLink)}
        {button("Image URL", "Open URL prompt", undefined, addImageByUrl)}
        <label
          className={`${toolbarButtonClass} cursor-pointer border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
          aria-label="Upload an image"
          title="Upload an image"
        >
          {isUploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={(event) => {
              void uploadImage(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
      <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
        Headings: Ctrl/⌘+Alt+1–4 · Links: Ctrl/⌘+K · Lists: Ctrl/⌘+Shift+7/8
      </p>
    </section>
  );
};

export default TiptapEditor;

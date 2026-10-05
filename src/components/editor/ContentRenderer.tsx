type ContentRendererProps = {
  html: string | null | undefined;
  className?: string;
};

const ContentRenderer = ({ html, className = "" }: ContentRendererProps) => {
  if (!html?.trim()) return null;

  return (
    <article
      className={`min-w-0 max-w-none break-words text-slate-800 [&_a]:text-indigo-700 [&_a]:underline [&_h1]:my-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:my-3 [&_h4]:text-lg [&_h4]:font-semibold [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ContentRenderer;

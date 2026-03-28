export const issueEditorTheme = {
  root: "outline-none focus:outline-none",
  paragraph: "text-[15px] leading-relaxed text-foreground mb-3",
  heading: {
    h1: "text-2xl font-semibold text-foreground mb-4 mt-6",
    h2: "text-xl font-semibold text-foreground mb-3 mt-5",
    h3: "text-lg font-medium text-foreground mb-2 mt-4",
  },
  quote: "border-l-2 border-outline-variant/30 pl-4 italic text-muted-foreground my-3",
  list: {
    nested: {
      listitem: "pl-5",
    },
    ol: "list-decimal pl-5 space-y-1 mb-3",
    ul: "list-disc pl-5 space-y-1 mb-3",
    listitem: "text-foreground",
    listitemChecked:
      "line-through text-muted-foreground relative pl-6 list-none before:content-['✓'] before:absolute before:left-0 before:text-emerald-500",
    listitemUnchecked:
      "relative pl-6 list-none before:content-['○'] before:absolute before:left-0 before:text-muted-foreground",
  },
  link: "text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary cursor-pointer",
  text: {
    bold: "font-semibold text-foreground",
    italic: "italic",
    strikethrough: "line-through text-muted-foreground",
    code: "rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground",
    underline: "underline",
  },
  code: "block my-3 rounded-lg bg-surface-low px-4 py-3 font-mono text-sm text-foreground whitespace-pre-wrap overflow-x-auto",
  horizontalRule: "border-outline-variant/15 my-6",
  hashtag: "rounded bg-primary/10 px-1 py-0.5 text-primary",
  mention: "rounded bg-primary/10 px-1 py-0.5 font-semibold text-primary",
};

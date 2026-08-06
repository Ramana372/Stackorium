import { useState, type ReactNode, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';

const COPY_CLASS = 'rk-copy-btn';

function CodeBlock({ className, children }: { className?: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace('language-', '') ?? 'text';

  const codeText = extractText(children);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-border bg-[#0d1117] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed scrollbar-thin">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props?.children);
  }
  return '';
}

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="rk-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFrontmatter]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          h2: ({ children }) => {
            const id = slugifyFromChildren(children);
            return (
              <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight mt-10 mb-4">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugifyFromChildren(children);
            return (
              <h3 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight mt-8 mb-3">
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const id = slugifyFromChildren(children);
            return (
              <h4 id={id} className="scroll-mt-24 text-lg font-semibold mt-6 mb-2">
                {children}
              </h4>
            );
          },
          p: ({ children }) => (
            <p className="my-4 text-[15px] leading-[1.75] text-foreground/90">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-[15px] leading-relaxed text-foreground/90 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-[15px] leading-relaxed text-foreground/90 marker:text-muted-foreground marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => <CalloutRenderer>{children}</CalloutRenderer>,
          code: ({ className, children, ...props }) => {
            const isInline = !className && !String(children).includes('\n');
            if (isInline) {
              return (
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-primary" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border scrollbar-thin">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b border-border bg-muted/40">{children}</thead>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border px-4 py-3 text-foreground/80">{children}</td>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="my-6 rounded-xl border border-border shadow-lg" loading="lazy" />
          ),
          hr: () => <hr className="my-8 border-border" />,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

function slugifyFromChildren(children: ReactNode): string {
  const text = extractText(children);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Callout renderer — detects GitHub-style callout syntax:
 *   > [!NOTE]    > [!WARNING]    > [!TIP]
 * Falls back to a regular blockquote for non-callout quotes.
 */
function CalloutRenderer({ children }: { children: ReactNode }) {
  const raw = extractText(children);
  const calloutMatch = raw.match(/^\[!(NOTE|WARNING|TIP)\]/i);

  if (!calloutMatch) {
    return (
      <blockquote className="my-5 border-l-4 border-border pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    );
  }

  const type = calloutMatch[1].toUpperCase();
  const config = {
    NOTE: { className: 'border-primary/30 bg-primary/5 text-primary', label: 'Note' },
    WARNING: { className: 'border-warning/30 bg-warning/5 text-warning', label: 'Warning' },
    TIP: { className: 'border-success/30 bg-success/5 text-success', label: 'Tip' },
  }[type as 'NOTE' | 'WARNING' | 'TIP'];

  // Remove the [!TYPE] marker from children
  const cleaned = removeCalloutMarker(children);

  return (
    <div className={`my-5 flex gap-3 rounded-xl border p-4 ${config.className}`}>
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{config.label}</p>
        <div className="mt-1 text-sm leading-relaxed text-foreground/80 [&>p]:my-0 [&>p]:text-sm">
          {cleaned}
        </div>
      </div>
    </div>
  );
}

function removeCalloutMarker(node: ReactNode): ReactNode {
  if (typeof node === 'string') {
    return node.replace(/^\s*\[!(NOTE|WARNING|TIP)\]\s*/i, '');
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (i === 0 ? removeCalloutMarker(child) : child));
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as { props: { children?: ReactNode }; type: unknown };
    return {
      ...el,
      props: { ...el.props, children: removeCalloutMarker(el.props?.children) },
    } as ReactNode;
  }
  return node;
}

// suppress unused var
void COPY_CLASS;

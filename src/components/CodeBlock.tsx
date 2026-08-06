import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'bash', filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-[#0d1117] text-sm shadow-lg',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          {filename && (
            <span className="ml-3 font-mono text-xs text-slate-400">{filename}</span>
          )}
        </div>
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
        <code className={`language-${language}`}>{highlight(code, language)}</code>
      </pre>
    </div>
  );
}

function highlight(code: string, language: string) {
  const tokens: Record<string, string> = {
    '#': 'text-slate-500',
    '//': 'text-slate-500',
  };
  return code.split('\n').map((line, i) => {
    const isComment = line.trimStart().startsWith('#') || line.trimStart().startsWith('//');
    const cls = isComment ? tokens[line.trimStart()[0]] : '';
    if (isComment) {
      return (
        <span key={i} className={cls}>
          {line}
          {'\n'}
        </span>
      );
    }
    // basic keyword highlighting
    const parts = line.split(/(\s+)/);
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (language === 'bash') {
            if (j === 0 && part.trim()) return <span key={j} className="text-emerald-400">{part}</span>;
            if (part.startsWith('-')) return <span key={j} className="text-amber-400">{part}</span>;
            if (part.startsWith('$') || part.startsWith('{') || part.includes('}')) return <span key={j} className="text-sky-400">{part}</span>;
          }
          if (language === 'yaml' || language === 'dockerfile') {
            if (part.endsWith(':')) return <span key={j} className="text-sky-400">{part}</span>;
          }
          return <span key={j}>{part}</span>;
        })}
        {'\n'}
      </span>
    );
  });
}

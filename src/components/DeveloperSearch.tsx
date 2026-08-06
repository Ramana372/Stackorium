import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Command, Search, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestions = [
  'docker compose override',
  'kubernetes rollout undo',
  'git rebase interactive',
  'terraform backend config',
  'postgres index optimization',
  'react useReducer pattern',
];

interface SearchResult {
  title: string;
  type: string;
  path: string;
}

const mockResults: SearchResult[] = [
  { title: 'Docker Compose — Override Files', type: 'Documentation', path: 'devops / docker' },
  { title: 'kubectl rollout — Roll Back a Deployment', type: 'Command', path: 'devops / kubernetes' },
  { title: 'Interactive Rebase — Rewriting History', type: 'Tutorial', path: 'devops / git' },
  { title: 'Terraform Backend Configuration', type: 'Reference', path: 'devops / terraform' },
];

export function DeveloperSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const showResults = query.length > 0;

  return (
    <section id="search" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-Powered Search
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Find any command, concept, or tutorial
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Search across the entire Stackorium library. Ask in plain language and get
          precise answers with copy-ready code.
        </p>

        {/* Search bar */}
        <div className="relative mt-8 w-full">
          <div
            className={cn(
              'flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-all',
              focused
                ? 'border-primary shadow-glow ring-2 ring-primary/20'
                : 'border-border shadow-premium',
            )}
          >
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search documentation, commands, tutorials..."
              className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground sm:flex">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-glow"
              >
                <div className="p-2">
                  {mockResults.map((r) => (
                    <button
                      key={r.title}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Search className="h-4 w-4" />
                      </span>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">{r.title}</span>
                        <span className="text-xs text-muted-foreground">{r.path}</span>
                      </div>
                      <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {r.type}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
                <div className="border-t border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
                  Press <kbd className="font-mono">Enter</kbd> to view full results
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Trending:
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

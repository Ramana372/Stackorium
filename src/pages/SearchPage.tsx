import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Hash, Heading, Search, FileText } from 'lucide-react';
import { searchDocs } from '@/lib/content';
import { getCategoryMeta } from '@/lib/content';
import type { SearchResult } from '@/types';
import { Reveal } from '@/components/motion';

const typeIcons = {
  article: FileText,
  heading: Heading,
  tag: Hash,
};

const typeLabels = {
  article: 'Article',
  heading: 'Heading',
  tag: 'Tag',
};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchDocs(query, 30));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Search Documentation</h1>
          <p className="mt-3 text-muted-foreground">Search across all articles, headings, and tags.</p>
        </div>
      </Reveal>

      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation, commands, tutorials..."
          className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base shadow-premium outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {searched && results.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-16 text-center"
            >
              <Search className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
            </motion.div>
          )}

          {results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="mb-4 text-sm text-muted-foreground">{results.length} results found</p>
              {results.map((r) => {
                const Icon = typeIcons[r.type];
                const meta = getCategoryMeta(r.category);
                return (
                  <Link
                    key={`${r.slug}-${r.type}-${r.match}`}
                    to={`/docs/${r.slug.includes('/') ? r.slug : `${r.category}/${r.slug}`}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-premium"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold group-hover:text-primary">{r.title}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {meta.label} · {typeLabels[r.type]} · matched: <span className="font-mono">{r.match}</span>
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </Link>
                );
              })}
            </motion.div>
          )}

          {!searched && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-16"
            >
              <p className="text-sm text-muted-foreground">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['docker', 'kubernetes', 'git', 'terraform', 'react hooks', 'postgresql', 'system design'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

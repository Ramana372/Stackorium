import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Search, Terminal } from 'lucide-react';
import { commands, commandCategories, type CommandEntry } from '@/data/content';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';
import { cn } from '@/lib/utils';

const catColors: Record<string, string> = {
  Linux: 'from-amber-500 to-orange-500',
  Git: 'from-rose-500 to-pink-500',
  Docker: 'from-sky-500 to-blue-500',
  Kubernetes: 'from-indigo-500 to-violet-500',
  Terraform: 'from-violet-500 to-purple-500',
};

export function CommandExplorer() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('All');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return commands.filter((c) => {
      const matchesCat = activeCat === 'All' || c.category === activeCat;
      const q = query.toLowerCase();
      const matchesQuery =
        c.cmd.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.example.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, activeCat]);

  const tabs = ['All', ...commandCategories];

  const copy = async (entry: CommandEntry) => {
    try {
      await navigator.clipboard.writeText(entry.example);
      setCopied(entry.cmd);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <section id="commands" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeader
          eyebrow="Command Explorer"
          title={<>Search 500+ commands instantly</>}
          description="Filter by tool, search by keyword, and copy any command with one click."
        />
      </Reveal>

      {/* Controls */}
      <Reveal className="mt-10 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands... e.g. 'rollback', 'volume', 'rebase'"
            className="h-12 w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm shadow-premium outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCat(tab)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                activeCat === tab
                  ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Results */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((entry) => {
            const isCopied = copied === entry.cmd;
            return (
              <motion.div
                key={entry.cmd}
                layout
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-premium transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-md bg-gradient-to-r ${catColors[entry.category]} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white`}>
                    {entry.category}
                  </span>
                  <button
                    onClick={() => copy(entry)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Copy command"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4 shrink-0 text-primary" />
                  <code className="font-mono text-sm font-semibold">{entry.cmd}</code>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-[#0d1117] px-3 py-2 font-mono text-[12px] leading-relaxed text-slate-300 scrollbar-thin">
                  <code>{entry.example}</code>
                </pre>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No commands match "{query}". Try a different keyword.
          </p>
        </div>
      )}
    </section>
  );
}

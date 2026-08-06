import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Code2, Network, MessageSquare, GitBranch, Search } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  title: string;
  category: 'DSA' | 'System Design' | 'Design Patterns' | 'Behavioral';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companies: string[];
  tags: string[];
}

const questions: Question[] = [
  { id: 'q1', title: 'Two Sum — Find pairs that add to target', category: 'DSA', difficulty: 'Easy', companies: ['Google', 'Amazon', 'Microsoft'], tags: ['arrays', 'hashmap'] },
  { id: 'q2', title: 'LRU Cache Design', category: 'DSA', difficulty: 'Medium', companies: ['Meta', 'Apple', 'Uber'], tags: ['linked-list', 'hashmap', 'design'] },
  { id: 'q3', title: 'Design a URL Shortener', category: 'System Design', difficulty: 'Medium', companies: ['Google', 'Meta', 'Netflix'], tags: ['scalability', 'caching', 'encoding'] },
  { id: 'q4', title: 'Design a Rate Limiter', category: 'System Design', difficulty: 'Hard', companies: ['Stripe', 'Cloudflare', 'Uber'], tags: ['token-bucket', 'redis', 'distributed'] },
  { id: 'q5', title: 'Binary Tree Level Order Traversal', category: 'DSA', difficulty: 'Medium', companies: ['Amazon', 'Meta', 'Bloomberg'], tags: ['trees', 'bfs', 'queue'] },
  { id: 'q6', title: 'Implement the Singleton Pattern', category: 'Design Patterns', difficulty: 'Easy', companies: ['Oracle', 'IBM'], tags: ['creational', 'singleton'] },
  { id: 'q7', title: 'Factory Method Pattern in Practice', category: 'Design Patterns', difficulty: 'Medium', companies: ['Spring', 'Google'], tags: ['creational', 'factory', 'oop'] },
  { id: 'q8', title: 'Tell me about a time you handled conflict', category: 'Behavioral', difficulty: 'Easy', companies: ['All'], tags: ['star', 'teamwork'] },
  { id: 'q9', title: 'Design a Notification System', category: 'System Design', difficulty: 'Hard', companies: ['Meta', 'Twitter', 'Slack'], tags: ['queue', 'fanout', 'multi-platform'] },
  { id: 'q10', title: 'Longest Palindromic Substring', category: 'DSA', difficulty: 'Hard', companies: ['Google', 'Amazon', 'Meta'], tags: ['dp', 'strings', 'two-pointers'] },
  { id: 'q11', title: 'Observer Pattern for Event Systems', category: 'Design Patterns', difficulty: 'Medium', companies: ['Netflix', 'Spotify'], tags: ['behavioral', 'observer', 'events'] },
  { id: 'q12', title: 'Describe a project you are proud of', category: 'Behavioral', difficulty: 'Easy', companies: ['All'], tags: ['star', 'impact'] },
];

const categoryIcons = {
  DSA: Code2,
  'System Design': Network,
  'Design Patterns': GitBranch,
  Behavioral: MessageSquare,
};

const difficultyColors = {
  Easy: 'bg-success/10 text-success border-success/30',
  Medium: 'bg-warning/10 text-warning border-warning/30',
  Hard: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function InterviewPage() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('All');
  const [activeDiff, setActiveDiff] = useState<string>('All');

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesCat = activeCat === 'All' || q.category === activeCat;
      const matchesDiff = activeDiff === 'All' || q.difficulty === activeDiff;
      const qStr = query.toLowerCase();
      const matchesQuery = !qStr ||
        q.title.toLowerCase().includes(qStr) ||
        q.tags.some((t) => t.includes(qStr)) ||
        q.companies.some((c) => c.toLowerCase().includes(qStr));
      return matchesCat && matchesDiff && matchesQuery;
    });
  }, [query, activeCat, activeDiff]);

  const cats = ['All', 'DSA', 'System Design', 'Design Patterns', 'Behavioral'];
  const diffs = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeader
          eyebrow="Interview Preparation"
          title={<>Land the role you want</>}
          description="Curated questions with company tags, difficulty levels, and bookmarks."
        />
      </Reveal>

      <Reveal className="mt-10 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, companies, tags..."
            className="h-12 w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm shadow-premium outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                activeCat === cat ? 'border-primary bg-primary text-primary-foreground shadow-glow' : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
          <div className="mx-2 h-5 w-px bg-border" />
          {diffs.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDiff(diff)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                activeDiff === diff ? 'border-primary bg-primary text-primary-foreground shadow-glow' : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        {filtered.map((q, i) => {
          const Icon = categoryIcons[q.category];
          return (
            <motion.div
              key={q.id}
              variants={fadeUp}
              custom={i}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-premium transition-all hover:border-primary/30 hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold leading-tight group-hover:text-primary">{q.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{q.category}</p>
                  </div>
                </div>
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold', difficultyColors[q.difficulty])}>
                  {q.difficulty}
                </span>
                {q.companies.slice(0, 3).map((c) => (
                  <span key={c} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {q.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-primary/5 px-2 py-0.5 font-mono text-[11px] text-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No questions match your filters.</p>
        </div>
      )}
    </div>
  );
}

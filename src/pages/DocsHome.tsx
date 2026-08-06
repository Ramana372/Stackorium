import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, FileText } from 'lucide-react';
import { getAllCategories, getCategoryMeta, getTotalDocCount } from '@/lib/content';
import { staggerContainer, fadeUp } from '@/components/motion';
import { Reveal } from '@/components/motion';

export function DocsHome() {
  const categories = getAllCategories();
  const totalDocs = getTotalDocCount();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Documentation
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Browse all documentation
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {totalDocs} articles across {categories.length} categories. Everything from
            Linux commands to system design, organized and searchable.
          </p>
        </div>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {categories.map((cat) => {
          const meta = getCategoryMeta(cat.slug);
          return (
            <motion.div
              key={cat.slug}
              variants={fadeUp}
            >
              <Link
                to={`/docs/${cat.slug}`}
                className="group block rounded-2xl border border-border bg-card p-6 shadow-premium transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight">{meta.label}</h2>
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {cat.articles.length}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.description}</p>

                <div className="mt-4 space-y-1.5">
                  {cat.articles.slice(0, 3).map((article) => (
                    <div
                      key={article.slug}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground/80"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      <span className="truncate">{article.title}</span>
                    </div>
                  ))}
                  {cat.articles.length > 3 && (
                    <p className="flex items-center gap-1 text-xs font-medium text-primary">
                      View all {cat.articles.length} articles
                      <ChevronRight className="h-3 w-3" />
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

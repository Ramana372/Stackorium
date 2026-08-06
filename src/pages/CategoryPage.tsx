import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Clock, FileText } from 'lucide-react';
import { getCategoryBySlug, getCategoryMeta } from '@/lib/content';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = category ? getCategoryBySlug(category) : undefined;
  const meta = category ? getCategoryMeta(category) : undefined;

  if (!cat || !meta) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">This documentation category doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link to="/docs">Browse all docs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{meta.label}</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{meta.label}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{meta.description}</p>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-10 space-y-3"
      >
        {cat.articles.map((article, i) => (
          <motion.div key={article.slug} variants={fadeUp} custom={i}>
            <Link
              to={`/docs/${cat.slug}/${article.slug.replace(`${cat.slug}/`, '')}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-premium"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-tight group-hover:text-primary">{article.title}</h2>
                <p className="mt-1 truncate text-sm text-muted-foreground">{article.description}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime} min
                  </span>
                  {article.difficulty && (
                    <span className="capitalize">{article.difficulty}</span>
                  )}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Star,
  Tag,
} from 'lucide-react';
import { getDocByCategorySlug, getAdjacentArticles, getCategoryMeta } from '@/lib/content';
import { extractToc } from '@/lib/markdown';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { useReadingProgress } from '@/hooks/use-reading-progress';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/hooks/use-toast';
import {
  markArticleCompleted,
  unmarkArticleCompleted,
  isArticleCompleted,
  addBookmark,
  removeBookmark,
  isBookmarked,
  addFavorite,
  removeFavorite,
  isFavorited,
  recordReading,
} from '@/services/progress';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ArticlePage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const readingProgress = useReadingProgress();

  const article = useMemo(() => {
    if (!category || !slug) return undefined;
    return getDocByCategorySlug(category, slug);
  }, [category, slug]);

  const toc = useMemo(() => (article ? extractToc(article.content) : []), [article]);
  const activeHeading = useScrollSpy(toc);

  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [helpfulChoice, setHelpfulChoice] = useState<'yes' | 'no' | null>(null);

  const { prev, next } = useMemo(
    () => (article ? getAdjacentArticles(article.path) : {}),
    [article],
  );

  useEffect(() => {
    if (!article || !user) return;
    isArticleCompleted(article.slug).then(({ completed: c }) => setCompleted(c));
    isBookmarked(article.slug).then(({ bookmarked: b }) => setBookmarked(b));
    isFavorited(article.slug).then(({ favorited: f }) => setFavorited(f));
  }, [article, user]);

  // Record reading history periodically
  useEffect(() => {
    if (!article || !user) return;
    const interval = setInterval(() => {
      const pos = readingProgress / 100;
      recordReading(article.slug, article.category, article.title, pos);
    }, 8000);
    return () => clearInterval(interval);
  }, [article, user, readingProgress]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="mt-2 text-muted-foreground">This documentation page doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link to="/docs">Browse all docs</Link>
        </Button>
      </div>
    );
  }

  const meta = getCategoryMeta(article.category);
  const difficultyColors = {
    beginner: 'bg-success/10 text-success border-success/30',
    intermediate: 'bg-warning/10 text-warning border-warning/30',
    advanced: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  const handleComplete = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (completed) {
      const { error } = await unmarkArticleCompleted(article.slug);
      if (error) {
        toast({ title: 'Unable to update progress', description: error.message, variant: 'destructive' });
        return;
      }
      setCompleted(false);
    } else {
      const { error } = await markArticleCompleted(article.slug, article.category);
      if (error) {
        toast({ title: 'Unable to update progress', description: error.message, variant: 'destructive' });
        return;
      }
      setCompleted(true);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (bookmarked) {
      const { error } = await removeBookmark(article.slug);
      if (error) {
        toast({ title: 'Unable to update bookmark', description: error.message, variant: 'destructive' });
        return;
      }
      setBookmarked(false);
    } else {
      const { error } = await addBookmark(article.slug, article.category, article.title);
      if (error) {
        toast({ title: 'Unable to update bookmark', description: error.message, variant: 'destructive' });
        return;
      }
      setBookmarked(true);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (favorited) {
      const { error } = await removeFavorite(article.slug);
      if (error) {
        toast({ title: 'Unable to update favorite', description: error.message, variant: 'destructive' });
        return;
      }
      setFavorited(false);
    } else {
      const { error } = await addFavorite(article.slug, article.category, article.title);
      if (error) {
        toast({ title: 'Unable to update favorite', description: error.message, variant: 'destructive' });
        return;
      }
      setFavorited(true);
    }
  };

  const handleHelpful = (choice: 'yes' | 'no') => {
    setHelpfulChoice(choice);
    toast({
      title: choice === 'yes' ? 'Thanks for your feedback' : 'Feedback recorded',
      description:
        choice === 'yes' ? 'Glad this article was helpful.' : 'We will improve this article.',
    });
  };

  return (
    <div className="relative">
      {/* Reading progress bar */}
      <div className="fixed left-0 top-16 z-40 h-0.5 w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Content */}
        <article className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/docs" className="hover:text-foreground">Docs</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/docs/${article.category}`} className="hover:text-foreground">{meta.label}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-foreground">{article.title}</span>
          </div>

          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{article.title}</h1>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{article.description}</p>

            {/* Meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
              {article.difficulty && (
                <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', difficultyColors[article.difficulty])}>
                  {article.difficulty}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {article.readingTime} min read
              </span>
              {article.tags.length > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <div className="flex gap-1.5">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex items-center gap-2 border-y border-border py-3">
              <Button
                variant={completed ? 'default' : 'outline'}
                size="sm"
                onClick={handleComplete}
                className={cn(completed && 'bg-success text-success-foreground hover:bg-success/90')}
              >
                <Check className="h-4 w-4" />
                {completed ? 'Completed' : 'Mark Complete'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-primary text-primary')} />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleFavorite}>
                <Heart className={cn('h-4 w-4', favorited && 'fill-rose-500 text-rose-500')} />
                Favorite
              </Button>
            </div>
          </motion.div>

          {/* Markdown content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <MarkdownRenderer content={article.content} />
          </motion.div>

          {/* Prev / Next navigation */}
          <div className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/docs/${prev.category}/${prev.slug.replace(`${prev.category}/`, '')}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-premium"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </span>
                <span className="mt-1 text-sm font-semibold group-hover:text-primary">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={`/docs/${next.category}/${next.slug.replace(`${next.category}/`, '')}`}
                className="group flex flex-col items-end rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-primary/40 hover:shadow-premium"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 text-sm font-semibold group-hover:text-primary">{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>

        {/* Right TOC */}
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
            <ul className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto scrollbar-thin">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      'block border-l-2 py-1 text-sm transition-colors',
                      item.level === 3 ? 'pl-4' : 'pl-3',
                      activeHeading === item.id
                        ? 'border-primary font-medium text-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Star className="h-4 w-4 text-primary" />
                Was this helpful?
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleHelpful('yes')}
                  className={cn(
                    'flex-1 rounded-lg border bg-card py-1.5 text-xs font-medium transition-colors',
                    helpfulChoice === 'yes'
                      ? 'border-success/60 text-success'
                      : 'border-border hover:border-success/40 hover:text-success',
                  )}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleHelpful('no')}
                  className={cn(
                    'flex-1 rounded-lg border bg-card py-1.5 text-xs font-medium transition-colors',
                    helpfulChoice === 'no'
                      ? 'border-destructive/60 text-destructive'
                      : 'border-border hover:border-destructive/40 hover:text-destructive',
                  )}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

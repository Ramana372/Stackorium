import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  TrendingUp,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  getProgressStats,
  getBookmarks,
  getFavorites,
  getReadingHistory,
  getCompletedArticles,
} from '@/services/progress';
import type { ProgressStats, Bookmark as BookmarkType, Favorite, ReadingHistoryEntry, CompletedArticle } from '@/types';
import { getCategoryMeta } from '@/lib/content';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ProgressPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);
  const [completed, setCompleted] = useState<CompletedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    Promise.all([
      getProgressStats(),
      getBookmarks(),
      getFavorites(),
      getReadingHistory(),
      getCompletedArticles(),
    ]).then(([s, b, f, h, c]) => {
      setStats(s);
      setBookmarks(b.data);
      setFavorites(f.data);
      setHistory(h.data);
      setCompleted(c.data);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { icon: CheckCircle2, label: 'Completed', value: stats?.totalCompleted ?? 0, color: 'from-emerald-500 to-teal-500' },
    { icon: Bookmark, label: 'Bookmarks', value: stats?.totalBookmarks ?? 0, color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, label: 'Favorites', value: stats?.totalFavorites ?? 0, color: 'from-rose-500 to-pink-500' },
    { icon: Flame, label: 'Day Streak', value: stats?.streak ?? 0, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Learning Progress</h1>
            <p className="mt-2 text-muted-foreground">Welcome back, {profile?.full_name ?? user.email}</p>
          </div>
          <div className="hidden rounded-2xl border border-border bg-card px-5 py-3 text-center shadow-premium sm:block">
            <p className="text-3xl font-extrabold text-gradient-primary">{stats?.completionRate.toFixed(0) ?? 0}%</p>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </div>
        </div>
      </Reveal>

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-border bg-card p-5 shadow-premium">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Category progress */}
      {stats && stats.categoryProgress.length > 0 && (
        <Reveal className="mt-8">
          <h2 className="text-xl font-bold tracking-tight">Category Progress</h2>
          <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-6 shadow-premium">
            {stats.categoryProgress.map((cp) => {
              const meta = getCategoryMeta(cp.category);
              const pct = cp.total > 0 ? (cp.completed / cp.total) * 100 : 0;
              return (
                <div key={cp.category}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{meta.label}</span>
                    <span className="text-muted-foreground">{cp.completed} / {cp.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Continue reading */}
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Continue Reading</h2>
            </div>
            <div className="mt-4 space-y-2">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reading history yet. Start reading some docs!</p>
              ) : (
                history.slice(0, 5).map((h) => (
                  <Link
                    key={h.id}
                    to={`/docs/${h.article_slug.includes('/') ? h.article_slug : `${h.category}/${h.article_slug}`}`}
                    className="group flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium group-hover:text-primary">{h.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${h.scroll_position * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{Math.round(h.scroll_position * 100)}%</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </Reveal>

        {/* Completed */}
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h2 className="text-lg font-bold">Recently Completed</h2>
            </div>
            <div className="mt-4 space-y-2">
              {completed.length === 0 ? (
                <p className="text-sm text-muted-foreground">No completed articles yet. Mark an article complete while reading!</p>
              ) : (
                completed.slice(0, 5).map((c) => (
                  <Link
                    key={c.id}
                    to={`/docs/${c.article_slug.includes('/') ? c.article_slug : `${c.category}/${c.article_slug}`}`}
                    className="group flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
                  >
                    <span className="truncate text-sm font-medium group-hover:text-primary">{c.article_slug}</span>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </Reveal>

        {/* Bookmarks */}
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Bookmarks</h2>
            </div>
            <div className="mt-4 space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookmarks yet. Save articles for later!</p>
              ) : (
                bookmarks.slice(0, 5).map((b) => (
                  <Link
                    key={b.id}
                    to={`/docs/${b.article_slug.includes('/') ? b.article_slug : `${b.category}/${b.article_slug}`}`}
                    className="group flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
                  >
                    <span className="truncate text-sm font-medium group-hover:text-primary">{b.title}</span>
                    <Bookmark className="h-4 w-4 shrink-0 fill-primary text-primary" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </Reveal>

        {/* Favorites */}
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <h2 className="text-lg font-bold">Favorites</h2>
            </div>
            <div className="mt-4 space-y-2">
              {favorites.length === 0 ? (
                <p className="text-sm text-muted-foreground">No favorites yet. Star articles you love!</p>
              ) : (
                favorites.slice(0, 5).map((f) => (
                  <Link
                    key={f.id}
                    to={`/docs/${f.article_slug.includes('/') ? f.article_slug : `${f.category}/${f.article_slug}`}`}
                    className="group flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
                  >
                    <span className="truncate text-sm font-medium group-hover:text-primary">{f.title}</span>
                    <Heart className="h-4 w-4 shrink-0 fill-rose-500 text-rose-500" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

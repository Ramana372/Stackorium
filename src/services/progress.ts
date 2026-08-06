import { supabase } from './supabase';
import type {
  CompletedArticle,
  ReadingHistoryEntry,
  Bookmark,
  Favorite,
  ProgressStats,
} from '@/types';
import { getAllDocEntries } from '@/lib/content';

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

function notAuthenticatedError() {
  return new Error('Not authenticated');
}

// ---- Completed Articles ----
export async function markArticleCompleted(slug: string, category: string) {
  const userId = await getUserId();
  if (!userId) return { data: null, error: notAuthenticatedError() };

  await supabase
    .from('completed_articles')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  const { data, error } = await supabase
    .from('completed_articles')
    .insert({ user_id: userId, article_slug: slug, category })
    .select()
    .single();

  return { data: data as CompletedArticle | null, error };
}

export async function unmarkArticleCompleted(slug: string) {
  const userId = await getUserId();
  if (!userId) return { error: notAuthenticatedError() };

  const { error } = await supabase
    .from('completed_articles')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  return { error };
}

export async function getCompletedArticles() {
  const userId = await getUserId();
  if (!userId) return { data: [], error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('completed_articles')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  return { data: (data ?? []) as CompletedArticle[], error };
}

export async function isArticleCompleted(slug: string) {
  const userId = await getUserId();
  if (!userId) return { completed: false, error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('completed_articles')
    .select('id')
    .eq('user_id', userId)
    .eq('article_slug', slug)
    .maybeSingle();

  return { completed: !!data && !error, error };
}

// ---- Reading History ----
export async function recordReading(
  slug: string,
  category: string,
  title: string,
  scrollPosition: number,
) {
  const userId = await getUserId();
  if (!userId) return { data: null, error: notAuthenticatedError() };

  await supabase
    .from('reading_history')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  const { data, error } = await supabase
    .from('reading_history')
    .insert({
      user_id: userId,
      article_slug: slug,
      category,
      title,
      scroll_position: scrollPosition,
    })
    .select()
    .single();

  return { data: data as ReadingHistoryEntry | null, error };
}

export async function getReadingHistory() {
  const userId = await getUserId();
  if (!userId) return { data: [], error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('reading_history')
    .select('*')
    .eq('user_id', userId)
    .order('read_at', { ascending: false })
    .limit(20);

  return { data: (data ?? []) as ReadingHistoryEntry[], error };
}

export async function clearReadingHistory() {
  const userId = await getUserId();
  if (!userId) return { error: notAuthenticatedError() };

  const { error } = await supabase
    .from('reading_history')
    .delete()
    .eq('user_id', userId);

  return { error };
}

// ---- Bookmarks ----
export async function addBookmark(slug: string, category: string, title: string) {
  const userId = await getUserId();
  if (!userId) return { data: null, error: notAuthenticatedError() };

  await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ user_id: userId, article_slug: slug, category, title })
    .select()
    .single();

  return { data: data as Bookmark | null, error };
}

export async function getBookmarks() {
  const userId = await getUserId();
  if (!userId) return { data: [], error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: (data ?? []) as Bookmark[], error };
}

export async function removeBookmark(slug: string) {
  const userId = await getUserId();
  if (!userId) return { error: notAuthenticatedError() };

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  return { error };
}

export async function isBookmarked(slug: string) {
  const userId = await getUserId();
  if (!userId) return { bookmarked: false, error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('article_slug', slug)
    .maybeSingle();

  return { bookmarked: !!data && !error, error };
}

// ---- Favorites ----
export async function addFavorite(slug: string, category: string, title: string) {
  const userId = await getUserId();
  if (!userId) return { data: null, error: notAuthenticatedError() };

  await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, article_slug: slug, category, title })
    .select()
    .single();

  return { data: data as Favorite | null, error };
}


export async function removeFavorite(slug: string) {
  const userId = await getUserId();
  if (!userId) return { error: notAuthenticatedError() };

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('article_slug', slug);

  return { error };
}

export async function getFavorites() {
  const userId = await getUserId();
  if (!userId) return { data: [], error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: (data ?? []) as Favorite[], error };
}

export async function isFavorited(slug: string) {
  const userId = await getUserId();
  if (!userId) return { favorited: false, error: notAuthenticatedError() };

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('article_slug', slug)
    .maybeSingle();

  return { favorited: !!data && !error, error };
}

// ---- Stats ----

export async function getProgressStats(): Promise<ProgressStats> {
  const [completed, bookmarks, favorites, profile] = await Promise.all([
    getCompletedArticles(),
    getBookmarks(),
    getFavorites(),
    supabase.auth.getUser(),
  ]);

  const userId = profile.data.user?.id;
  const streakCount = 0;

  const allDocs = getAllDocEntries();
  const categoryMap = new Map<string, { completed: number; total: number }>();

  for (const doc of allDocs) {
    const existing = categoryMap.get(doc.category) ?? { completed: 0, total: 0 };
    existing.total += 1;
    categoryMap.set(doc.category, existing);
  }

  for (const c of completed.data) {
    const existing = categoryMap.get(c.category);
    if (existing) existing.completed += 1;
  }

  const totalArticles = allDocs.length;
  const totalCompleted = completed.data.length;

  return {
    totalCompleted,
    totalBookmarks: bookmarks.data.length,
    totalFavorites: favorites.data.length,
    streak: userId ? streakCount : 0,
    categoryProgress: Array.from(categoryMap.entries()).map(([category, v]) => ({
      category,
      completed: v.completed,
      total: v.total,
    })),
    completionRate: totalArticles > 0 ? (totalCompleted / totalArticles) * 100 : 0,
  };
}
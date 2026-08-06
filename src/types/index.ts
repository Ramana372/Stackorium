export interface DocFrontmatter {
  title: string;
  description: string;
  category: string;
  slug: string;
  order?: number;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  author?: string;
  updatedAt?: string;
  draft?: boolean;
}

export interface DocEntry {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  order: number;
  difficulty: DocFrontmatter['difficulty'];
  content: string;
  wordCount: number;
  readingTime: number;
  path: string;
  filePath: string;
}

export interface DocCategory {
  slug: string;
  label: string;
  description: string;
  icon: string;
  articles: DocEntry[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface SearchResult {
  type: 'article' | 'heading' | 'tag';
  slug: string;
  title: string;
  description: string;
  category: string;
  match: string;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  streak_count: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompletedArticle {
  id: string;
  user_id: string;
  article_slug: string;
  category: string;
  completed_at: string;
}

export interface ReadingHistoryEntry {
  id: string;
  user_id: string;
  article_slug: string;
  category: string;
  title: string;
  scroll_position: number;
  read_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  article_slug: string;
  category: string;
  title: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  article_slug: string;
  category: string;
  title: string;
  created_at: string;
}

export interface ProgressStats {
  totalCompleted: number;
  totalBookmarks: number;
  totalFavorites: number;
  streak: number;
  categoryProgress: { category: string; completed: number; total: number }[];
  completionRate: number;
}

export type AuthProvider = 'google' | 'github';

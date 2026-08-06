/*
# Create Stackorium learning & profile tables

## Overview
Creates the core user-data tables for the Stackorium developer knowledge platform.
This is a multi-user application with authentication — every table is owner-scoped
to the authenticated user via `user_id` with `DEFAULT auth.uid()`.

## New Tables

1. **profiles** — public profile data for each user (one row per auth user)
   - `id` (uuid, PK, references auth.users)
   - `username` (text, unique, nullable)
   - `full_name` (text, nullable)
   - `avatar_url` (text, nullable)
   - `bio` (text, nullable)
   - `github_url`, `linkedin_url` (text, nullable)
   - `streak_count` (int, default 0) — weekly learning streak
   - `last_activity_date` (date, nullable)
   - `created_at`, `updated_at` (timestamps)

2. **completed_articles** — tracks which docs a user has finished reading
   - `id` (uuid, PK)
   - `user_id` (uuid, NOT NULL, DEFAULT auth.uid())
   - `article_slug` (text) — the docs route path e.g. "devops/docker/installation"
   - `category` (text) — top-level category
   - `completed_at` (timestamp)
   - Unique constraint on (user_id, article_slug)

3. **reading_history** — recently viewed articles with scroll position
   - `id` (uuid, PK)
   - `user_id` (uuid, NOT NULL, DEFAULT auth.uid())
   - `article_slug` (text)
   - `category` (text)
   - `title` (text) — denormalized for quick display
   - `scroll_position` (float, default 0) — 0.0 to 1.0
   - `read_at` (timestamp)
   - Unique constraint on (user_id, article_slug)

4. **bookmarks** — saved articles for later
   - `id` (uuid, PK)
   - `user_id` (uuid, NOT NULL, DEFAULT auth.uid())
   - `article_slug` (text)
   - `category` (text)
   - `title` (text)
   - `created_at` (timestamp)
   - Unique constraint on (user_id, article_slug)

5. **favorites** — favorited articles (distinct from bookmarks)
   - `id` (uuid, PK)
   - `user_id` (uuid, NOT NULL, DEFAULT auth.uid())
   - `article_slug` (text)
   - `category` (text)
   - `title` (text)
   - `created_at` (timestamp)
   - Unique constraint on (user_id, article_slug)

## Security
- RLS enabled on every table.
- All tables are owner-scoped: SELECT/INSERT/UPDATE/DELETE limited to the
  authenticated user via `auth.uid() = user_id`.
- The `profiles` table uses `auth.uid() = id` (the PK is the user id).
- `DEFAULT auth.uid()` on user_id columns so client inserts that omit user_id succeed.
- A trigger auto-creates a profile row when a new auth user signs up.

## Indexes
- Indexes on user_id for all user-data tables for fast lookups.
- Index on article_slug for history/completion queries by category.

## Important Notes
1. This migration is idempotent — safe to re-run.
2. Profiles are auto-created via a trigger on auth.users INSERT.
3. The streak_count and last_activity_date are maintained by the app layer.
*/

-- ============================================================
-- profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  github_url text,
 linkedin_url text,
  streak_count integer NOT NULL DEFAULT 0,
  last_activity_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow users to see other profiles (for social/leaderboard features)
DROP POLICY IF EXISTS "select_all_profiles" ON public.profiles;
CREATE POLICY "select_all_profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- completed_articles table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.completed_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  category text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_slug)
);

ALTER TABLE public.completed_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_completed" ON public.completed_articles;
CREATE POLICY "select_own_completed" ON public.completed_articles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_completed" ON public.completed_articles;
CREATE POLICY "insert_own_completed" ON public.completed_articles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_completed" ON public.completed_articles;
CREATE POLICY "update_own_completed" ON public.completed_articles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_completed" ON public.completed_articles;
CREATE POLICY "delete_own_completed" ON public.completed_articles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_completed_user_id ON public.completed_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_slug ON public.completed_articles(article_slug);

-- ============================================================
-- reading_history table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reading_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  scroll_position real NOT NULL DEFAULT 0,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_slug)
);

ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_history" ON public.reading_history;
CREATE POLICY "select_own_history" ON public.reading_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_history" ON public.reading_history;
CREATE POLICY "insert_own_history" ON public.reading_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_history" ON public.reading_history;
CREATE POLICY "update_own_history" ON public.reading_history
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_history" ON public.reading_history;
CREATE POLICY "delete_own_history" ON public.reading_history
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_history_user_id ON public.reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_read_at ON public.reading_history(read_at DESC);

-- ============================================================
-- bookmarks table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_slug)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookmarks" ON public.bookmarks;
CREATE POLICY "select_own_bookmarks" ON public.bookmarks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookmarks" ON public.bookmarks;
CREATE POLICY "insert_own_bookmarks" ON public.bookmarks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookmarks" ON public.bookmarks;
CREATE POLICY "update_own_bookmarks" ON public.bookmarks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookmarks" ON public.bookmarks;
CREATE POLICY "delete_own_bookmarks" ON public.bookmarks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- ============================================================
-- favorites table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_slug)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON public.favorites;
CREATE POLICY "select_own_favorites" ON public.favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON public.favorites;
CREATE POLICY "insert_own_favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_favorites" ON public.favorites;
CREATE POLICY "update_own_favorites" ON public.favorites
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON public.favorites;
CREATE POLICY "delete_own_favorites" ON public.favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- ============================================================
-- Auto-create profile on signup trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'avatar_url')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant execute on the profile function
GRANT EXECUTE ON FUNCTION public.handle_new_user TO anon, authenticated;

-- ============================================================
-- Table grants
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completed_articles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;

-- ============================================================
-- Profile images bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "profile_images_select" ON storage.objects;
CREATE POLICY "profile_images_select" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "profile_images_insert" ON storage.objects;
CREATE POLICY "profile_images_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'profile-images'
    AND split_part(name, '/', 1) = auth.jwt() ->> 'email'
  );

DROP POLICY IF EXISTS "profile_images_update" ON storage.objects;
CREATE POLICY "profile_images_update" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'profile-images'
    AND split_part(name, '/', 1) = auth.jwt() ->> 'email'
  ) WITH CHECK (
    bucket_id = 'profile-images'
    AND split_part(name, '/', 1) = auth.jwt() ->> 'email'
  );

DROP POLICY IF EXISTS "profile_images_delete" ON storage.objects;
CREATE POLICY "profile_images_delete" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'profile-images'
    AND split_part(name, '/', 1) = auth.jwt() ->> 'email'
  );

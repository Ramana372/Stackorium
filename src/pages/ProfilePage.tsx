import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Flame,
  ImagePlus,
  Github,
  Heart,
  Linkedin,
  Lock,
  Save,
  Trash2,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getProgressStats, getBookmarks, getFavorites, getCompletedArticles } from '@/services/progress';
import type { ProgressStats, Bookmark as BookmarkType, Favorite, CompletedArticle } from '@/types';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updatePassword, updateProfile, uploadProfileAvatar, deleteProfileAvatar, getAvatarPathFromUrl } from '@/services/auth';

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [completed, setCompleted] = useState<CompletedArticle[]>([]);
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getProgressStats(),
      getBookmarks(),
      getFavorites(),
      getCompletedArticles(),
    ]).then(([s, b, f, c]) => {
      setStats(s);
      setBookmarks(b.data);
      setFavorites(f.data);
      setCompleted(c.data);
    });
  }, [user]);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
  }, [profile]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const displayAvatarUrl = useMemo(() => avatarPreview ?? profile?.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name ?? user?.email ?? 'user'}`, [avatarPreview, profile?.avatar_url, profile?.full_name, user?.email]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-2xl font-bold">Sign in to view your profile</h1>
        <Button asChild className="mt-6"><Link to="/auth/login">Sign In</Link></Button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      let nextAvatarUrl = profile?.avatar_url ?? null;

      if (avatarFile) {
        if (profile?.avatar_url) {
          await deleteProfileAvatar(getAvatarPathFromUrl(profile.avatar_url) ?? profile.avatar_url);
        }

        const uploadResult = await uploadProfileAvatar(user.email ?? 'user', avatarFile);
        if (uploadResult.error) throw uploadResult.error;
        nextAvatarUrl = uploadResult.data?.publicUrl ?? nextAvatarUrl;
      }

      const profileResult = await updateProfile(user.id, {
        full_name: fullName,
        avatar_url: nextAvatarUrl,
      });

      if (profileResult.error) throw profileResult.error;

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const passwordResult = await updatePassword(newPassword);
        if (passwordResult.error) throw passwordResult.error;
      }

      await refreshProfile();
      setAvatarFile(null);
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Profile updated successfully.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.avatar_url) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const deleteResult = await deleteProfileAvatar(profile.avatar_url);
      if (deleteResult.error) throw deleteResult.error;

      const profileResult = await updateProfile(user.id, { avatar_url: null });
      if (profileResult.error) throw profileResult.error;

      await refreshProfile();
      setAvatarFile(null);
      setMessage('Profile image removed.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete avatar.');
    } finally {
      setSaving(false);
    }
  };

  const achievements = [
    { icon: CheckCircle2, label: 'First Article', unlocked: completed.length >= 1, color: 'from-emerald-500 to-teal-500' },
    { icon: Bookmark, label: 'First Bookmark', unlocked: bookmarks.length >= 1, color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, label: 'First Favorite', unlocked: favorites.length >= 1, color: 'from-rose-500 to-pink-500' },
    { icon: TrendingUp, label: '5 Articles Done', unlocked: completed.length >= 5, color: 'from-violet-500 to-fuchsia-500' },
    { icon: Flame, label: '3-Day Streak', unlocked: (stats?.streak ?? 0) >= 3, color: 'from-orange-500 to-amber-500' },
    { icon: Trophy, label: '10 Articles Done', unlocked: completed.length >= 10, color: 'from-yellow-500 to-amber-500' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile header */}
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 shadow-premium sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24 rounded-2xl border border-border shadow-lg">
            <AvatarImage src={displayAvatarUrl} alt="Profile" className="object-cover" />
            <AvatarFallback className="rounded-2xl text-xl font-semibold">
              {(profile?.full_name ?? user.email ?? 'U').slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">{profile?.full_name ?? 'Developer'}</h1>
            <p className="mt-1 text-muted-foreground">{user.email}</p>
            {profile?.bio && <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {profile?.github_url && (
                <a href={profile.github_url} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-6">
        <form onSubmit={handleSaveProfile} className="rounded-3xl border border-border bg-card p-6 shadow-premium">
          <div className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Edit Profile</h2>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Display Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat the new password"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/80 bg-muted/20 p-4">
              <div>
                <p className="text-sm font-medium">Profile Image</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Saved to Supabase Storage under your email folder.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={displayAvatarUrl} alt="Avatar preview" className="object-cover" />
                  <AvatarFallback>{(profile?.full_name ?? user.email ?? 'U').slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                    <ImagePlus className="h-4 w-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {avatarFile ? avatarFile.name : 'PNG, JPG, WEBP, or GIF.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => setAvatarFile(null)} disabled={!avatarFile || saving}>
                  Clear Selected
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteAvatar}
                  disabled={!profile?.avatar_url || saving}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Delete Avatar
                </Button>
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          {message && <p className="mt-4 text-sm text-success">{message}</p>}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving} className="gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-glow hover:opacity-90">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/progress">Go to Dashboard</Link>
            </Button>
          </div>
        </form>
      </Reveal>

      {/* Stats summary */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {[
          { icon: CheckCircle2, label: 'Completed', value: stats?.totalCompleted ?? 0 },
          { icon: Bookmark, label: 'Bookmarks', value: stats?.totalBookmarks ?? 0 },
          { icon: Heart, label: 'Favorites', value: stats?.totalFavorites ?? 0 },
          { icon: Flame, label: 'Streak', value: stats?.streak ?? 0 },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={fadeUp} className="rounded-2xl border border-border bg-card p-5 shadow-premium">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Achievements */}
      <Reveal className="mt-8">
        <h2 className="text-xl font-bold tracking-tight">Achievements</h2>
      </Reveal>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {achievements.map((a) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.label}
              variants={fadeUp}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${a.unlocked ? 'border-border bg-card shadow-premium' : 'border-border/50 bg-muted/20 opacity-50'}`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.unlocked ? `bg-gradient-to-br ${a.color} text-white` : 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium">{a.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Reading history & completed */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Completed Topics</h2>
            </div>
            <div className="mt-4 space-y-2">
              {completed.length === 0 ? (
                <p className="text-sm text-muted-foreground">No completed articles yet.</p>
              ) : (
                completed.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    to={`/docs/${c.article_slug.includes('/') ? c.article_slug : `${c.category}/${c.article_slug}`}`}
                    className="group flex items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40"
                  >
                    <span className="truncate flex-1 group-hover:text-primary">{c.article_slug}</span>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Bookmarks</h2>
            </div>
            <div className="mt-4 space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookmarks yet.</p>
              ) : (
                bookmarks.slice(0, 6).map((b) => (
                  <Link
                    key={b.id}
                    to={`/docs/${b.article_slug.includes('/') ? b.article_slug : `${b.category}/${b.article_slug}`}`}
                    className="group flex items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40"
                  >
                    <span className="truncate flex-1 group-hover:text-primary">{b.title}</span>
                    <Bookmark className="h-4 w-4 shrink-0 fill-primary text-primary" />
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

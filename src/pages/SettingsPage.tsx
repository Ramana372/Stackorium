import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { updateProfile, signOut } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion';

export function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
      setGithubUrl(profile.github_url ?? '');
      setLinkedinUrl(profile.linkedin_url ?? '');
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-2xl font-bold">Sign in to access settings</h1>
        <Button asChild className="mt-6"><Link to="/auth/login">Sign In</Link></Button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(user.id, {
      full_name: fullName,
      username,
      bio,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
    });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="Stackorium logo" className="h-9 w-9 rounded-xl object-cover shadow-glow" />
          <h1 className="text-2xl font-extrabold tracking-tight">Account Settings</h1>
        </div>
      </Reveal>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <h2 className="text-lg font-bold">Profile</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="janedev"
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-premium">
            <h2 className="text-lg font-bold">Social Links</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">GitHub URL</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-glow hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={handleSignOut} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}

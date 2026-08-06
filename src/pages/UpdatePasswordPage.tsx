import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updatePassword } from '@/services/auth';

export function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const { error } = await updatePassword(password);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 1800);
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-border bg-card p-8 shadow-premium">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/Logo.png" alt="Stackorium logo" className="h-10 w-10 rounded-xl object-cover shadow-glow" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose a password for your account.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Password updated
            </div>
            <p className="mt-2 text-muted-foreground">Redirecting you to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat the password"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-glow hover:opacity-90"
            >
              {loading ? 'Updating...' : 'Update Password'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
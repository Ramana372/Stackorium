import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendPasswordReset } from '@/services/auth';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);

    const { error } = await sendPasswordReset(email);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
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
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We’ll email a link to set a new password.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {sent ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Email sent
            </div>
            <p className="mt-2 text-muted-foreground">
              Check your inbox for the reset link. If it does not appear, check spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-glow hover:opacity-90"
            >
              {loading ? 'Sending...' : 'Send reset link'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link to="/auth/login" className="font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
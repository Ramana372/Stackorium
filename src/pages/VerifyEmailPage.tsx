import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'signed-in' | 'confirmed' | 'failed'>('loading');
  const [message, setMessage] = useState('Confirming your email. Please wait...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await supabase.auth.initialize();
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          await refreshProfile();
          setStatus('signed-in');
          navigate('/progress');
          return;
        }

        setStatus('confirmed');
        setMessage('Your email has been verified. Please sign in to continue.');
      } catch (error) {
        setStatus('failed');
        setMessage('Unable to confirm your email automatically. Please sign in again.');
        console.error('Email verification handler error:', error);
      }
    };

    verifyEmail();
  }, [navigate, refreshProfile]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="w-full rounded-3xl border border-border bg-card p-10 shadow-premium">
        <h1 className="text-3xl font-bold tracking-tight">Email verification</h1>
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>

        {status === 'loading' && <div className="mt-8 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />}

        {(status === 'confirmed' || status === 'failed') && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild>
              <Link to="/auth/login">Sign in</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <Compass className="h-12 w-12 text-muted-foreground/40" />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">This page wandered off the roadmap.</p>
      <Button asChild className="mt-6 gap-2 bg-gradient-to-r from-primary to-accent text-white">
        <Link to="/"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
      </Button>
    </div>
  );
}

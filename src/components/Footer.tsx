import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerColumns = [
  {
    title: 'Documentation',
    links: [
      { label: 'DevOps', to: '/docs/devops' },
      { label: 'Cloud', to: '/docs/cloud' },
      { label: 'Programming', to: '/docs/programming' },
      { label: 'Web Development', to: '/docs/web-development' },
      { label: 'Databases', to: '/docs/databases' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Cheat Sheets', to: '/cheatsheets' },
      { label: 'Search', to: '/search' },
      { label: 'Dashboard', to: '/progress' },
      { label: 'Profile', to: '/profile' },
      { label: 'Settings', to: '/settings' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/40">
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-48 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Footer grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
                <Layers className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Stack<span className="text-gradient-primary">orium</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The home of software engineering knowledge. Documentation, cheat sheets,
              commands, progress tracking, and interview prep in one place.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Stackorium. All rights reserved.</p>
          <p>Built for engineers, by engineers.</p>
        </div>
      </div>
    </footer>
  );
}

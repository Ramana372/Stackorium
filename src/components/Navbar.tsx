import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, Search, Sun, X, LogOut, User, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/auth-context';
import { signOut } from '@/services/auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Documentation', to: '/docs' },
  // { label: 'Roadmaps', to: '/roadmaps' },
  { label: 'Cheat Sheets', to: '/cheatsheets' },
  // { label: 'Interview Prep', to: '/interview' },
  { label: 'Search', to: '/search' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          'mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8',
          scrolled
            ? 'mt-2 h-14 rounded-2xl border border-border/60 glass shadow-premium'
            : 'border border-transparent',
        )}
      >
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/Logo.png" alt="Stackorium logo" className="h-9 w-9 rounded-xl object-cover shadow-glow" />
          <span className="text-lg font-extrabold tracking-tight">
            Stack<span className="text-gradient-primary">orium</span>
          </span>
          </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === item.to ||
                  (item.to !== '/' && location.pathname.startsWith(item.to))
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
              {(location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link
            to="/search"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 transition-colors hover:bg-muted" aria-label="Open account menu">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name ?? user.email}`} alt="" />
                      <AvatarFallback>{(profile?.full_name ?? user.email ?? 'U').slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Profile</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/progress" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden px-3 font-medium text-muted-foreground md:inline-flex">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild className="hidden bg-gradient-to-r from-primary to-accent px-4 text-white shadow-glow hover:opacity-90 sm:inline-flex">
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-border glass shadow-premium lg:hidden"
          >
            <div className="flex flex-col p-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    location.pathname === item.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                {user ? (
                  <>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link to="/progress"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link to="/profile"><User className="h-4 w-4" /> Profile</Link>
                    </Button>
                    <Button variant="outline" onClick={handleSignOut} className="w-full gap-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/auth/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-white">
                      <Link to="/auth/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

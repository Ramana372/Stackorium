import { useState, useMemo } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, Search, X } from 'lucide-react';
import { getAllCategories, getCategoryBySlug, getCategoryMeta } from '@/lib/content';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';

export function DocsLayout() {
  const { category } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => getAllCategories(), []);
  const activeCategory = category ? getCategoryBySlug(category) : undefined;

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        articles: cat.articles.filter(
          (a) => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.articles.length > 0 || cat.label.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const isArticleActive = (slug: string) => {
    const path = location.pathname.replace(/^\/docs\//, '');
    return path === slug || path.endsWith(`/${slug}`) || path === `${category}/${slug}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-border bg-card/50 backdrop-blur-sm scrollbar-thin transition-transform lg:sticky lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {/* Sidebar search */}
          <div className="sticky top-0 z-10 border-b border-border bg-card/80 p-4 backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter docs..."
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          <nav className="p-4">
            <Link
              to="/docs"
              className={cn(
                'mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                !category
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              All Documentation
            </Link>

            {filteredCategories.map((cat) => {
              const meta = getCategoryMeta(cat.slug);
              const isActive = category === cat.slug;
              return (
                <div key={cat.slug} className="mb-1">
                  <Link
                    to={`/docs/${cat.slug}`}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    {meta.label}
                    <span className="font-mono text-xs text-muted-foreground">{cat.articles.length}</span>
                  </Link>

                  <AnimatePresence>
                    {(isActive || !category) && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {cat.articles.map((article) => (
                          <li key={article.slug}>
                            <Link
                              to={`/docs/${cat.slug}/${article.slug.replace(`${cat.slug}/`, '')}`}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-1.5 pl-6 text-sm transition-colors',
                                isArticleActive(article.slug)
                                  ? 'bg-primary/5 font-medium text-primary'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                              )}
                            >
                              <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                              <span className="truncate">{article.title}</span>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">No results for "{searchQuery}"</p>
            )}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-background/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content + TOC */}
        <div className="flex min-w-0 flex-1">
          <div className="flex-1 min-w-0">
            {/* Mobile sidebar toggle */}
            <div className="sticky top-16 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                Menu
              </button>
              <span className="truncate text-sm text-muted-foreground">
                {activeCategory?.label ?? 'Documentation'}
              </span>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

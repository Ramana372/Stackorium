import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroFloatingCards } from '@/data/content';
import { getTotalDocCount } from '@/lib/content';

export function HomePage() {
  const totalDocs = getTotalDocCount();

  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
            <div className="flex flex-col items-start text-left">

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              >
                Everything Software
                <br />
                <span className="text-gradient-primary">Engineers Need.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                {totalDocs} articles across {(['devops', 'cloud', 'programming', 'web', 'database', 'ai', 'systemdesign', 'linux', 'git']).length}+ categories. Documentation, tutorials, references, commands, roadmaps, and interview preparation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button asChild className="h-12 gap-2 bg-gradient-to-r from-primary to-accent px-6 text-white shadow-glow hover:opacity-90">
                  <Link to="/docs">Start Learning <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="h-12 gap-2 px-6">
                  <Link to="/docs"><BookOpen className="h-4 w-4" /> Browse Documentation</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>{totalDocs}+ articles</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-success" />
                  <span>Updated weekly</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden h-[520px] lg:block"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-primary to-accent shadow-glow"
              >
                <Terminal className="h-8 w-8 text-white" />
                <span className="mt-2 text-xs font-bold uppercase tracking-wide text-white/90">Stack</span>
              </motion.div>

              <div className="absolute left-1/2 top-1/2 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/60" />
              <div className="absolute left-1/2 top-1/2 -z-0 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/30" />

              {heroFloatingCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    className={`absolute z-10 ${card.className}`}
                    animate={{ y: [0, -16, 0] }}
                    transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                  >
                    <div className="group flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-premium backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-glow">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight">{card.title}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{card.subtitle}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <div className="pointer-events-none absolute bottom-10 left-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="pointer-events-none absolute top-10 right-1/4 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <CategoriesSection />
      <FeaturesSection />
      <StatisticsSection />
      <InterviewPrepSection />
      <CTASection />
    </>
  );
}


import { Categories } from '@/components/Categories';
import { Features } from '@/components/Features';
import { Statistics } from '@/components/Statistics';
import { InterviewPrep } from '@/components/InterviewPrep';
import { CTA } from '@/components/CTA';


function CategoriesSection() { return <Categories />; }
function FeaturesSection() { return <Features />; }
function StatisticsSection() { return <Statistics />; }
function InterviewPrepSection() { return <InterviewPrep />; }
function CTASection() { return <CTA />; }

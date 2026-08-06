import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '@/data/content';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';

export function Categories() {
  return (
    <section id="categories" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeader
          eyebrow="Explore"
          title={<>Browse by category</>}
          description="Every domain of modern software engineering, organized into focused learning paths."
        />
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.a
              key={cat.name}
              href="#"
              variants={fadeUp}
              custom={i}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              {/* gradient glow on hover */}
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${cat.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
              />

              <div className="relative flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accent} text-white shadow-lg`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground group-hover:opacity-100" />
              </div>

              <h3 className="relative mt-5 text-lg font-bold tracking-tight">{cat.name}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {cat.description}
              </p>

              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {cat.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
                {cat.topics.length > 3 && (
                  <span className="rounded-md px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    +{cat.topics.length - 3}
                  </span>
                )}
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { features } from '@/data/content';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeader
          eyebrow="Features"
          title={<>Everything you need in one platform</>}
          description="From installation to interview prep, Stackorium covers the full lifecycle of a software engineer."
        />
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

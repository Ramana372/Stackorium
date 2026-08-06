import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '@/data/content';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';

export function Testimonials() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeader
          eyebrow="Testimonials"
          title={<>Trusted by engineers everywhere</>}
          description="From junior developers to staff engineers, Stackorium is the daily reference of choice."
        />
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            custom={i}
            className="mb-5 break-inside-avoid rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
          >
            <Quote className="h-7 w-7 text-primary/30" />
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              "{t.quote}"
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="h-11 w-11 rounded-full border border-border object-cover"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.role}</span>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

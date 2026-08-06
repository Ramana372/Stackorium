import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { roadmaps } from '@/data/content';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';

export function Roadmaps() {
  return (
    <section id="roadmaps" className="relative overflow-hidden py-20 sm:py-28">
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Learning Roadmaps"
            title={<>A clear path from beginner to advanced</>}
            description="Follow a structured progression. Each roadmap builds on the previous one, connected step by step."
          />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
        >
          {roadmaps.map((rm, i) => (
            <div key={rm.level} className="relative">
              {/* connector arrow */}
              {i < roadmaps.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-premium md:flex lg:-right-5">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              )}

              <motion.div
                variants={fadeUp}
                custom={i}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${rm.color}`} />

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${rm.color} px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow`}>
                    {rm.level}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Step {i + 1}/3
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">{rm.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {rm.description}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {rm.steps.map((step) => (
                    <li key={step} className="flex items-center gap-2.5 text-sm">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${rm.color} text-white`}>
                        <Check className="h-3 w-3" />
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="mt-6 w-full gap-2 group-hover:border-primary/40">
                  Start {rm.level} Track
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

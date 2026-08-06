import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock } from 'lucide-react';
import { roadmaps } from '@/data/content';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';
import { Button } from '@/components/ui/button';

export function RoadmapsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
        className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {roadmaps.map((rm, i) => (
          <div key={rm.level} className="relative">
            {i < roadmaps.length - 1 && (
              <div className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-premium md:flex lg:-right-5">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            )}
            <motion.div
              variants={fadeUp}
              custom={i}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-premium transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${rm.color}`} />
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r ${rm.color} px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow`}>
                {rm.level}
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{rm.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rm.description}</p>

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

      {/* Detailed track sections */}
      <Reveal className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight">Track Details</h2>
        <p className="mt-2 text-muted-foreground">Each track includes guided articles, hands-on examples, and checkpoints.</p>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-8 space-y-4"
      >
        {roadmaps.map((rm, i) => (
          <motion.div
            key={rm.level}
            variants={fadeUp}
            custom={i}
            className="rounded-2xl border border-border bg-card p-6 shadow-premium"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-md bg-gradient-to-r ${rm.color} px-2.5 py-0.5 text-xs font-bold uppercase text-white`}>
                    {rm.level}
                  </span>
                  <h3 className="text-lg font-bold">{rm.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{rm.description}</p>
              </div>
              <span className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                {rm.steps.length} steps
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {rm.steps.map((step) => (
                <Link
                  key={step}
                  to="/docs"
                  className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {step}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

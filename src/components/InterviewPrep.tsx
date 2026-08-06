import { motion } from 'framer-motion';
import { Brain, Code2, GitBranch, GraduationCap, MessageSquare, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal, staggerContainer, fadeUp } from '@/components/motion';

const tracks = [
  {
    icon: Code2,
    title: 'Data Structures & Algorithms',
    desc: 'Arrays, trees, graphs, DP, and complexity analysis with worked examples.',
    count: '120+ problems',
  },
  {
    icon: Network,
    title: 'System Design',
    desc: 'Design URL shorteners, rate limiters, and distributed systems end to end.',
    count: '40+ scenarios',
  },
  {
    icon: GitBranch,
    title: 'Design Patterns',
    desc: 'Creational, structural, and behavioral patterns with real-world code.',
    count: '23 patterns',
  },
  {
    icon: MessageSquare,
    title: 'Behavioral Rounds',
    desc: 'STAR-method frameworks for articulating impact and handling tough questions.',
    count: '50+ questions',
  },
];

export function InterviewPrep() {
  return (
    <section id="interview" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Interview Preparation"
            title={<>Land the role you want</>}
            description="Structured prep for DSA, system design, patterns, and behavioral rounds — with model answers."
          />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.title}
                variants={fadeUp}
                custom={i}
                className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-premium transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold tracking-tight">{track.title}</h3>
                    <span className="shrink-0 rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {track.count}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {track.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <Reveal className="mt-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>Used by engineers landing roles at top tech companies</span>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent px-6 text-white shadow-glow hover:opacity-90">
            <Brain className="h-4 w-4" />
            Start Interview Prep
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

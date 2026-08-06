import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTA() {
	return (
		<section className="relative overflow-hidden py-24 sm:py-28">
			<div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" />
			<div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
			<div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/15 blur-[120px]" />

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.6 }}
					className="rounded-[2rem] border border-border bg-card/80 p-8 text-center shadow-premium backdrop-blur-md sm:p-12"
				>
					<span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
						<Sparkles className="h-3.5 w-3.5 text-primary" />
						Start free today
					</span>

					<h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
						Build your engineering
						<br />
						knowledge hub.
					</h2>

					<p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
						Explore documentation, track your progress, save useful articles, and return to the
						topics you care about most.
					</p>

					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Button asChild className="h-12 gap-2 bg-gradient-to-r from-primary to-accent px-6 text-white shadow-glow hover:opacity-90">
							<Link to="/auth/signup">
								Get Started
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button asChild variant="outline" className="h-12 gap-2 px-6">
							<Link to="/docs">Browse Documentation</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

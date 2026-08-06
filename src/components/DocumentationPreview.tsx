import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  ChevronRight,
  Container,
  FileText,
  Lightbulb,
  List,
  PlayCircle,
  Settings,
  Terminal,
  TriangleAlert,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/CodeBlock';
import { Reveal } from '@/components/motion';
import { toast } from '@/hooks/use-toast';

const sidebarSections = [
  {
    label: 'Getting Started',
    items: [
      { title: 'Introduction', active: false },
      { title: 'Installation', active: true },
      { title: 'Quick Start', active: false },
    ],
  },
  {
    label: 'Core Concepts',
    items: [
      { title: 'Images & Containers', active: false },
      { title: 'Volumes', active: false },
      { title: 'Networking', active: false },
    ],
  },
  {
    label: 'Production',
    items: [
      { title: 'Compose', active: false },
      { title: 'Multi-stage Builds', active: false },
      { title: 'Best Practices', active: false },
    ],
  },
];

const tocItems = [
  { label: 'Prerequisites', id: 'prereq' },
  { label: 'Install with apt', id: 'apt' },
  { label: 'Verify installation', id: 'verify' },
  { label: 'Run your first container', id: 'run' },
  { label: 'Next steps', id: 'next' },
];

export function DocumentationPreview() {
  const [activeToc, setActiveToc] = useState('apt');
  const [helpfulChoice, setHelpfulChoice] = useState<'yes' | 'no' | null>(null);

  const handleHelpful = (choice: 'yes' | 'no') => {
    setHelpfulChoice(choice);
    toast({
      title: choice === 'yes' ? 'Thanks for your feedback' : 'Feedback recorded',
      description:
        choice === 'yes' ? 'Glad the documentation was helpful.' : 'We will improve this section.',
    });
  };

  return (
    <section id="documentation" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Documentation
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Documentation that reads like a product
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Three-pane layouts, syntax highlighting, copy buttons, and callouts for
          notes, warnings, and tips.
        </p>
      </Reveal>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-premium"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_200px]">
          {/* Left sidebar */}
          <aside className="hidden border-r border-border bg-muted/20 p-4 lg:block">
            <div className="mb-4 flex items-center gap-2 px-2">
              <Box className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold">Docker</span>
              <span className="ml-auto rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                v27.0
              </span>
            </div>
            {sidebarSections.map((section) => (
              <div key={section.label} className="mb-5">
                <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href="#"
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors',
                          item.active
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        {item.active && <ChevronRight className="h-3.5 w-3.5" />}
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Center content */}
          <div className="min-w-0 border-r border-border p-6 sm:p-8 lg:border-r-0">
            {/* breadcrumb */}
            <div className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>DevOps</span>
              <ChevronRight className="h-3 w-3" />
              <span>Docker</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Installation</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Install Docker Engine on Ubuntu
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Docker Engine is the core container runtime. This guide covers
              installing the latest stable release on Ubuntu 22.04 and 24.04 using
              the official apt repository.
            </p>

            {/* Prerequisites */}
            <h2 id="prereq" className="mt-8 flex items-center gap-2 text-lg font-semibold">
              <List className="h-5 w-5 text-primary" /> Prerequisites
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Ubuntu 22.04 LTS or 24.04 LTS (x86_64 / arm64)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Sudo privileges on the target machine
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                A stable internet connection to the Docker apt repository
              </li>
            </ul>

            {/* Install with apt */}
            <h2 id="apt" className="mt-8 flex items-center gap-2 text-lg font-semibold">
              <Terminal className="h-5 w-5 text-primary" /> Install with apt
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Add Docker's official GPG key and repository, then install the engine,
              CLI, and compose plugin.
            </p>
            <CodeBlock
              className="mt-4"
              filename="install.sh"
              language="bash"
              code={`# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to apt sources
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] \\
  https://download.docker.com/linux/ubuntu noble stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`}
            />

            {/* Note callout */}
            <div className="mt-4 flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <Info className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Note</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  On arm64 hosts, replace <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">arch=amd64</code>{' '}
                  with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">arch=arm64</code>.
                </p>
              </div>
            </div>

            {/* Verify */}
            <h2 id="verify" className="mt-8 flex items-center gap-2 text-lg font-semibold">
              <Settings className="h-5 w-5 text-primary" /> Verify installation
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Confirm the daemon is running and the CLI responds.
            </p>
            <CodeBlock
              className="mt-4"
              language="bash"
              code={`docker --version
# Docker version 27.0.3, build 7d4bcd8

sudo systemctl is-active docker
# active`}
            />

            {/* Warning callout */}
            <div className="mt-4 flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
              <TriangleAlert className="h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="text-sm font-semibold text-warning">Warning</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Avoid running containers as root in production. Create a dedicated
                  user and add it to the <code className="rounded bg-warning/10 px-1 py-0.5 font-mono text-xs">docker</code> group for non-root access.
                </p>
              </div>
            </div>

            {/* Run */}
            <h2 id="run" className="mt-8 flex items-center gap-2 text-lg font-semibold">
              <PlayCircle className="h-5 w-5 text-primary" /> Run your first container
            </h2>
            <CodeBlock
              className="mt-4"
              language="bash"
              code={`docker run -d --name web -p 8080:80 nginx:alpine
# 1a2b3c4d5e6f...

docker ps
# CONTAINER ID   IMAGE          STATUS         PORTS
# 1a2b3c4d5e6f   nginx:alpine   Up 12 seconds  0.0.0.0:8080->80/tcp`}
            />

            {/* Tip callout */}
            <div className="mt-4 flex gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
              <Lightbulb className="h-5 w-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">Tip</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use <code className="rounded bg-success/10 px-1 py-0.5 font-mono text-xs">docker logs -f web</code> to
                  stream container logs in real time — perfect for debugging startup failures.
                </p>
              </div>
            </div>

            {/* Next steps */}
            <h2 id="next" className="mt-8 flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-primary" /> Next steps
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40">
                <Container className="h-4 w-4 text-primary" /> Images & Containers
                <ChevronRight className="h-4 w-4" />
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40">
                <Box className="h-4 w-4 text-primary" /> Docker Compose
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right TOC */}
          <aside className="hidden p-6 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
            <ul className="mt-4 space-y-1">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveToc(item.id)}
                    className={cn(
                      'w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                      activeToc === item.id
                        ? 'border-l-2 border-primary bg-primary/5 font-medium text-foreground'
                        : 'border-l-2 border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold text-muted-foreground">Was this helpful?</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleHelpful('yes')}
                  className={cn(
                    'flex-1 rounded-lg border bg-card py-1.5 text-xs font-medium transition-colors',
                    helpfulChoice === 'yes'
                      ? 'border-success/60 text-success'
                      : 'border-border hover:border-success/40 hover:text-success',
                  )}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleHelpful('no')}
                  className={cn(
                    'flex-1 rounded-lg border bg-card py-1.5 text-xs font-medium transition-colors',
                    helpfulChoice === 'no'
                      ? 'border-destructive/60 text-destructive'
                      : 'border-border hover:border-destructive/40 hover:text-destructive',
                  )}
                >
                  No
                </button>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </section>
  );
}

import {
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers,
  Server,
  Terminal,
  Wrench,
  Brain,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export interface Category {
  name: string;
  description: string;
  icon: LucideIcon;
  topics: string[];
  accent: string;
}

export const categories: Category[] = [
  {
    name: 'DevOps',
    description: 'CI/CD, automation, and infrastructure as code.',
    icon: Server,
    topics: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins'],
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Cloud',
    description: 'AWS, Azure, and GCP services and architecture.',
    icon: Cloud,
    topics: ['AWS', 'Azure', 'GCP', 'IAM', 'VPC'],
    accent: 'from-sky-500 to-indigo-500',
  },
  {
    name: 'Programming',
    description: 'Java, Python, and core language fundamentals.',
    icon: Code2,
    topics: ['Java', 'Spring Boot', 'Python', 'Django'],
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Web Development',
    description: 'React, Angular, Node and full-stack patterns.',
    icon: Layers,
    topics: ['React', 'Angular', 'Node.js', 'Express.js'],
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'Databases',
    description: 'Relational, document, and in-memory stores.',
    icon: Database,
    topics: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    accent: 'from-amber-500 to-orange-500',
  },
  {
    name: 'AI',
    description: 'Machine learning and artificial intelligence.',
    icon: Brain,
    topics: ['Machine Learning', 'LLMs', 'PyTorch', 'TensorFlow'],
    accent: 'from-rose-500 to-pink-500',
  },
  {
    name: 'System Design',
    description: 'Scalability, patterns, and architecture.',
    icon: GitBranch,
    topics: ['Scalability', 'Design Patterns', 'Microservices', 'Caching'],
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Interview Prep',
    description: 'DSA, system design, and behavioral rounds.',
    icon: GraduationCap,
    topics: ['DSA', 'Algorithms', 'System Design', 'Behavioral'],
    accent: 'from-teal-500 to-green-500',
  },
];

export interface CommandEntry {
  cmd: string;
  description: string;
  category: 'Linux' | 'Git' | 'Docker' | 'Kubernetes' | 'Terraform';
  example: string;
}

export const commands: CommandEntry[] = [
  // Linux
  { cmd: 'ls -lah', description: 'List files with permissions and sizes', category: 'Linux', example: 'ls -lah /var/log' },
  { cmd: 'grep -rn', description: 'Search text recursively in files', category: 'Linux', example: "grep -rn 'error' /etc" },
  { cmd: 'find', description: 'Find files matching a pattern', category: 'Linux', example: "find . -name '*.log' -type f" },
  { cmd: 'chmod', description: 'Change file permissions', category: 'Linux', example: 'chmod 755 script.sh' },
  { cmd: 'systemctl', description: 'Manage system services', category: 'Linux', example: 'systemctl restart nginx' },
  { cmd: 'journalctl', description: 'Query the systemd journal', category: 'Linux', example: 'journalctl -u nginx -f' },
  { cmd: 'tar', description: 'Archive and compress files', category: 'Linux', example: 'tar -czvf backup.tar.gz /home' },
  { cmd: 'ssh', description: 'Secure shell remote login', category: 'Linux', example: 'ssh -i key.pem user@host' },
  // Git
  { cmd: 'git clone', description: 'Clone a repository', category: 'Git', example: 'git clone https://github.com/org/repo.git' },
  { cmd: 'git branch', description: 'List, create, or delete branches', category: 'Git', example: 'git branch -a' },
  { cmd: 'git checkout', description: 'Switch branches or restore files', category: 'Git', example: 'git checkout -b feature/x' },
  { cmd: 'git merge', description: 'Merge a branch into the current branch', category: 'Git', example: 'git merge main' },
  { cmd: 'git rebase', description: 'Reapply commits on top of another base', category: 'Git', example: 'git rebase -i HEAD~3' },
  { cmd: 'git stash', description: 'Temporarily save uncommitted changes', category: 'Git', example: 'git stash push -m "wip"' },
  { cmd: 'git log', description: 'Show commit history', category: 'Git', example: 'git log --oneline --graph --all' },
  { cmd: 'git cherry-pick', description: 'Apply a commit from another branch', category: 'Git', example: 'git cherry-pick abc1234' },
  // Docker
  { cmd: 'docker build', description: 'Build an image from a Dockerfile', category: 'Docker', example: 'docker build -t app:latest .' },
  { cmd: 'docker run', description: 'Run a command in a new container', category: 'Docker', example: 'docker run -d -p 8080:80 app:latest' },
  { cmd: 'docker ps', description: 'List running containers', category: 'Docker', example: 'docker ps -a' },
  { cmd: 'docker exec', description: 'Run a command in a running container', category: 'Docker', example: 'docker exec -it web sh' },
  { cmd: 'docker compose', description: 'Define and run multi-container apps', category: 'Docker', example: 'docker compose up -d' },
  { cmd: 'docker network', description: 'Manage container networks', category: 'Docker', example: 'docker network create appnet' },
  { cmd: 'docker volume', description: 'Manage persistent volumes', category: 'Docker', example: 'docker volume ls' },
  // Kubernetes
  { cmd: 'kubectl get', description: 'List Kubernetes resources', category: 'Kubernetes', example: 'kubectl get pods -n default' },
  { cmd: 'kubectl apply', description: 'Apply a configuration to a resource', category: 'Kubernetes', example: 'kubectl apply -f deploy.yaml' },
  { cmd: 'kubectl logs', description: 'Print container logs', category: 'Kubernetes', example: 'kubectl logs -f deploy/web' },
  { cmd: 'kubectl exec', description: 'Execute a command in a container', category: 'Kubernetes', example: 'kubectl exec -it pod -- sh' },
  { cmd: 'kubectl scale', description: 'Scale a deployment', category: 'Kubernetes', example: 'kubectl scale deploy web --replicas=5' },
  { cmd: 'kubectl rollout', description: 'Manage rollout status and history', category: 'Kubernetes', example: 'kubectl rollout undo deploy/web' },
  { cmd: 'kubectl describe', description: 'Show details of a resource', category: 'Kubernetes', example: 'kubectl describe pod web-abc' },
  // Terraform
  { cmd: 'terraform init', description: 'Initialize a working directory', category: 'Terraform', example: 'terraform init -backend-config=dev.hcl' },
  { cmd: 'terraform plan', description: 'Show changes required by config', category: 'Terraform', example: 'terraform plan -out=tfplan' },
  { cmd: 'terraform apply', description: 'Apply planned changes to infrastructure', category: 'Terraform', example: 'terraform apply tfplan' },
  { cmd: 'terraform destroy', description: 'Destroy managed infrastructure', category: 'Terraform', example: 'terraform destroy -auto-approve' },
  { cmd: 'terraform fmt', description: 'Format configuration files', category: 'Terraform', example: 'terraform fmt -recursive' },
  { cmd: 'terraform validate', description: 'Validate configuration syntax', category: 'Terraform', example: 'terraform validate' },
  { cmd: 'terraform state', description: 'Advanced state management', category: 'Terraform', example: 'terraform state list' },
];

export const commandCategories = ['Linux', 'Git', 'Docker', 'Kubernetes', 'Terraform'] as const;

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  { icon: Layers, title: 'Complete Documentation', description: 'Deep, structured references for every tool in the modern engineering stack.' },
  { icon: Wrench, title: 'Installation Guides', description: 'Step-by-step setup walkthroughs that work across Linux, macOS, and Windows.' },
  { icon: Terminal, title: 'Cheat Sheets', description: 'Quick-reference sheets for the commands you reach for every single day.' },
  { icon: GitBranch, title: 'Commands', description: 'A searchable explorer covering Linux, Git, Docker, Kubernetes, and Terraform.' },
  { icon: Brain, title: 'Troubleshooting', description: 'Common errors, root causes, and the exact fixes that resolve them.' },
  { icon: Server, title: 'Architecture Diagrams', description: 'Visual breakdowns of systems, topologies, and data flow.' },
  { icon: GraduationCap, title: 'Interview Questions', description: 'Curated DSA, system design, and behavioral questions with model answers.' },
  { icon: Code2, title: 'Best Practices', description: 'Production-tested conventions that keep codebases healthy at scale.' },
  { icon: Brain, title: 'AI Search', description: 'Ask in plain language and get precise answers from across the entire library.' },
];

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '100+', label: 'Commands & snippets' },
  { value: '15+', label: 'Starter articles' },
  { value: '30+', label: 'Tutorials planned' },
  { value: '10+', label: 'Learning resources' },
];

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Aisha Patel',
    role: 'Platform Engineer @ FinTech',
    avatar: 'https://i.pravatar.cc/120?img=47',
    quote: "Stackorium replaced four bookmark folders. The command explorer alone saves me twenty minutes a day.",
  },
  {
    name: 'Marcus Lee',
    role: 'Backend Developer @ SaaS',
    avatar: 'https://i.pravatar.cc/120?img=12',
    quote: 'The roadmaps are the clearest I have seen. I went from junior to mid in a year following the backend track.',
  },
  {
    name: 'Sofia Romero',
    role: 'DevOps Lead @ Cloud Co',
    avatar: 'https://i.pravatar.cc/120?img=32',
    quote: 'Every Kubernetes concept I need, with copy-paste commands. This is the docs site I wished existed.',
  },
  {
    name: 'David Kim',
    role: 'Full-Stack Engineer',
    avatar: 'https://i.pravatar.cc/120?img=15',
    quote: 'The interview prep section got me through three system design rounds. The diagrams are genuinely excellent.',
  },
  {
    name: 'Nina Volkov',
    role: 'ML Engineer @ AI Labs',
    avatar: 'https://i.pravatar.cc/120?img=45',
    quote: 'Finally a place where infrastructure and ML live side by side. The AI search understands what I am asking.',
  },
  {
    name: 'Tom Becker',
    role: 'Staff Engineer @ Enterprise',
    avatar: 'https://i.pravatar.cc/120?img=8',
    quote: 'I send every new hire to Stackorium on day one. It gets them productive faster than any internal wiki.',
  },
];

export interface RoadmapLevel {
  level: string;
  title: string;
  description: string;
  steps: string[];
  color: string;
}

export const roadmaps: RoadmapLevel[] = [
  {
    level: 'Beginner',
    title: 'Foundations of Software Engineering',
    description: 'Linux, Git, and a first programming language.',
    steps: ['Linux Fundamentals', 'Git & GitHub', 'Python or Java Basics', 'Data Structures Intro', 'HTTP & REST'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    level: 'Intermediate',
    title: 'Building Production Applications',
    description: 'Frameworks, databases, and deployment.',
    steps: ['Spring Boot or Django', 'React Frontend', 'PostgreSQL & Redis', 'Docker & CI/CD', 'AWS Fundamentals'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    level: 'Advanced',
    title: 'Distributed Systems & Scale',
    description: 'Kubernetes, system design, and reliability.',
    steps: ['Kubernetes in Depth', 'Terraform & IaC', 'System Design at Scale', 'Observability', 'Interview Mastery'],
    color: 'from-violet-500 to-fuchsia-500',
  },
];

export interface FloatingCard {
  title: string;
  icon: LucideIcon;
  subtitle: string;
  className: string;
  delay: number;
}

export const heroFloatingCards: FloatingCard[] = [
  { title: 'Docker', icon: Layers, subtitle: 'docker compose up', className: 'top-[6%] left-[2%]', delay: 0 },
  { title: 'Kubernetes', icon: Server, subtitle: 'kubectl get pods', className: 'top-[2%] right-[6%]', delay: 0.4 },
  { title: 'Java', icon: Code2, subtitle: 'JVM · Spring Boot', className: 'top-[40%] left-[-4%]', delay: 0.8 },
  { title: 'Spring Boot', icon: Layers, subtitle: '@RestController', className: 'bottom-[14%] left-[8%]', delay: 1.2 },
  { title: 'Git Commands', icon: GitBranch, subtitle: 'git rebase -i', className: 'bottom-[6%] right-[2%]', delay: 1.6 },
  { title: 'Linux Commands', icon: Terminal, subtitle: 'journalctl -u', className: 'top-[30%] right-[-2%]', delay: 2.0 },
  { title: 'Roadmap', icon: GraduationCap, subtitle: 'Beginner → Advanced', className: 'bottom-[38%] right-[10%]', delay: 2.4 },
  { title: 'Code Snippets', icon: Code2, subtitle: 'copy & paste', className: 'top-[58%] left-[28%]', delay: 2.8 },
];

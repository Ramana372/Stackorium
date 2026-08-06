import type { DocEntry, DocCategory, SearchResult } from '@/types';
import { parseFrontmatter, extractToc, calculateReadingTime } from './markdown';

/**
 * Content Registry
 * ---------------
 * Uses Vite's import.meta.glob to load all markdown files from /content
 * at build time. This scales to 10,000+ documents because Vite only
 * bundles the files that exist, and lazy-loads raw content on demand.
 *
 * The glob pattern `?raw` imports file contents as strings.
 * Eager: false would lazy-load, but we need the metadata for the sidebar.
 * Instead we import raw eagerly (strings are cheap) and parse frontmatter.
 */

const docModules = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

let _entries: DocEntry[] | null = null;
let _categories: DocCategory[] | null = null;
let _slugMap: Map<string, DocEntry> | null = null;

const categoryLabels: Record<string, { label: string; description: string; icon: string }> = {
  devops: { label: 'DevOps', description: 'Docker, Kubernetes, Terraform, Ansible & CI/CD', icon: 'Server' },
  cloud: { label: 'Cloud', description: 'AWS, Azure & GCP architecture and services', icon: 'Cloud' },
  programming: { label: 'Programming', description: 'Java, Python & core language fundamentals', icon: 'Code2' },
  web: { label: 'Web Development', description: 'React, Angular, Node.js & Express', icon: 'Layers' },
  database: { label: 'Databases', description: 'PostgreSQL, MySQL, MongoDB & Redis', icon: 'Database' },
  ai: { label: 'AI & Machine Learning', description: 'ML, LLMs, PyTorch & TensorFlow', icon: 'Brain' },
  systemdesign: { label: 'System Design', description: 'Scalability, patterns & architecture', icon: 'GitBranch' },
  interview: { label: 'Interview Prep', description: 'DSA, system design & behavioral rounds', icon: 'GraduationCap' },
  linux: { label: 'Linux', description: 'Commands, shell scripting & administration', icon: 'Terminal' },
  git: { label: 'Git & GitHub', description: 'Version control, branching & workflows', icon: 'GitBranch' },
};

export function getCategoryMeta(slug: string) {
  return categoryLabels[slug] ?? { label: slug, description: '', icon: 'FileText' };
}

function getDocTitle(filePath: string): string {
  const fileName = filePath.split(/[\\/]/).pop()?.toLowerCase() ?? '';

  const titleMap: Record<string, string> = {
    'mysql.md': 'MySQL',
    'postgresql.md': 'PostgreSQL',
    'mongodb.md': 'MongoDB',
    'docker.md': 'Docker',
    'kubernetes.md': 'Kubernetes',
    'github.md': 'GitHub',
    'github-actions.md': 'GitHub Actions',
    'springboot.md': 'Spring Boot',
    'ansible.md': 'Ansible',
    'terraform.md': 'Terraform',
    'jenkins.md': 'Jenkins',
    'nagios.md': 'Nagios',
    'puppet.md': 'Puppet',
    'git.md': 'Git',
  };

  if (titleMap[fileName]) return titleMap[fileName];

  return fileName
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


function buildEntries(): DocEntry[] {
  const entries: DocEntry[] = [];

  for (const [filePath, raw] of Object.entries(docModules)) {
    const normalized = filePath.replace(/^\/content\//, '').replace(/\.md$/, '');
    const parts = normalized.split('/');
    const category = parts[0];

    const { frontmatter, body } = parseFrontmatter(raw);

    if (frontmatter.draft) continue;

    const slug = frontmatter.slug || parts.slice(1).join('/');
    const { wordCount, readingTime } = calculateReadingTime(body);

    entries.push({
      slug,
      category,
      title: getDocTitle(filePath),
      description: frontmatter.description,
      tags: frontmatter.tags ?? [],
      order: frontmatter.order ?? 99,
      difficulty: frontmatter.difficulty,
      content: body,
      wordCount,
      readingTime,
      path: `${category}/${slug}`,
      filePath,
    });
  }
  
  entries.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.order - b.order;
  });

  return entries;
}

export function getAllDocEntries(): DocEntry[] {
  if (!_entries) _entries = buildEntries();
  return _entries;
}

export function getDocBySlug(slug: string): DocEntry | undefined {
  if (!_slugMap) {
    _slugMap = new Map();
    for (const entry of getAllDocEntries()) {
      _slugMap.set(entry.slug, entry);
      _slugMap.set(entry.path, entry);
    }
  }
  return _slugMap.get(slug);
}

export function getDocByCategorySlug(category: string, slug: string): DocEntry | undefined {
  return getDocBySlug(`${category}/${slug}`) ?? getDocBySlug(slug);
}

export function getAllCategories(): DocCategory[] {
  if (!_categories) {
    const entries = getAllDocEntries();
    const catMap = new Map<string, DocEntry[]>();

    for (const entry of entries) {
      const arr = catMap.get(entry.category) ?? [];
      arr.push(entry);
      catMap.set(entry.category, arr);
    }

    _categories = Array.from(catMap.entries()).map(([slug, articles]) => {
      const meta = getCategoryMeta(slug);
      return {
        slug,
        label: meta.label,
        description: meta.description,
        icon: meta.icon,
        articles: articles.sort((a, b) => a.order - b.order),
      };
    });

    _categories.sort((a, b) => a.label.localeCompare(b.label));
  }
  return _categories;
}

export function getCategoryBySlug(slug: string): DocCategory | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): DocEntry[] {
  return getAllDocEntries().filter((e) => e.category === categorySlug);
}

export function getAdjacentArticles(currentSlug: string): { prev?: DocEntry; next?: DocEntry } {
  const entries = getAllDocEntries();
  const idx = entries.findIndex((e) => e.slug === currentSlug || e.path === currentSlug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? entries[idx - 1] : undefined,
    next: idx < entries.length - 1 ? entries[idx + 1] : undefined,
  };
}

export function searchDocs(query: string, limit = 20): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const entries = getAllDocEntries();
  const results: SearchResult[] = [];

  for (const entry of entries) {
    // Title match
    if (entry.title.toLowerCase().includes(q)) {
      results.push({
        type: 'article',
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        match: entry.title,
      });
      continue;
    }

    // Tag match
    if (entry.tags.some((t) => t.toLowerCase().includes(q))) {
      results.push({
        type: 'tag',
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        match: entry.tags.find((t) => t.toLowerCase().includes(q)) ?? '',
      });
      continue;
    }

    // Heading match
    const toc = extractToc(entry.content);
    const headingMatch = toc.find((h) => h.text.toLowerCase().includes(q));
    if (headingMatch) {
      results.push({
        type: 'heading',
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        match: headingMatch.text,
      });
      continue;
    }

    // Content match
    if (entry.content.toLowerCase().includes(q)) {
      results.push({
        type: 'article',
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        match: entry.description,
      });
    }

    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}

export function getTotalDocCount(): number {
  return getAllDocEntries().length;
}

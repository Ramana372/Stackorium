import type { DocFrontmatter } from '@/types';

/**
 * Parse YAML frontmatter from a markdown string.
 * Supports simple key: value pairs, arrays (- item), and strings with quotes.
 */
export function parseFrontmatter(raw: string): { frontmatter: DocFrontmatter; body: string } {
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);

  if (!fmMatch) {
    return { frontmatter: defaultFrontmatter(raw), body: raw };
  }

  const yamlBlock = fmMatch[1];
  const body = raw.slice(fmMatch[0].length);
  const frontmatter = parseYaml(yamlBlock);

  return { frontmatter, body };
}

function defaultFrontmatter(raw: string): DocFrontmatter {
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  return {
    title: titleMatch?.[1] ?? 'Untitled',
    description: '',
    category: 'uncategorized',
    slug: '',
    order: 99,
    tags: [],
  };
}

function parseYaml(yaml: string): DocFrontmatter {
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Array item
    if (trimmed.startsWith('- ') && currentArrayKey) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      const arr = result[currentArrayKey];
      if (Array.isArray(arr)) arr.push(val);
      continue;
    }

    // Key: value
    const kvMatch = trimmed.match(/^([\w_-]+)\s*:\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentArrayKey = null;

      if (value === '' || value === '[]') {
        result[key] = [];
        if (value === '') currentArrayKey = key;
        continue;
      }

      // Try to parse as number
      const num = Number(value);
      if (!isNaN(num) && value.trim() !== '') {
        result[key] = num;
        continue;
      }

      // Boolean
      if (value === 'true' || value === 'false') {
        result[key] = value === 'true';
        continue;
      }

      // String (strip quotes)
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return {
    title: (result.title as string) ?? 'Untitled',
    description: (result.description as string) ?? '',
    category: (result.category as string) ?? 'uncategorized',
    slug: (result.slug as string) ?? '',
    order: (result.order as number) ?? 99,
    tags: (result.tags as string[]) ?? [],
    difficulty: (result.difficulty as DocFrontmatter['difficulty']) ?? undefined,
    author: result.author as string,
    updatedAt: result.updatedAt as string,
    draft: result.draft as boolean,
  };
}

export function extractToc(markdown: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split('\n');
  const inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) continue;
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, '').trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }

  void inCodeBlock;
  return headings;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function calculateReadingTime(content: string): { wordCount: number; readingTime: number } {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { wordCount: words, readingTime };
}

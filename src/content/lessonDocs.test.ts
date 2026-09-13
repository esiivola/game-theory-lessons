// @ts-expect-error Vitest runs this test in Node, while the site build omits Node globals.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const lessonsDir = new URL('./lessons/', import.meta.url);
const docsUrl = new URL('../../docs/LESSONS.md', import.meta.url);

function field(source: string, name: string): string {
  return source.match(new RegExp(`^${name}:\\s*"?([^"\\n]+)"?$`, 'm'))?.[1] ?? '';
}

describe('lesson documentation', () => {
  it('keeps every core lesson heading aligned with shipped order and title', () => {
    const shipped = (readdirSync(lessonsDir) as string[])
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => readFileSync(new URL(name, lessonsDir), 'utf8'))
      .filter((source) => field(source, 'kind') !== 'case')
      .map((source): [number, string] => [Number(field(source, 'order')), field(source, 'title')])
      .sort(([a], [b]) => Number(a) - Number(b));

    const documented = [...readFileSync(docsUrl, 'utf8').matchAll(/^### L(\d+) (.+)$/gm)]
      .map((match) => [Number(match[1]), match[2]]);

    expect(documented).toEqual(shipped);
  });

  it('documents each applied case label once', () => {
    const source = readFileSync(docsUrl, 'utf8');
    const labels = [...source.matchAll(/^### A(\d+) /gm)].map((match) => Number(match[1]));
    expect(labels).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
  });

  it('keeps applied-case placement notes aligned with shipped anchors', () => {
    const names = (readdirSync(lessonsDir) as string[]).filter((name) => name.endsWith('.mdx'));
    const files: string[] = names
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => readFileSync(new URL(name, lessonsDir), 'utf8'));
    const slugOrders = new Map<string, number>(
      names.map((name): [string, number] => {
          const source = readFileSync(new URL(name, lessonsDir), 'utf8');
          return [name.replace(/\.mdx$/, ''), Number(field(source, 'order'))];
      }),
    );
    const headings = new Map<string, string>(
      [...readFileSync(docsUrl, 'utf8').matchAll(/^### (A\d+) (.+)$/gm)]
        .map((match): [string, string] => [match[1], match[2]]),
    );

    expect(files.filter((source) => field(source, 'kind') !== 'case')).toHaveLength(64);
    for (const source of files.filter((entry) => field(entry, 'kind') === 'case')) {
      const label = field(source, 'label');
      const placement = field(source, 'placement');
      const heading = headings.get(label);
      if (placement === 'capstone') expect(heading).toContain('(capstone)');
      else {
        const anchor = placement.replace('after:', '');
        expect(heading).toContain(`(inline after L${slugOrders.get(anchor)})`);
      }
    }
  });
});

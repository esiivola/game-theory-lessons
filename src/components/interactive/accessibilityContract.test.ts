// @ts-expect-error Vitest runs this test in Node, while the site build omits Node globals.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8');

function luminance(hex: string) {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('answer feedback', () => {
  it.each(['QuizCard.svelte', 'WarmUp.svelte'])('%s announces feedback without moving focus', (name) => {
    const source = read(name);
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('aria-disabled');
  });

  it.each(['GameTree.svelte', 'MedianVoter.svelte', 'PlatformPricing.svelte'])(
    '%s exposes the selected comparison mode',
    (name) => expect(read(name)).toContain('aria-pressed'),
  );
});

describe('light theme semantic text', () => {
  it('meets WCAG AA contrast on its actual backgrounds', () => {
    const css = readFileSync(new URL('../../styles/global.css', import.meta.url), 'utf8');
    const root = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const token = (name: string) => root.match(new RegExp(`--${name}:(#[0-9A-Fa-f]{6})`))?.[1] ?? '';

    expect(contrast(token('gold'), token('surface'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token('defect'), token('defect-soft'))).toBeGreaterThanOrEqual(4.5);
  });
});

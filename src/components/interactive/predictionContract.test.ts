// @ts-expect-error Vitest runs this test in Node, while the site build omits Node globals.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('interactive prediction contract', () => {
  it('retains and displays the option the learner chose', () => {
    const dir = new URL('.', import.meta.url);
    const failures = readdirSync(dir)
      .filter((name: string) => name.endsWith('.svelte'))
      .filter((name: string) => readFileSync(new URL(name, dir), 'utf8').includes('let predicted'))
      .filter((name: string) => {
        const source = readFileSync(new URL(name, dir), 'utf8');
        return !source.includes('predictionLabel') ||
          !source.includes('Your prediction:') ||
          !source.includes('predict.reveal');
      });

    expect(failures).toEqual([]);
  });
});

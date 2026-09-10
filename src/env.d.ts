/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// canvas-confetti ships no types; we only call the default export as confetti({...}).
declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    [key: string]: unknown;
  }
  const confetti: (options?: ConfettiOptions) => Promise<void> | null;
  export default confetti;
}

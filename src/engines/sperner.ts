// Sperner's lemma on a triangle split into four sub-triangles by its edge midpoints. The corners
// are colored 1, 2, 3; each edge midpoint must take one of its two endpoint colors (the Sperner
// boundary condition). Sperner guarantees at least one panchromatic (three-colored) sub-triangle,
// which is the combinatorial heart of Nash existence being non-constructive. Framework-free.

// Sub-triangles as color triples given corner colors A=1, B=2, C=3 and midpoints m1 (AB), m2 (BC), m3 (CA).
export function subTriangles(m1: number, m2: number, m3: number): { name: string; colors: number[] }[] {
  return [
    { name: 'A', colors: [1, m1, m3] },
    { name: 'B', colors: [m1, 2, m2] },
    { name: 'C', colors: [m3, m2, 3] },
    { name: 'center', colors: [m1, m2, m3] },
  ];
}

/** Names of the panchromatic (all three colors present) sub-triangles. */
export function panchromatic(m1: number, m2: number, m3: number): string[] {
  return subTriangles(m1, m2, m3)
    .filter((t) => new Set(t.colors).size === 3)
    .map((t) => t.name);
}

/** Allowed colors for each midpoint under the Sperner boundary rule. */
export const MIDPOINT_OPTIONS = { m1: [1, 2], m2: [2, 3], m3: [3, 1] };

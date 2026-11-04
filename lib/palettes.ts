/**
 * The background's colours per section, in ShaderGradient's three-colour model:
 * a and b run across the waves, deep fills their troughs. dim keeps text readable.
 */
export const PALETTES = {
  hero: { a: "#5c33cc", b: "#ca2f8c", deep: "#0a0c2c", dim: 1 },
  stack: { a: "#3b2a9e", b: "#33c2cc", deep: "#05081e", dim: 0.8 },
  about: { a: "#1f6f8b", b: "#5c33cc", deep: "#040617", dim: 0.62 },
  process: { a: "#cc6033", b: "#7a57db", deep: "#050416", dim: 0.6 },
  projects: { a: "#ea4884", b: "#4b2bb8", deep: "#040414", dim: 0.6 },
  contact: { a: "#57db96", b: "#5c33cc", deep: "#030412", dim: 0.66 },
} as const;

export type PaletteName = keyof typeof PALETTES;

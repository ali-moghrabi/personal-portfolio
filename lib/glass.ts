/**
 * Displacement map for a rounded "liquid glass" surface, after dashersw/liquid-glass-js
 * (MIT). Their shader bends the page behind a container along the edge normal, strongest at
 * the rim and fading toward the middle; here the same profile is baked into an image that an
 * SVG <feDisplacementMap> applies to the backdrop. R = x shift, G = y shift, 128 = none.
 */
export function glassMap(
  width: number,
  height: number,
  radius: number,
  { bezel = Math.min(width, height) * 0.32, ripple = 0.08 } = {},
): string {
  // a small map is enough: the filter stretches it back over the element
  const scale = Math.min(1, 160 / Math.max(1, Math.min(width, height)));
  const W = Math.max(8, Math.round(width * scale));
  const H = Math.max(8, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(W, H);
  const r = Math.min(radius, width / 2, height / 2);
  const hw = width / 2;
  const hh = height / 2;

  // signed distance to the rounded rectangle (negative inside)
  const sd = (x: number, y: number) => {
    const qx = Math.abs(x - hw) - (hw - r);
    const qy = Math.abs(y - hh) - (hh - r);
    return (
      Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
      Math.min(Math.max(qx, qy), 0) -
      r
    );
  };

  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = ((i + 0.5) / W) * width;
      const y = ((j + 0.5) / H) * height;
      const inside = -sd(x, y);
      let nx = sd(x + 1, y) - sd(x - 1, y);
      let ny = sd(x, y + 1) - sd(x, y - 1);
      const len = Math.hypot(nx, ny) || 1;
      nx /= len;
      ny /= len;
      const t = Math.min(Math.max(inside / bezel, 0), 1);
      // a curved bevel: strong at the rim, flat in the middle, with a faint ring
      let m = inside < 0 ? 0 : Math.pow(1 - t, 2.2);
      m += Math.sin(t * 18) * ripple * (1 - t);
      const k = (j * W + i) * 4;
      img.data[k] = 128 + Math.round(Math.max(-1, Math.min(1, nx * m)) * 127);
      img.data[k + 1] = 128 + Math.round(Math.max(-1, Math.min(1, ny * m)) * 127);
      img.data[k + 2] = 128;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

const noSubscribe = () => () => {};

/**
 * Only Chromium browsers apply an SVG filter inside backdrop-filter. Elsewhere (Safari,
 * Firefox, iOS) the glass falls back to a frosted blur.
 */
export const refractionSupport = {
  subscribe: noSubscribe,
  get: () =>
    /\bChrome\/\d/.test(navigator.userAgent) &&
    !/\b(Firefox|FxiOS|CriOS|EdgiOS)\//.test(navigator.userAgent) &&
    !window.matchMedia("(prefers-reduced-transparency: reduce)").matches,
  server: () => false,
};

"use client";

import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uMask;   // a: sharp text, r: soft blur, g: wide blur
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;     // -1..1
uniform float uLetterH;    // letter height / canvas height
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

float height(vec2 uv) {
  vec4 m = texture2D(uMask, uv);
  return m.r * 0.6 + m.g * 0.4;
}

// liquid-logo's flow field: the "world" the chrome reflects
vec3 flow(vec2 p, float t) {
  vec2 v = p;
  vec4 o = vec4(0.0);
  for (float i = 1.0; i <= 7.0; i++) {
    v += cos(v.yx * i + vec2(0.0, i) + t) / i + 0.6;
    o += (sin(vec4(v.x, v.y, v.y, v.x)) + 1.0) * abs(v.x - v.y) * 0.1;
  }
  return o.rgb / (o.rgb + 1.2);
}

void main() {
  float a = texture2D(uMask, vUv).a;
  if (a < 0.01) discard;

  vec2 px = 1.5 / uRes;
  float hL = height(vUv - vec2(px.x, 0.0));
  float hR = height(vUv + vec2(px.x, 0.0));
  float hD = height(vUv - vec2(0.0, px.y));
  float hU = height(vUv + vec2(0.0, px.y));
  vec3 n = normalize(vec3((hL - hR) * 9.0, (hD - hU) * 9.0, 1.0));

  float t = uTime * 0.35;
  vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.0;
  vec2 r = p * 0.55 + n.xy * 1.6 + uPointer * 0.35;
  vec3 env = flow(r * 1.4, t);

  // a chrome "horizon": bright lavender sky above, a dark horizon line, a fuchsia-to-aqua
  // floor below, reflected by the letters' slope and stirred by the liquid flow field
  float ly = (vUv.y - 0.5) / max(uLetterH, 0.05);   // -0.5..0.5 across the letter height
  float y = ly * 1.6 + n.y * 1.1 + (env.r - 0.5) * 0.55 + sin(r.x * 1.7 + t) * 0.06;
  vec3 skyTop = vec3(1.0, 0.97, 1.0);
  vec3 skyLow = vec3(0.62, 0.52, 1.0);
  vec3 floorHi = vec3(1.0, 0.32, 0.7);
  vec3 floorLo = vec3(0.22, 0.85, 0.95);
  vec3 col = y > 0.0
    ? mix(skyLow, skyTop, smoothstep(0.0, 0.7, y))
    : mix(floorHi, floorLo, smoothstep(-0.05, -0.85, y));
  // the horizon: a thin dark line right where sky meets floor
  col *= mix(1.0, 0.12, exp(-abs(y) * 22.0));
  col = mix(col, col * vec3(0.55, 0.45, 0.85), smoothstep(0.0, -0.35, y) * 0.35);

  float edge = 1.0 - n.z;
  col += pow(edge, 1.5) * vec3(0.75, 0.8, 1.0) * 0.8;
  vec3 L = normalize(vec3(0.4 + uPointer.x * 0.5, 0.6 + uPointer.y * 0.4, 0.8));
  col += pow(max(dot(n, L), 0.0), 60.0) * 0.9;

  col += (hash(gl_FragCoord.xy + fract(uTime) * 37.0) - 0.5) * 0.02;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`;

type Props = {
  text: string;
  className?: string;
  align?: "left" | "center";
  weight?: number;
};

export default function LiquidChrome({
  text,
  className,
  align = "left",
  weight = 800,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = canvas?.parentElement;
    if (!canvas || !box) return;
    const fail = () => box.setAttribute("data-chrome", "off");

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) return fail();

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return fail();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fail();
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uLetterH = gl.getUniformLocation(prog, "uLetterH");
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ready = false;
    let visible = true;
    let raf = 0;
    const start = performance.now();
    const pointer = { x: 0.2, y: 0.1, tx: 0.2, ty: 0.1 };

    const buildMask = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.max(2, Math.round(box.clientWidth * dpr));
      const H = Math.max(2, Math.round(box.clientHeight * dpr));
      canvas.width = W;
      canvas.height = H;
      const family = getComputedStyle(box).fontFamily;
      let letterH = 0.6;
      const layer = (blur: number) => {
        const c = document.createElement("canvas");
        c.width = W;
        c.height = H;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        if (!ctx) return null;
        ctx.font = `${weight} 100px ${family}`;
        const measured = ctx.measureText(text).width || 1;
        const size = Math.min(H * 0.8, (100 * W * 0.97) / measured);
        ctx.font = `${weight} ${size}px ${family}`;
        letterH = (size * 0.72) / H; // cap height, roughly
        ctx.filter = blur ? `blur(${blur}px)` : "none";
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "middle";
        ctx.textAlign = align;
        ctx.fillText(text, align === "center" ? W / 2 : W * 0.015, H * 0.53);
        return ctx.getImageData(0, 0, W, H).data;
      };
      const sharp = layer(0);
      const soft = layer(H * 0.035);
      const wide = layer(H * 0.09);
      if (!sharp || !soft || !wide) return false;
      const data = new Uint8Array(W * H * 4);
      for (let i = 0; i < W * H; i++) {
        data[i * 4] = soft[i * 4 + 3];
        data[i * 4 + 1] = wide[i * 4 + 3];
        data[i * 4 + 3] = sharp[i * 4 + 3];
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        W,
        H,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data,
      );
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uLetterH, letterH);
      return true;
    };

    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      gl.uniform1f(uTime, still ? 4 : (now - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    let lastDraw = 0;
    const loop = (now: number) => {
      if (now - lastDraw >= 14) {
        lastDraw = now;
        draw(now);
      }
      raf = visible && !still ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!ready) return;
      if (still) draw(performance.now());
      else if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    let resizeFrame = 0;
    const resized = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        ready = buildMask();
        if (ready) box.setAttribute("data-chrome", "on");
        kick();
      });
    });
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      ready = false;
      fail();
    };

    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      resized.observe(box);
      seen.observe(box);
    });
    window.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeFrame);
      resized.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteTexture(tex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [text, align, weight]);

  return (
    <span
      aria-hidden="true"
      data-chrome="pending"
      className={twMerge("liquid-chrome", className)}
    >
      <canvas ref={canvasRef} />
      <span
        className="liquid-chrome-fallback"
        style={{
          fontWeight: weight,
          justifyContent: align === "center" ? "center" : "flex-start",
          fontSize: `min(80cqh, ${(97 / (Math.max(text.length, 1) * 0.66)).toFixed(2)}cqw)`,
        }}
      >
        {text}
      </span>
    </span>
  );
}

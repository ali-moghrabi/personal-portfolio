"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { twMerge } from "tailwind-merge";
import { glassMap, refractionSupport } from "@/lib/glass";

type Props = {
  radius?: number;
  strength?: number;
  blur?: number;
  className?: string;
};

export default function LiquidGlass({
  radius = 28,
  strength = 48,
  blur = 3,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = `lg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const refract = useSyncExternalStore(
    refractionSupport.subscribe,
    refractionSupport.get,
    refractionSupport.server,
  );
  const [map, setMap] = useState<{ w: number; h: number; url: string } | null>(
    null,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !refract) return;
    let frame = 0;
    const seen = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w < 4 || h < 4) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setMap((m) =>
          m && Math.abs(m.w - w) < 2 && Math.abs(m.h - h) < 2
            ? m
            : { w, h, url: glassMap(w, h, Math.min(radius, w / 2, h / 2)) },
        ),
      );
    });
    seen.observe(el);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [radius, refract]);

  const filter =
    refract && map
      ? `blur(${blur * 0.5}px) url(#${id}) saturate(1.7) brightness(1.06)`
      : `blur(${blur * 4 + 8}px) saturate(1.6)`;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={twMerge("liquid-glass", className)}
      style={{
        borderRadius: radius,
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
      }}
    >
      {refract && map && (
        <svg width="0" height="0" className="absolute">
          <filter
            id={id}
            x="0"
            y="0"
            width={map.w}
            height={map.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={map.url}
              x="0"
              y="0"
              width={map.w}
              height={map.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={strength}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
    </span>
  );
}

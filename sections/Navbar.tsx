"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import LiquidGlass from "@/components/LiquidGlass";
import { navLinks } from "@/constants";

type SectionId = (typeof navLinks)[number]["id"];

function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navLinks) {
      const el = document.getElementById(id);
      if (el) seen.observe(el);
    }
    return () => seen.disconnect();
  }, []);
  return active;
}

function Links({
  active,
  onPick,
}: {
  active: SectionId | null;
  onPick?: () => void;
}) {
  return (
    <ul className="nav-ul">
      {navLinks.map(({ id, label }) => (
        <li key={id} className="max-sm:w-full">
          <Link
            href={`/#${id}`}
            onClick={onPick}
            aria-current={active === id ? "true" : undefined}
            className="nav-link"
          >
            {label}
            {active === id && (
              <motion.span
                layoutId={onPick ? undefined : "nav-dot"}
                className="absolute inset-0 -z-10 rounded-full bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] max-sm:hidden"
              />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > 12,
    () => false,
  );
  const active = useActiveSection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:pt-4">
      {/* a floating liquid-glass dock */}
      <div
        className={`pointer-events-auto relative isolate mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-[max-width,transform] duration-500 ease-out ${
          scrolled ? "sm:max-w-2xl" : ""
        }`}
      >
        <LiquidGlass radius={999} strength={36} />
        <Link
          href="/"
          className="text-chrome text-xl font-black tracking-tight transition-opacity hover:opacity-80"
        >
          Ali.
        </Link>
        <nav aria-label="Main" className="hidden sm:flex">
          <Links active={active} />
        </nav>
        <Link
          href="/#contact"
          className="hidden h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-primary transition hover:bg-white/85 sm:inline-flex"
        >
          Let&apos;s talk
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 cursor-pointer place-items-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white sm:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d={open ? "M6 6l12 12" : "M4 8h16"} />
            <path d={open ? "M18 6L6 18" : "M4 16h16"} />
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            className="pointer-events-auto relative isolate mx-auto mt-2 max-w-3xl overflow-hidden rounded-3xl sm:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <LiquidGlass radius={24} strength={40} blur={8} />
            <div className="p-3">
              <Links active={active} onPick={() => setOpen(false)} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

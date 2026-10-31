"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
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
                className="absolute inset-x-3 -bottom-px h-px bg-linear-to-r from-transparent via-lavender to-transparent max-sm:hidden"
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
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-white/5 bg-primary/70 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-neutral-300 transition-colors hover:text-white"
          >
            Ali<span className="text-lavender">.</span>
          </Link>
          <nav aria-label="Main" className="hidden sm:flex">
            <Links active={active} />
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 cursor-pointer place-items-center rounded-lg text-neutral-300 hover:bg-white/5 hover:text-white sm:hidden"
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
              <path
                className="origin-center transition-transform duration-200"
                d={open ? "M6 6l12 12" : "M4 7h16"}
              />
              <path d={open ? "M18 6L6 18" : "M4 12h16"} />
              {!open && <path d="M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            className="overflow-hidden sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="c-space pb-5">
              <Links active={active} onPick={() => setOpen(false)} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

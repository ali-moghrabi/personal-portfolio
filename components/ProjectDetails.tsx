"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Image from "next/image";
import type { Project } from "@/constants";

export default function ProjectDetails({
  project,
  closeModal,
}: {
  project: Project;
  closeModal: () => void;
}) {
  const {
    title,
    tagline,
    description,
    subDescription,
    href,
    logo,
    image,
    tags,
  } = project;
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key !== "Tab" || !dialog.current) return;
      const focusable = dialog.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [closeModal]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-navy to-midnight shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          ref={closeButton}
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-midnight/80 backdrop-blur transition-colors hover:bg-storm"
        >
          <Image src="/assets/close.svg" alt="" width={18} height={18} />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          <div className="relative aspect-video w-full">
            <Image
              src={image}
              alt={`${title} home page`}
              fill
              sizes="(max-width: 792px) 100vw, 768px"
              quality={90}
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-navy to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Image
                src={logo}
                alt=""
                width={40}
                height={40}
                className="rounded-xl"
              />
              <div>
                <h3 id="project-title" className="text-2xl font-bold">
                  {title}
                </h3>
                <p className="text-sm text-neutral-400">{tagline}</p>
              </div>
            </div>
            <p className="mt-5 text-pretty text-neutral-300">{description}</p>

            <h4 className="mt-7 text-sm font-semibold tracking-wider text-sand uppercase">
              What I built
            </h4>
            <ul className="mt-3 space-y-3">
              {subDescription.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm text-pretty text-neutral-400 sm:text-base"
                >
                  <span
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-lavender"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <ul className="flex flex-wrap gap-2" aria-label="Built with">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-neutral-200"
                  >
                    <Image src={tag.path} alt="" width={16} height={16} />
                    {tag.name}
                  </li>
                ))}
              </ul>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit live site
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

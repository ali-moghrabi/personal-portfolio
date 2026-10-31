"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import ProjectDetails from "./ProjectDetails";
import type { Project } from "@/constants";

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const { title, tagline, description, highlights, href, logo, image, tags } =
    project;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="group glass-card overflow-hidden"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block aspect-video w-full cursor-pointer overflow-hidden border-b border-white/10 bg-navy"
          aria-label={`Open the ${title} case study`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, calc(100vw - 2.5rem)"
            quality={90}
            className="object-cover"
          />
          <span className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/3" />
        </button>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={logo}
                alt=""
                width={44}
                height={44}
                className="rounded-xl"
              />
              <div>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-sm text-neutral-400">{tagline}</p>
              </div>
            </div>
            <p className="mt-5 text-pretty text-neutral-300">{description}</p>
          </div>

          <div className="flex flex-col">
            <ul className="space-y-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2.5 text-sm text-neutral-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 shrink-0 text-mint"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Built with">
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-200"
                >
                  <Image src={tag.path} alt="" width={14} height={14} />
                  {tag.name}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8 max-sm:*:flex-1">
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
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn-ghost"
              >
                Case study
              </button>
            </div>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {open && (
          <ProjectDetails project={project} closeModal={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

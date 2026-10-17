"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

type Tag = { id: number; name: string; path: string };

type Props = {
  title: string;
  description: string;
  subDescription: string[];
  href: string;
  image: string;
  tags: Tag[];
  closeModal: () => void;
};

export default function ProjectDetails({
  title,
  description,
  subDescription,
  href,
  image,
  tags,
  closeModal,
}: Props) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="relative flex w-full max-w-2xl max-h-[90dvh] flex-col overflow-hidden border shadow-xl rounded-2xl bg-linear-to-l from-midnight to-navy border-white/10"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <button
          ref={closeButton}
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute z-10 p-2 transition-colors rounded-full cursor-pointer top-3 right-3 bg-midnight/80 backdrop-blur hover:bg-gray-600"
        >
          <Image src="/assets/close.svg" alt="" width={20} height={20} />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          <div className="relative w-full aspect-video">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 704px) 100vw, 672px"
              quality={90}
              className="object-cover"
            />
          </div>

          <div className="p-5 sm:p-6">
            <h3
              id="project-title"
              className="pr-8 mb-2 text-xl font-bold text-white sm:text-2xl"
            >
              {title}
            </h3>
            <p className="mb-4 text-neutral-300">{description}</p>
            <ul className="space-y-2.5 list-disc ps-5 marker:text-sand">
              {subDescription.map((item) => (
                <li
                  key={item}
                  className="text-sm sm:text-base text-neutral-400"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} />
                ))}
              </ul>
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium hover-animation"
                >
                  View Project
                  <Image
                    src="/assets/arrow-up.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TagChip({ tag }: { tag: Tag }) {
  const [broken, setBroken] = useState(false);
  return (
    <li className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-neutral-200">
      {!broken && (
        <Image
          src={tag.path}
          alt=""
          width={18}
          height={18}
          onError={() => setBroken(true)}
          className="rounded-sm"
        />
      )}
      {tag.name}
    </li>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { EMAIL } from "@/constants";

export default function CopyEmailButton({
  className = "",
}: {
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      aria-label={
        copied ? "Email address copied" : `Copy my email address, ${EMAIL}`
      }
      className={twMerge(
        "relative h-12 w-52 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-primary px-4 text-sm",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: copied ? -8 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: copied ? 8 : -8 }}
          transition={{ duration: 0.15 }}
        >
          <Image
            src={copied ? "/assets/copy-done.svg" : "/assets/copy.svg"}
            alt=""
            width={18}
            height={18}
          />
          {copied ? "Email copied!" : "Copy email address"}
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </motion.button>
  );
}

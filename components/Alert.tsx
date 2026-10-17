"use client";

import { motion } from "motion/react";

export type AlertType = "success" | "danger";

export default function Alert({
  type,
  text,
}: {
  type: AlertType;
  text: string;
}) {
  const danger = type === "danger";
  return (
    <motion.div
      role={danger ? "alert" : "status"}
      className="fixed z-50 flex items-center justify-center bottom-5 right-5 left-5 sm:left-auto"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        className={`${danger ? "bg-red-800" : "bg-royal"} flex items-center gap-3 p-3 leading-none text-indigo-100 rounded-md lg:rounded-full`}
      >
        <span
          className={`${danger ? "bg-red-500" : "bg-lavender"} rounded-full px-2 py-1 text-xs font-semibold uppercase`}
        >
          {danger ? "Failed" : "Success"}
        </span>
        <span className="mr-2 text-left">{text}</span>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";
import Alert, { type AlertType } from "@/components/Alert";
import { Particles } from "@/components/Particles";

const EMPTY = { name: "", email: "", message: "" };

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 5000);
    return () => clearTimeout(timer);
  }, [alert]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (new FormData(e.currentTarget).get("company")) return;

    const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_API_KEY;
    if (!serviceId || !templateId || !publicKey) {
      console.error(
        "EmailJS keys are missing: set NEXT_PUBLIC_SERVICE_ID, NEXT_PUBLIC_TEMPLATE_ID and NEXT_PUBLIC_PUBLIC_API_KEY",
      );
      setAlert({
        type: "danger",
        text: "The form isn't available right now, please email me directly",
      });
      return;
    }

    setIsLoading(true);
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name.trim(),
          to_name: "Ali Moghrabi",
          from_email: formData.email.trim(),
          to_email: "amoghrabi168@gmail.com",
          message: formData.message.trim(),
        },
        { publicKey },
      );
      setAlert({ type: "success", text: "Message sent successfully" });
      setFormData(EMPTY);
    } catch (error) {
      console.error(error);
      setAlert({
        type: "danger",
        text: "Message failed to send, please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative flex items-center c-space section-spacing"
    >
      <Particles
        className="absolute inset-0 -z-50"
        quantity={120}
        ease={25}
        color="#ffffff"
      />
      <AnimatePresence>
        {alert && (
          <Alert key={alert.text} type={alert.type} text={alert.text} />
        )}
      </AnimatePresence>
      <div className="flex flex-col items-center justify-center w-full max-w-md p-5 mx-auto border border-white/10 rounded-2xl bg-primary">
        <div className="flex flex-col items-start w-full gap-5 mb-10">
          <h2 className="text-heading">Let&apos;s Talk</h2>
          <p className="font-normal text-neutral-400">
            Whether you&apos;re looking to build a new website, improve your
            existing platform, or bring a unique project to life, I&apos;m here
            to help.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-3">
            <label htmlFor="name" className="field-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="field-input field-input-focus"
              placeholder="John Doe"
              autoComplete="name"
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              className="field-input field-input-focus"
              placeholder="johndoe@gmail.com"
              autoComplete="email"
              maxLength={200}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="field-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="resize-none field-input field-input-focus"
              placeholder="Share your thoughts..."
              maxLength={4000}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full px-1 py-3 text-lg text-center rounded-md cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60 bg-radial from-lavender to-royal hover-animation"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

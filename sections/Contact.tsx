"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { sendContact } from "@/app/actions/contact";
import { Particles } from "@/components/Particles";
import CopyEmailButton from "@/components/CopyEmailButton";
import LiquidGlass from "@/components/LiquidGlass";
import { EMAIL, mySocials } from "@/constants";
import {
  LIMITS,
  validate,
  type ContactFields,
  type ContactState,
  type FieldErrors,
} from "@/lib/contact";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Contact() {
  const [round, setRound] = useState(0);

  return (
    <section
      id="contact"
      data-palette="contact"
      aria-labelledby="contact-title"
      className="relative isolate c-space section-spacing flex items-center py-16 md:py-24"
    >
      <Particles
        className="absolute inset-0 -z-50"
        quantity={100}
        ease={25}
        color="#ffffff"
      />
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
        <div className="max-w-xl">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="text-heading mt-3">
            Let&apos;s build something{" "}
            <span className="text-gradient">great together</span>
          </h2>
          <p className="mt-5 text-lg text-pretty text-neutral-400">
            Whether you need a new website, want to improve an existing
            platform, or have an idea you&apos;d like to bring to life, send me
            a message and I&apos;ll get back to you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmailButton className="max-sm:w-full" />
            {mySocials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.name} (opens in a new tab)`}
                className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
              >
                <Image src={social.icon} alt="" width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="relative isolate w-full rounded-[2rem] p-6 sm:p-8">
          <LiquidGlass radius={32} strength={56} blur={10} />
          <ContactForm key={round} onReset={() => setRound((r) => r + 1)} />
        </div>
      </div>
    </section>
  );
}

const EMPTY: ContactFields = { name: "", email: "", message: "" };

function ContactForm({ onReset }: { onReset: () => void }) {
  const [state, send, pending] = useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" },
  );
  const [values, setValues] = useState<ContactFields>(EMPTY);
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFields, boolean>>
  >({});
  const started = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (started.current) started.current.value = String(Date.now());
  }, []);

  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (state.status === "error" && state.values) setValues(state.values);
  }

  const local = validate({
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  });
  const serverErrors: FieldErrors =
    state.status === "error" ? (state.errors ?? {}) : {};
  const errorFor = (key: keyof ContactFields) =>
    touched[key] ? (local[key] ?? serverErrors[key]) : serverErrors[key];

  const update =
    (key: keyof ContactFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  const blur = (key: keyof ContactFields) => () =>
    setTouched((t) => ({ ...t, [key]: true }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (Object.keys(local).length) {
      setTouched({ name: true, email: true, message: true });
      const first = (["name", "email", "message"] as const).find(
        (k) => local[k],
      );
      if (first)
        e.currentTarget.querySelector<HTMLElement>(`[name=${first}]`)?.focus();
      return;
    }
    const data = new FormData(e.currentTarget);
    startTransition(() => send(data));
  };

  if (state.status === "sent")
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-96 flex-col items-center justify-center text-center"
      >
        <span className="grid size-16 place-items-center rounded-full bg-mint/15 text-mint">
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-5 text-2xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-xs text-neutral-400">
          Thanks for reaching out. I&apos;ll reply to the email you gave me.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 cursor-pointer text-sm text-lavender underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );

  return (
    <form onSubmit={submit} noValidate aria-describedby="form-status">
      <h3 className="text-xl font-semibold">Send me a message</h3>
      <p className="mt-1 text-sm text-neutral-400">All fields are required.</p>

      <div className="mt-6 space-y-4">
        <Field label="Your name" error={errorFor("name")}>
          {(props) => (
            <input
              {...props}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              maxLength={LIMITS.name.max}
              value={values.name}
              onChange={update("name")}
              onBlur={blur("name")}
            />
          )}
        </Field>
        <Field label="Email" error={errorFor("email")}>
          {(props) => (
            <input
              {...props}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="john@example.com"
              maxLength={LIMITS.email.max}
              value={values.email}
              onChange={update("email")}
              onBlur={blur("email")}
            />
          )}
        </Field>
        <Field
          label="Message"
          error={errorFor("message")}
          hint={`${values.message.length}/${LIMITS.message.max}`}
        >
          {(props) => (
            <textarea
              {...props}
              name="message"
              rows={5}
              placeholder="Tell me about your project…"
              maxLength={LIMITS.message.max}
              value={values.message}
              onChange={update("message")}
              onBlur={blur("message")}
              className={`${props.className} min-h-32 resize-y`}
            />
          )}
        </Field>
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label>
          Leave this empty
          <input
            type="text"
            name="hp_check"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      <input ref={started} type="hidden" name="started" defaultValue="" />

      {TURNSTILE_KEY && <Turnstile siteKey={TURNSTILE_KEY} state={state} />}

      <div id="form-status" aria-live="polite" className="min-h-0">
        <AnimatePresence>
          {state.status === "error" && !pending && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <span className="mt-5 block rounded-lg border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-sm text-pink-100">
                {state.message}{" "}
                {!state.errors && (
                  <a
                    href={`mailto:${EMAIL}`}
                    className="underline underline-offset-2"
                  >
                    {EMAIL}
                  </a>
                )}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn-primary mt-6 w-full"
      >
        {pending ? (
          <>
            <span
              className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden="true"
            />
            Sending…
          </>
        ) : (
          <>
            Send message
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
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-neutral-500">
        Your details are only used to reply to you.
      </p>
      <noscript>
        <p className="mt-3 text-center text-sm text-neutral-400">
          The form needs JavaScript. Email me at{" "}
          <a href={`mailto:${EMAIL}`} className="underline">
            {EMAIL}
          </a>
        </p>
      </noscript>
    </form>
  );
}

type FieldProps = {
  id: string;
  className: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: FieldProps) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {hint && (
          <span className="text-xs text-neutral-500 tabular-nums">{hint}</span>
        )}
      </div>
      {children({
        id,
        className: "field-input",
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

function Turnstile({
  siteKey,
  state,
}: {
  siteKey: string;
  state: ContactState;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  const mount = () => {
    const api = turnstileApi();
    if (!api || !box.current || widget.current) return;
    widget.current = api.render(box.current, {
      sitekey: siteKey,
      theme: "dark",
      appearance: "interaction-only",
    });
  };

  useEffect(() => {
    const api = turnstileApi();
    if (state.status === "error" && api && widget.current)
      api.reset(widget.current);
  }, [state]);

  useEffect(
    () => () => {
      const api = turnstileApi();
      if (api && widget.current) api.remove(widget.current);
      widget.current = null;
    },
    [],
  );

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={mount}
      />
      <div ref={box} className="mt-5 min-h-16.25" />
    </>
  );
}

const turnstileApi = () =>
  (window as unknown as { turnstile?: TurnstileApi }).turnstile;

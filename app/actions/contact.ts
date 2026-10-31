"use server";

import { headers } from "next/headers";
import { EMAIL } from "@/constants";
import {
  clean,
  MIN_FILL_MS,
  validate,
  type ContactFields,
  type ContactState,
} from "@/lib/contact";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits)
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function passedTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(8000),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendEmail(fields: ContactFields) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error(
      "[contact] Missing EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY or EMAILJS_PRIVATE_KEY",
    );
    return false;
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_name: "Ali Moghrabi",
        to_email: process.env.CONTACT_TO_EMAIL || EMAIL,
        from_name: fields.name,
        from_email: fields.email,
        reply_to: fields.email,
        message: fields.message,
      },
    }),
    signal: AbortSignal.timeout(10000),
  }).catch((error: unknown) => {
    console.error("[contact] EmailJS request failed", error);
    return null;
  });

  if (!res?.ok) {
    if (res)
      console.error(
        `[contact] EmailJS answered ${res.status}: ${(await res.text()).slice(0, 300)}`,
      );
    return false;
  }
  return true;
}

const field = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.slice(0, 5000) : "";
};

export async function sendContact(
  _previous: ContactState,
  form: FormData,
): Promise<ContactState> {
  const fields: ContactFields = {
    name: clean(field(form, "name")),
    email: clean(field(form, "email")).toLowerCase(),
    message: clean(field(form, "message"), true),
  };

  if (field(form, "hp_check")) {
    console.warn("[contact] Dropped: the hidden trap field was filled (bot)");
    return { status: "sent" };
  }
  const startedAt = Number(field(form, "started"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    console.warn("[contact] Dropped: the form was sent too fast (bot)");
    return { status: "sent" };
  }

  const errors = validate(fields);
  if (Object.keys(errors).length)
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values: fields,
    };

  const ip = await clientIp();
  if (rateLimited(ip))
    return {
      status: "error",
      message:
        "You've sent a few messages already. Please try again later, or email me directly.",
      values: fields,
    };

  if (!(await passedTurnstile(field(form, "cf-turnstile-response"), ip)))
    return {
      status: "error",
      message: "Please complete the check above the button and try again.",
      values: fields,
    };

  if (!(await sendEmail(fields)))
    return {
      status: "error",
      message:
        "Your message couldn't be sent right now. Please try again, or email me directly.",
      values: fields,
    };

  console.info("[contact] Message sent");
  return { status: "sent" };
}

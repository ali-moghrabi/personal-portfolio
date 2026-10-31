export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 3000 },
} as const;

export const MIN_FILL_MS = 3000;

export type ContactFields = { name: string; email: string; message: string };
export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | {
      status: "error";
      message: string;
      errors?: FieldErrors;
      values?: ContactFields;
    };

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export const clean = (value: string, multiline = false) =>
  value
    .normalize("NFC")
    .replace(
      multiline
        ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028-\u202E\u2060-\u206F]/g
        : /[\u0000-\u001F\u007F\u200B-\u200F\u2028-\u202E\u2060-\u206F]/g,
      "",
    )
    .replace(multiline ? /\n{4,}/g : /\s+/g, multiline ? "\n\n\n" : " ")
    .trim();

export function validate(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  const { name, email, message } = fields;

  if (name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name.max)
    errors.name = `Keep it under ${LIMITS.name.max} characters.`;
  else if (/https?:|www\.|[<>]/i.test(name))
    errors.name = "Just your name, please.";

  if (!email) errors.email = "Please enter your email.";
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email))
    errors.email = "That email doesn't look right.";

  if (message.length < LIMITS.message.min)
    errors.message = "Tell me a little more (at least 10 characters).";
  else if (message.length > LIMITS.message.max)
    errors.message = `Keep it under ${LIMITS.message.max} characters.`;
  else if ((message.match(/https?:\/\//gi) ?? []).length > 3)
    errors.message = "Too many links. Please keep it to three or fewer.";

  return errors;
}

import Image from "next/image";
import Link from "next/link";
import LiquidChrome from "@/components/LiquidChrome";
import { EMAIL, mySocials, navLinks } from "@/constants";

export default function Footer() {
  return (
    <footer className="c-space pb-8 text-sm text-neutral-400">
      <div className="mb-8 h-px w-full bg-linear-to-r from-transparent via-neutral-700 to-transparent" />
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-xl font-bold text-white">
            Ali<span className="text-lavender">.</span>
          </Link>
          <p className="mt-2 max-w-xs">
            Full-stack web developer building fast, secure web apps.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-block text-neutral-300 underline-offset-4 hover:text-white hover:underline"
          >
            {EMAIL}
          </a>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <Link
                  href={`/#${id}`}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-2">
          {mySocials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.name} (opens in a new tab)`}
                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-white/25"
              >
                <Image src={social.icon} alt="" width={18} height={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* the logo in liquid chrome, after collidingScopes/liquid-logo */}
      <Link href="/" aria-label="Back to the top" className="mt-12 block">
        <LiquidChrome
          text="ALI."
          align="center"
          weight={800}
          className="h-[30vw] max-h-80 w-full"
        />
      </Link>
      <div className="mt-6 flex flex-col gap-2 text-xs text-neutral-500 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Ali Moghrabi. All rights reserved.</p>
        <p>Built with Next.js, React Three Fiber and Tailwind CSS.</p>
      </div>
    </footer>
  );
}

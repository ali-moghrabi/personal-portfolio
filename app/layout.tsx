import type { Metadata, Viewport } from "next";
import { Funnel_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/sections/Navbar";
import "./globals.css";

const SITE_URL = "https://ali-moghrabi.vercel.app";

// Self-hosted by Next: no request to Google, no layout shift
const funnel = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-funnel",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ali Moghrabi | Full Stack Web Developer",
  description:
    "Portfolio of Ali Moghrabi, a full-stack web developer building fast, modern web apps with React, Next.js, NestJS and Node.js.",
  keywords: [
    "Ali Moghrabi",
    "Full Stack Developer",
    "Next.js Portfolio",
    "React Developer",
    "Web Developer Lebanon",
    "Frontend Developer",
    "Backend Developer",
    "TypeScript",
    "Node.js",
    "React",
    "NestJS",
  ],
  authors: [{ name: "Ali Moghrabi", url: SITE_URL }],
  creator: "Ali Moghrabi",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ali Moghrabi | Full Stack Web Developer",
    description:
      "Full-stack web developer building performant, user-focused web apps with React, Next.js and Node.js.",
    url: SITE_URL,
    siteName: "Ali Moghrabi Portfolio",
    images: [
      {
        url: "/assets/display.jpg",
        width: 1200,
        height: 630,
        alt: "Ali Moghrabi portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Moghrabi | Full Stack Web Developer",
    description: "Full-stack web developer: React, Next.js, NestJS, Node.js.",
    images: ["/assets/display.jpg"],
  },
};

// Next 15+ wants these here, not in metadata. Zoom stays allowed (accessibility).
export const viewport: Viewport = {
  themeColor: "#030412",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Tells Google who this site is about
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ali Moghrabi",
  url: SITE_URL,
  jobTitle: "Full Stack Web Developer",
  address: { "@type": "PostalAddress", addressCountry: "LB" },
  sameAs: [
    "https://www.linkedin.com/in/alimoghrabi-dev/",
    "https://www.instagram.com/ali_mo8rabii/",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "NestJS",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "Tailwind CSS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={funnel.variable}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-primary"
        >
          Skip to content
        </a>
        <div className="container mx-auto max-w-7xl">
          <Navbar />
          <main id="main">{children}</main>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}

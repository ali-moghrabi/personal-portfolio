export const SITE_URL = "https://ali-moghrabi.vercel.app";
export const EMAIL = "amoghrabi168@gmail.com";

export type Tag = { id: number; name: string; path: string };

export type Project = {
  id: number;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  subDescription: string[];
  href: string;
  logo: string;
  image: string;
  tags: Tag[];
};

export const myProjects: Project[] = [
  {
    id: 1,
    title: "MESA",
    tagline: "Restaurant website platform",
    description:
      "A restaurant website platform built once and sold to many restaurants: every client gets their own branded site, configured from a single file, with online ordering, table reservations and a full admin panel.",
    highlights: [
      "One codebase, many restaurants",
      "Ordering, reservations & admin",
      "Static pages, fast on mobile",
    ],
    subDescription: [
      "Full stack: a Next.js 16 front end (App Router, server actions) and a NestJS + MongoDB REST API. Each restaurant's branding, pages, sections and features come from one validated config file.",
      "Online ordering for delivery and pickup, with cash on delivery and a pluggable online payments layer, plus live promotions and happy hours that reprice the menu automatically.",
      "An admin panel with role-based permissions: a live orders board with alerts, reservations, menu and gallery management, newsletter campaigns and automations, opening hours and printable table QR codes.",
      "A separate HQ app, protected by two-step sign-in, to onboard and manage restaurant clients.",
      "Ordering over WhatsApp without an account, email verification, light and dark themes, SEO and performance work (static pages, optimized images). Deployed on Vercel and Render with custom domains.",
    ],
    href: "https://www.mesa-template.store",
    logo: "/assets/projects/mesa-icon.svg",
    image: "/assets/projects/mesa-restaurant.png",
    tags: [
      { id: 1, name: "Next.js", path: "/assets/logos/next.svg" },
      { id: 2, name: "NestJS", path: "/assets/logos/nest.svg" },
      { id: 3, name: "MongoDB", path: "/assets/logos/mongo.svg" },
      { id: 4, name: "TypeScript", path: "/assets/logos/typescript.svg" },
      { id: 5, name: "Tailwind CSS", path: "/assets/logos/tailwindcss.svg" },
      { id: 6, name: "React Query", path: "/assets/logos/react-query.svg" },
    ],
  },
];

export const mySocials = [
  {
    name: "WhatsApp",
    href: "https://wa.me/96181046718?text=Hi%20Ali%2C%20I%20saw%20your%20portfolio%20and%20I%E2%80%99d%20love%20to%20connect%21",
    icon: "/assets/socials/whatsApp.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/alimoghrabi-dev/",
    icon: "/assets/socials/linkedIn.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ali_mo8rabii/",
    icon: "/assets/socials/instagram.svg",
  },
];

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

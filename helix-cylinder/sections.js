// ─── Section data — edit this to drive your own cards ─────────────────────────
// Each section becomes one card on the cylinder.
// Required fields:
//   id          – unique key
//   label       – title shown on card + hero
//   subtitle    – small label under title
//   year        – right-aligned meta text
//   index       – watermark + chip number (e.g. "01")
//   gradient    – [topColor, bottomColor] for card background
//   accentColor – highlight color (glow, borders, icon, CTA)
//   icon        – inline SVG string (uses currentColor)
//   items       – array of { name, tech, desc } preview rows
export const SECTIONS = [
  {
    id: "projects",
    label: "Projects",
    subtitle: "Selected Work",
    year: "2024",
    index: "01",
    gradient: ["#0d1f4a", "#1a3a7a"],
    accentColor: "#60a5fa",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="40" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
      <path d="M4 14h40" stroke="currentColor" stroke-width="2"/>
      <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="11" r="1.5" fill="currentColor"/>
      <circle cx="22" cy="11" r="1.5" fill="currentColor"/>
      <path d="M16 36l-4 4h24l-4-4" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M16 22l6 6 10-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    items: [
      { name: "Portfolio 3D Engine", tech: "React Three Fiber, GSAP", desc: "Cinematic character selection scene with video platforms" },
      { name: "AI Dashboard", tech: "Next.js, Tailwind, D3", desc: "Real-time ML pipeline visualization with live metrics" },
      { name: "E-Commerce Platform", tech: "Node.js, PostgreSQL", desc: "Serving 2M+ users with sub-100ms response times" },
    ],
  },
  {
    id: "hackathons",
    label: "Hackathons",
    subtitle: "Competition Wins",
    year: "2023",
    index: "02",
    gradient: ["#1a0d4a", "#3a1a7a"],
    accentColor: "#a78bfa",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L29 16H42L32 24L36 37L24 29L12 37L16 24L6 16H19L24 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
    items: [
      { name: "HackMIT 2023 — Winner", tech: "48 hrs", desc: "Built real-time disaster response coordination platform" },
      { name: "Google Devfest — 2nd", tech: "24 hrs", desc: "AI-powered accessibility tool for visual impairment" },
      { name: "ETHIndia — Top 10", tech: "72 hrs", desc: "Decentralized identity verification using ZK proofs" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    subtitle: "Career Journey",
    year: "2020–24",
    index: "03",
    gradient: ["#0d2a1a", "#1a5a3a"],
    accentColor: "#34d399",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="32" height="24" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M16 16V12a2 2 0 012-2h12a2 2 0 012 2v4" stroke="currentColor" stroke-width="2"/>
      <path d="M8 26h32" stroke="currentColor" stroke-width="2"/>
      <circle cx="24" cy="26" r="3" fill="currentColor"/>
    </svg>`,
    items: [
      { name: "Google — Software Engineer", tech: "2022–2024", desc: "Built features used by 500M+ users in Google Search" },
      { name: "Freelance Consultant", tech: "2020–2022", desc: "Delivered 18 client projects across fintech and healthtech" },
      { name: "Open Source Maintainer", tech: "2019–Present", desc: "4.2k GitHub stars across personal projects" },
    ],
  },
  {
    id: "achievements",
    label: "Achievements",
    subtitle: "Recognition",
    year: "2024",
    index: "04",
    gradient: ["#2a1a0d", "#5a3a1a"],
    accentColor: "#fbbf24",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6C14 6 14 18 14 18H34C34 18 34 6 24 6Z" stroke="currentColor" stroke-width="2"/>
      <rect x="18" y="18" width="12" height="10" stroke="currentColor" stroke-width="2"/>
      <path d="M14 30h20l2 8H12l2-8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 38v4M28 38v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    items: [
      { name: "Forbes 30 Under 30", tech: "Technology — 2024", desc: "Recognized for impact in developer tooling" },
      { name: "Speaker — JSConf Asia", tech: "2023", desc: "'3D Web Experiences at Scale' — 800 attendees" },
      { name: "AWS Hero", tech: "2023", desc: "Community recognition for cloud architecture contributions" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    subtitle: "Let's Connect",
    year: "Now",
    index: "05",
    gradient: ["#0a0a1a", "#1a1a3a"],
    accentColor: "#f472b6",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
      <path d="M4 14l20 14 20-14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
    items: [
      { name: "sanket@email.com", tech: "Email", desc: "Respond within 24 hours on weekdays" },
      { name: "linkedin.com/in/sanket", tech: "LinkedIn", desc: "Connect professionally, view full career history" },
      { name: "github.com/sanket", tech: "GitHub", desc: "Browse open source contributions and side projects" },
    ],
  },
];

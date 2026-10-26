export const SECTIONS = [
  {
    id: "projects",
    label: "Projects",
    subtitle: "Featured Systems",
    year: "2024–25",
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
      { name: "ResQLink", tech: "Flutter, BLE Mesh, OpenStreetMap", desc: "Offline disaster response coordination and route intelligence" },
      { name: "Kisaan Vaani", tech: "Python, Whisper AI, FastAPI, React", desc: "Voice-first Hindi agricultural AI assistant (1st Place Winner)" },
      { name: "ORCHESTRA", tech: "React, FastAPI, Neo4j, PostgreSQL", desc: "Enterprise procurement intelligence & living belief graph" },
    ],
  },
  {
    id: "hackathons",
    label: "Hackathons",
    subtitle: "Competition Wins",
    year: "2024–25",
    index: "02",
    gradient: ["#1a0d4a", "#3a1a7a"],
    accentColor: "#a78bfa",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L29 16H42L32 24L36 37L24 29L12 37L16 24L6 16H19L24 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
    items: [
      { name: "Nexothon 2025 — Winner (1st)", tech: "24 hrs · GCET Gujarat", desc: "Built Kisaan Vaani voice assistant for rural farmers" },
      { name: "HackCelestial 2.0 — Runner-Up", tech: "24 hrs · Pillai College", desc: "Built offline humanitarian aid & emergency SOS app" },
      { name: "Craftverse 2025 — 4th Place", tech: "24 hrs · PCCOE Pune", desc: "End-to-end rapid prototype for emergency disaster coordination" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    subtitle: "Professional Journey",
    year: "2024–25",
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
      { name: "Palcoa Solutions — Software Intern", tech: "Dec 2024–Apr 2025", desc: "Engineered automated OCR workflows & image processing in Python" },
      { name: "Zemo Sports — Software Intern", tech: "May 2025–Aug 2025", desc: "High-throughput athlete biometric telemetry backend & Flutter UI" },
      { name: "IEEE-VESIT — Technical Lead", tech: "2023–2025", desc: "Mentored 100+ students in web development and full-stack engineering" },
    ],
  },
  {
    id: "achievements",
    label: "Research & Honors",
    subtitle: "Academic Publications",
    year: "2024–25",
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
      { name: "Breast Cancer CDSS (Capstone)", tech: "2+ Years Research", desc: "Multimodal clinical report validation under Dr. Asma Parveen (VESIT)" },
      { name: "Project Helix (Honors Thesis)", tech: "B.E. Honors with Research", desc: "Constraint-aware DNA archival & neural error reconstruction" },
      { name: "Hackathon Champion", tech: "Multiple Wins", desc: "1st Place Nexothon, Runner-Up HackCelestial 2.0, 4th Craftverse" },
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
      { name: "sanket.patil@email.com", tech: "Email", desc: "Direct email for recruitment, collaboration, and inquiries" },
      { name: "linkedin.com/in/sanket-patil1708", tech: "LinkedIn", desc: "Connect professionally and view academic history" },
      { name: "github.com/sanketp09", tech: "GitHub", desc: "Browse open-source repositories and research code" },
    ],
  },
];

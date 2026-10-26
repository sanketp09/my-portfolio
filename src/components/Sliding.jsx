/**
 * HackathonGallery.jsx
 * ─────────────────────────────────────────────────────────
 * Production-grade 3D sliding card gallery for Hackathons.
 *
 * DEPENDENCIES — install before use:
 *   npm install framer-motion
 *
 * FONTS — add to your index.html <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * USAGE:
 *   import HackathonGallery from './HackathonGallery';
 *   <HackathonGallery />
 *
 * Replace HACKATHONS array with real data when ready.
 * ─────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─────────────────────────────────────────────────────────
//  MOCK DATA  ← swap with real data
// ─────────────────────────────────────────────────────────
const HACKATHONS = [
  {
    id: 1,
    name: "NEXOTHON",
    edition: "2025",
    location: "ANAND, GUJARAT | GCET",
    duration: "24 hrs",
    teamSize: 3,
    rank: "1st Place",
    badge: "🏆",
    tier: "winner",
    category: "AgriTech / AI",
    project: "Kisaan Vaani",
    projectDesc: "A voice-first Hindi AI assistant for farmers providing yield prediction, government schemes, and community support.",
    whatWeBuilt: [
      "Voice-based AI assistant (Hindi-first)",
      "Yield prediction system",
      "Government scheme recommendations",
      "Community dashboard for farmers"
    ],
    challenges: "Handling regional language variations, making UI accessible for non-tech users, and real-time agricultural insights.",
    prize: "₹10,000",
    organizedBy: "IEEE GCET",
    tech: ["AI", "NLP", "Voice", "Web"],
    participants: 400,
    color: "#c9a84c",
    gradient: ["#1a1200", "#2e2000"],
    accentRGB: "201,168,76",
    photo: "/photos/nexothon.jpeg",
  },
  {
    id: 2,
    name: "HACKCELESTIAL 2.0",
    edition: "2024",
    location: "PANVEL, INDIA | PILLAI COLLEGE OF ENGINEERING",
    duration: "24 hrs",
    teamSize: 4,
    rank: "Runner-Up",
    badge: "🥈",
    tier: "runner",
    category: "Humanitarian Aid",
    project: "Disaster Management App",
    projectDesc: "Offline-first disaster management app covering all 4 phases with OCR, AI voice agent, resource maps, and SOS system.",
    whatWeBuilt: [
      "Offline RAG-based voice assistant for Government advisories",
      "OCR for government forms",
      "Bluetooth SOS emergency communication",
      "Resource & incident tracking maps"
      
    ],
    challenges: "Offline-first architecture, real-time data syncing, and ensuring emergency reliability.",
    prize: "₹30,000",
    organizedBy: "CSI PCE",
    tech: ["AI", "OCR", "RAG", "Maps", "Mobile"],
    participants: 300,
    color: "#a0c4ff",
    gradient: ["#000e1a", "#001a2e"],
    accentRGB: "160,196,255",
    photo: "/photos/HackCelestial.jpg",
  },
  {
    id: 3,
    name: "CRAFTVERSE",
    edition: "2024",
    location: "PUNE, INDIA | PIMPRI CHINCHWAD COLLEGE OF ENGINEERING RAVET",
    duration: "24 hrs",
    teamSize: 4,
    rank: "4th Place",
    badge: "🏅",
    tier: "finalist",
    category: "Emergency & Disaster Tech",
    project: "Autonomous Aerial Rescue Triage",
    projectDesc: "Computer-vision aerial surveillance prototype enabling rapid victim localization and triage dispatch in devastated zones.",
    whatWeBuilt: [
      "Aerial drone telemetry integration for victim identification",
      "Low-bandwidth coordinate broadcast pipeline for rescue units",
      "Real-time geospatial damage heatmaps on offline tiles"
    ],
    challenges: "Processing high-res aerial frames on resource-constrained hardware while streaming live coordinates over noisy radio channels.",
    prize: "₹5,000",
    organizedBy: "PCCOE Student Branch",
    tech: ["Web", "AI", "Full Stack"],
    participants: 250,
    color: "#d4a8ff",
    gradient: ["#0e0018", "#1a0030"],
    accentRGB: "212,168,255",
    photo: "/photos/hackverse.jpg",
  },
  {
    id: 4,
    name: "SHIELD 1.0 by BPR&D",
    edition: "2024",
    location: "JAIPUR, INDIA | CDTI Campus BPR&D",
    duration: "48 hrs",
    teamSize: 2,
    rank: "FINALIST",

    tier: "finalist",
    category: "Software Solutions to Identify Users Behind Social Media Drug Trafficking",
    project: "SOCIO-SURAAG OSINT for Drug Trafficking",
    projectDesc: "Creative tech solution built during hackathon focusing on problem-solving and rapid prototyping.",
    whatWeBuilt: [
      "Social Media Intelligence - Cross-platform profile analysis (Instagram, Telegram)",
      "Drug Slang Detection - AI-powered identification of coded language",
      "Network Analysis - Mapping connections between suspects",
      "Evidence Management - Chain of custody and dossier generation",
      "Standard Operating Procedures - BPRD-compliant workflow digitization"
    ],
    challenges: "Compliance with Government Rules, Internet Security, Social Media Scraping with free tier OSINT Tools.",
    organizedBy: "CDTI, BPR&D JAIPUR",
    tech: ["Web", "OSINT", "AI"],
    participants: 250,
    color: "#d4a8ff",
    gradient: ["#0e0018", "#1a0030"],
    accentRGB: "212,168,255",
    photo: "/photos/BPRD.jpeg",
  },
  {
    id: 5,
    name: "KAYA AI HACKATHON",
    edition: "2026",
    location: "GLOBAL | VIRTUAL / INTERNATIONAL",
    duration: "48 hrs",
    teamSize: 3,
    rank: "4th Place",
    badge: "🏅",
    tier: "finalist",
    category: "Agentic AI / Procurement Intelligence",
    project: "AI Procurement Intelligence",
    projectDesc: "An AI-powered procurement system that helps verify claims, identify risks, and support smarter purchasing decisions.",
    whatWeBuilt: [
      "Evidence-based procurement claim verification engine",
      "Living Belief Graph linking claims, contracts, vendors & dependencies",
      "Automated 3-way match & discrepancy detection algorithms",
      "Human-in-the-loop audit workspace with explainable risk scoring"
    ],
    challenges: "Connecting fragmented ERP records and invoice PDFs into traceable, explainable belief graphs without black-box hallucination.",
    prize: "Finalist Award",
    organizedBy: "Kaya AI International",
    tech: ["FastAPI", "Neo4j", "React", "Pydantic", "Python"],
    participants: 500,
    color: "#fbbf24",
    gradient: ["#1c1404", "#2e2106"],
    accentRGB: "251,191,36",
    photo: "/photos/BPRD.jpeg",
  },
  {
    id: 6,
    name: "HACK BETTER THAN ME (HBTM)",
    edition: "2026",
    location: "PUNE, INDIA | IIIT PUNE",
    duration: "24 hrs",
    teamSize: 3,
    rank: "7th Place",
    badge: "🏅",
    tier: "finalist",
    category: "Agentic AI / Applied Intelligence",
    project: "IMBTM",
    projectDesc: "An intelligent multi-agent system built at IIIT Pune exploring autonomous task execution and agentic problem-solving.",
    whatWeBuilt: [
      "Multi-agent autonomous coordination pipeline",
      "Real-time reasoning graph with sub-task delegation",
      "Contextual knowledge retrieval and synthesis engine",
      "Interactive command dashboard with human approval gates"
    ],
    challenges: "Managing agent consensus drift and coordinating asynchronous execution under strict 24-hour hackathon constraints.",
    prize: "Top 10 Finalist",
    organizedBy: "IABTM × IIIT Pune",
    tech: ["LangChain", "Python", "FastAPI", "React", "Vector DB"],
    participants: 350,
    color: "#38bdf8",
    gradient: ["#001124", "#00203d"],
    accentRGB: "56,189,248",
    photo: "/photos/hackverse.jpg",
  },
  {
    id: 7,
    name: "TI FORGE OF TITANIUM",
    edition: "2025",
    location: "CHENNAI, INDIA | RAJALAKSHMI ENGINEERING COLLEGE (REC)",
    duration: "36 hrs",
    teamSize: 4,
    rank: "1st Place — Winner",
    badge: "🏆",
    tier: "winner",
    category: "Disaster Response / IoT & BLE",
    project: "ResQLink",
    projectDesc: "A disaster-response coordination platform combining offline communication and intelligent rescue logistics.",
    whatWeBuilt: [
      "Ad-hoc offline BLE mesh relay bypassing damaged cellular infrastructure",
      "Living disaster map plotting dynamic hazards and safe detour routes",
      "Emergency triage prioritization queue sorting casualty reports",
      "Low-power peripheral/central radio synchronization state machine"
    ],
    challenges: "Achieving reliable peer-to-peer radio synchronization under 20-byte BLE MTU constraints during simulated blackouts.",
    prize: "1st Place Winner Trophy",
    organizedBy: "Rajalakshmi Engineering College (REC), Chennai",
    tech: ["Flutter", "BLE 5.0", "OpenStreetMap", "Dart", "SQLite"],
    participants: 300,
    color: "#c9a84c",
    gradient: ["#1a1200", "#2e2000"],
    accentRGB: "201,168,76",
    photo: "/photos/nexothon.jpeg",
  },
  {
    id: 8,
    name: "DEV WITH AI",
    edition: "2025",
    location: "PUNE, INDIA | BHARATI VIDYAPEETH",
    duration: "24 hrs",
    teamSize: 3,
    rank: "Top 10 Finalist",
    badge: "🏅",
    tier: "finalist",
    category: "Healthcare AI / Digital Health",
    project: "Arogya Mitra",
    projectDesc: "An AI-assisted medication adherence companion designed to help users manage their medication routines.",
    whatWeBuilt: [
      "Personalized medication scheduling & reminder workflow",
      "Bilingual patient interface with visual pill verification",
      "Healthcare-focused intake assistant with symptom journaling",
      "Local-first encrypted health datastore with adherence telemetry"
    ],
    challenges: "Designing an intuitive UI accessible for elderly patients with low digital literacy while maintaining strict data privacy.",
    prize: "Top 10 Finalist (70 Teams)",
    organizedBy: "Bharati Vidyapeeth College of Engineering",
    tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind"],
    participants: 280,
    color: "#34d399",
    gradient: ["#001a10", "#003320"],
    accentRGB: "52,211,153",
    photo: "/photos/HackCelestial.jpg",
  },
  {
    id: 9,
    name: "HACKORBIT",
    edition: "2025",
    location: "GWALIOR, INDIA | MITS GWALIOR",
    duration: "24 hrs",
    teamSize: 4,
    rank: "Finalist",
    badge: "🏅",
    tier: "finalist",
    category: "Open Innovation / AI Systems",
    project: "OrbitSense Autonomous Pipeline",
    projectDesc: "An autonomous situational intelligence platform delivering decentralized data processing and rapid telemetry routing.",
    whatWeBuilt: [
      "Decentralized event ingestion pipeline with zero-cloud dependencies",
      "Interactive spatial map rendering live geo-tagged telemetry",
      "Automated priority queue routing critical emergency alerts",
      "Cross-platform responsive dashboard with offline persistence"
    ],
    challenges: "Building fault-tolerant data pipelines that remain operational during synthetic network dropouts.",
    prize: "Finalist Recognition",
    organizedBy: "Madhav Institute of Technology & Science",
    tech: ["Python", "FastAPI", "React", "WebSockets", "SQLite"],
    participants: 250,
    color: "#a78bfa",
    gradient: ["#110926", "#201247"],
    accentRGB: "167,139,250",
    photo: "/photos/hackverse.jpg",
  },
  {
    id: 10,
    name: "IDEA HACKATHON",
    edition: "2024",
    location: "MUMBAI, INDIA | K.J. SOMAIYA COLLEGE OF ENGINEERING",
    duration: "24 hrs",
    teamSize: 3,
    rank: "Innovative Idea Finalist",
    badge: "💡",
    tier: "finalist",
    category: "Sustainable Tech / Circular Innovation",
    project: "ReClaim Circular Exchange",
    projectDesc: "A circular-economy framework transforming campus material waste into discoverable inventory via digital material passports.",
    whatWeBuilt: [
      "Digital material passport schema cataloging discarded campus assets",
      "Algorithmic requisition matching engine for student workshops",
      "Innovation Readiness Score evaluating circular reuse potential",
      "Interactive campus asset exchange and provenance tracking deck"
    ],
    challenges: "Formulating a multi-attribute scoring model to quantify embodied carbon savings for heterogeneous physical assets.",
    prize: "Finalist Recognition",
    organizedBy: "K.J. Somaiya College of Engineering, Mumbai",
    tech: ["React", "Node.js", "PostgreSQL", "LCA Data", "Tailwind"],
    participants: 200,
    color: "#66E3C1",
    gradient: ["#041a14", "#0a3328"],
    accentRGB: "102,227,193",
    photo: "/photos/HackCelestial.jpg",
  },
  {
    id: 11,
    name: "BYTEVERSE",
    edition: "NIT PATNA",
    location: "PATNA, INDIA | NIT PATNA",
    duration: "36 hrs",
    teamSize: 3,
    rank: "Participant / Finalist",
    badge: "⚡",
    tier: "finalist",
    category: "AI / CareerTech",
    project: "Interview Ace Pro",
    projectDesc: "An AI-powered interview preparation platform designed to help candidates practise interviews and improve their readiness.",
    whatWeBuilt: [
      "Adaptive role-specific interview simulation workflow",
      "STAR methodology answer rubric & scoring engine",
      "Voice-to-text response ingestion with real-time feedback",
      "Candidate readiness dashboard and improvement telemetry"
    ],
    challenges: "Evaluating subjective interview answer quality and structuring real-time feedback within low-latency speech loops.",
    prize: "Finalist / Event Recognition",
    organizedBy: "National Institute of Technology (NIT) Patna",
    tech: ["React", "Python", "FastAPI", "Speech-to-Text"],
    participants: 400,
    color: "#7DD3FC",
    gradient: ["#001726", "#002b47"],
    accentRGB: "125,211,252",
    photo: "/photos/nexothon.jpeg",
  }
];

// ─────────────────────────────────────────────────────────
//  TIER CONFIG
// ─────────────────────────────────────────────────────────
const TIER_CONFIG = {
  winner:      { label: "WINNER",      glow: "rgba(201,168,76,0.6)",  border: "#c9a84c" },
  runner:      { label: "RUNNER-UP",   glow: "rgba(160,196,255,0.5)", border: "#a0c4ff" },
  finalist:    { label: "FINALIST",    glow: "rgba(127,255,127,0.4)", border: "#7fff7f" },
  participant: { label: "PARTICIPANT", glow: "rgba(255,255,255,0.2)", border: "#888" },
};

// ─────────────────────────────────────────────────────────
//  CARD FRONT
// ─────────────────────────────────────────────────────────
function CardFront({ hack, isCenter }) {
  const tc = TIER_CONFIG[hack.tier];
  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      borderRadius: 20,
      overflow: "hidden",
      background: `linear-gradient(145deg, ${hack.gradient[0]} 0%, ${hack.gradient[1]} 100%)`,
      border: `1px solid rgba(${hack.accentRGB},0.2)`,
      display: "flex", flexDirection: "column",
      justifyContent: "space-between",
      padding: "28px 24px",
    }}>
      {/* Noise grain */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6, pointerEvents: "none", zIndex: 0,
      }} />

      {/* Radial glow center */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(${hack.accentRGB},0.10) 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 2,
        background: `linear-gradient(90deg, transparent, ${hack.color}, transparent)`,
        zIndex: 1,
      }} />

      {/* TOP ROW */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: `rgba(${hack.accentRGB},0.7)`, marginBottom: 6,
          }}>
            {hack.location.split('|')[0]?.trim()}
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 34, lineHeight: 1, color: "#fff",
            letterSpacing: "0.03em",
          }}>
            {hack.location.split('|')[1]?.trim() || hack.name}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)", marginTop: 4,
          }}>
            {hack.edition} · {hack.duration}
          </div>
        </div>
        <div style={{
          background: `rgba(${hack.accentRGB},0.1)`,
          border: `1px solid rgba(${hack.accentRGB},0.3)`,
          borderRadius: 8, padding: "6px 10px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
          color: hack.color,
        }}>
          {hack.category}
        </div>
      </div>

      {/* MIDDLE — hackathon name & project */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isCenter ? 52 : 44,
          lineHeight: 0.9,
          color: hack.color,
          letterSpacing: "0.04em",
          textShadow: `0 0 40px rgba(${hack.accentRGB},0.4)`,
          marginBottom: 8,
          transition: "font-size 0.4s",
        }}>
          {hack.name}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, color: "rgba(255,255,255,0.8)",
          letterSpacing: "0.15em", textTransform: "uppercase",
          marginBottom: 8,
        }}>
          Project: {hack.project}
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 11, color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5, maxWidth: 200, margin: "0 auto",
        }}>
          {hack.projectDesc}
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Tech pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, justifyContent: "center" }}>
          {hack.tech.map(t => (
            <span key={t} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100, padding: "3px 10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
            }}>{t}</span>
          ))}
        </div>

        {/* Tier badge */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 0",
          borderTop: `1px solid rgba(${hack.accentRGB},0.15)`,
        }}>
          <span style={{ fontSize: 16 }}>{hack.badge}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: tc.border,
          }}>{tc.label}</span>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 12, color: "rgba(255,255,255,0.3)",
          }}>·</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
          }}>{hack.participants}+ hackers</span>
        </div>

        {/* Hover hint */}
        <div style={{
          textAlign: "center", marginTop: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
        }}>
          Hover to reveal rank
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  CARD BACK
// ─────────────────────────────────────────────────────────
function CardBack({ hack }) {
  const tc = TIER_CONFIG[hack.tier];
  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      borderRadius: 20,
      overflow: "hidden",
      background: `linear-gradient(145deg, #0a0a0a 0%, #111 100%)`,
      border: `1px solid ${tc.border}44`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 28px", gap: 0,
    }}>
      {/* Glow backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(${hack.accentRGB},0.12) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Spinning ring */}
      <div style={{
        position: "absolute",
        width: 200, height: 200,
        border: `1px solid rgba(${hack.accentRGB},0.12)`,
        borderRadius: "50%",
        animation: "spin 12s linear infinite",
      }} />
      <div style={{
        position: "absolute",
        width: 150, height: 150,
        border: `1px dashed rgba(${hack.accentRGB},0.08)`,
        borderRadius: "50%",
        animation: "spin 8s linear infinite reverse",
      }} />

      {/* Badge huge */}
      <div style={{
        fontSize: 64, lineHeight: 1,
        marginBottom: 16, position: "relative", zIndex: 1,
        filter: `drop-shadow(0 0 24px rgba(${hack.accentRGB},0.5))`,
        animation: "floatY 3s ease-in-out infinite",
      }}>
        {hack.badge}
      </div>

      {/* Rank label */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 42, letterSpacing: "0.05em",
        color: hack.color,
        textShadow: `0 0 30px rgba(${hack.accentRGB},0.6)`,
        position: "relative", zIndex: 1,
        marginBottom: 4,
        textAlign: "center",
      }}>
        {hack.rank}
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
        color: tc.border, position: "relative", zIndex: 1,
        marginBottom: 6,
      }}>
        {tc.label}
      </div>

      {/* Divider */}
      <div style={{
        width: 60, height: 1,
        background: `linear-gradient(90deg, transparent, ${hack.color}, transparent)`,
        margin: "16px 0", position: "relative", zIndex: 1,
      }} />

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22, color: "#fff",
        letterSpacing: "0.05em",
        position: "relative", zIndex: 1, textAlign: "center",
      }}>
        {hack.location.split('|')[1]?.trim() || hack.name} {hack.edition}
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginTop: 4, position: "relative", zIndex: 1,
        textAlign: "center",
      }}>
        {hack.name}
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", gap: 20, marginTop: 24,
        position: "relative", zIndex: 1,
      }}>
        {[
          { v: hack.duration, l: "Duration" },
          { v: `×${hack.teamSize}`, l: "Team" },
          { v: `${hack.participants}+`, l: "Hackers" },
        ].map(s => (
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24, color: hack.color, lineHeight: 1,
            }}>{s.v}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)", marginTop: 2,
            }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SINGLE CARD (3D flip)
// ─────────────────────────────────────────────────────────
function HackCard({ hack, position, onClick, isCenter }) {
  const [flipped, setFlipped] = useState(false);
  const tc = TIER_CONFIG[hack.tier];

  // Position offsets for the cinematic fan layout
  const xMap   = { "-2": -680, "-1": -340, "0": 0, "1": 340, "2": 680 };
  const zMap   = { "-2": -220, "-1": -80,  "0": 80, "1": -80, "2": -220 };
  const rotMap = { "-2": -22,  "-1": -10,  "0": 0,  "1": 10,  "2": 22  };
  const scaleMap = { "-2": 0.72, "-1": 0.86, "0": 1, "1": 0.86, "2": 0.72 };
  const opMap  = { "-2": 0.45, "-1": 0.72, "0": 1,  "1": 0.72, "2": 0.45 };

  const posKey = String(position);
  const x     = xMap[posKey]     ?? position * 340;
  const z     = zMap[posKey]     ?? 0;
  const rotY  = rotMap[posKey]   ?? 0;
  const scale = scaleMap[posKey] ?? 0.7;
  const opacity = opMap[posKey]  ?? 0.4;

  return (
    <motion.div
      layout
      animate={{ x, z, rotateY: rotY, scale, opacity }}
      transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.8 }}
      whileHover={isCenter ? { scale: scale * 1.04, y: -10 } : { scale: scale * 1.02, y: -4 }}
      style={{
        position: "absolute",
        width: 280, height: 400,
        cursor: "pointer",
        zIndex: isCenter ? 10 : 5 - Math.abs(position),
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      onHoverStart={() => isCenter && setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      onClick={() => onClick(hack)}
    >
      {/* Glow under card */}
      {isCenter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: flipped ? 0.7 : 0.3 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            bottom: -20, left: "10%", right: "10%", height: 40,
            background: `radial-gradient(ellipse, rgba(${hack.accentRGB},0.5), transparent)`,
            filter: "blur(16px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}

      {/* Card flipper */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: "100%", height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          borderRadius: 20,
          boxShadow: isCenter
            ? `0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(${hack.accentRGB},0.15), 0 0 60px rgba(${hack.accentRGB},0.08)`
            : "0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        <CardFront hack={hack} isCenter={isCenter} />
        <CardBack hack={hack} />
      </motion.div>

      {/* Tier ribbon on non-center cards */}
      {!isCenter && (
        <div style={{
          position: "absolute", bottom: 12, left: "50%",
          transform: "translateX(-50%)",
          background: `rgba(${hack.accentRGB},0.12)`,
          border: `1px solid rgba(${hack.accentRGB},0.3)`,
          borderRadius: 100, padding: "4px 14px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          color: hack.color, whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          {hack.badge} {tc.label}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
//  BENTO BOX DETAIL VIEW (Replaces DetailModal)
// ─────────────────────────────────────────────────────────
const GlowLine = ({ x1, y1, x2, y2, color, delay = 0 }) => (
  <g>
    <motion.line 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.25 }}
      transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
      x1={x1} y1={y1} x2={x2} y2={y2}
      fill="none" stroke={color} strokeWidth="10" 
      style={{ filter: "blur(4px)" }}
    />
    <motion.line 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.9 }}
      transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
      x1={x1} y1={y1} x2={x2} y2={y2}
      fill="none" stroke={color} strokeWidth="3" 
    />
  </g>
);

const ElbowLine = ({ start, mid, end, color, delay }) => (
  <g>
    <GlowLine x1={start[0]} y1={start[1]} x2={mid[0]} y2={mid[1]} color={color} delay={delay} />
    <GlowLine x1={mid[0]} y1={mid[1]} x2={end[0]} y2={end[1]} color={color} delay={delay + 0.3} />
  </g>
);

function HackathonDetailView({ hack, onClose }) {
  const tc = TIER_CONFIG[hack.tier];
  
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const cardStyle = {
    background: "#0a0a0a",
    borderRadius: 16,
    padding: 24,
    boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(${hack.accentRGB},0.1)`,
    border: `1px solid rgba(${hack.accentRGB},0.2)`,
    position: "relative",
    overflow: "hidden"
  };

  const titleStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 22,
    letterSpacing: "0.1em",
    color: hack.color,
    marginBottom: 16,
    marginTop: 0,
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(20px)",
          zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px"
        }}
      >
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
          {/* Left Cards Lines */}
          <ElbowLine start={["25%", "36%"]} mid={["35%", "36%"]} end={["41%", "45%"]} color={hack.color} delay={0.3} />
          <ElbowLine start={["25%", "64%"]} mid={["35%", "64%"]} end={["41%", "55%"]} color={hack.color} delay={0.4} />
          
          {/* Right Cards Lines */}
          <ElbowLine start={["75%", "36%"]} mid={["65%", "36%"]} end={["59%", "45%"]} color={hack.color} delay={0.3} />
          <ElbowLine start={["75%", "64%"]} mid={["65%", "64%"]} end={["59%", "55%"]} color={hack.color} delay={0.4} />

          {/* Connection Nodes */}
          <motion.g 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            fill={hack.color}
          >
            <circle cx="41%" cy="45%" r="5" style={{ filter: `drop-shadow(0 0 6px ${hack.color})` }} />
            <circle cx="41%" cy="55%" r="5" style={{ filter: `drop-shadow(0 0 6px ${hack.color})` }} />
            <circle cx="59%" cy="45%" r="5" style={{ filter: `drop-shadow(0 0 6px ${hack.color})` }} />
            <circle cx="59%" cy="55%" r="5" style={{ filter: `drop-shadow(0 0 6px ${hack.color})` }} />
          </motion.g>
        </svg>

        {/* Big background text watermark */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "20vw", fontFamily: "'Bebas Neue', sans-serif",
            color: `rgba(${hack.accentRGB}, 0.03)`,
            whiteSpace: "nowrap", pointerEvents: "none", zIndex: 0,
          }}
        >
          {hack.location.split('|')[1]?.trim() || hack.name}
        </motion.div>

        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 40, left: 40,
            padding: "12px 24px", background: "black",
            border: `1px solid rgba(${hack.accentRGB},0.3)`,
            color: "rgba(255,255,255,0.8)", borderRadius: 30, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em",
            zIndex: 10, transition: "all 0.3s"
          }}
          onMouseEnter={(e) => { e.target.style.background = `rgba(${hack.accentRGB},0.2)`; }}
          onMouseLeave={(e) => { e.target.style.background = "black"; }}
        >
          ← BACK TO GALLERY
        </button>

        {/* Grid Layout */}
        <div style={{
          position: "relative", zIndex: 1, display: "grid",
          gridTemplateColumns: "1fr min(480px, 42vw) 1fr", gap: 32,
          width: "100%", maxWidth: 1500, height: "86vh", alignItems: "center",
        }}>
          
          {/* LEFT CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0, x: -50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              style={{...cardStyle, padding: "20px 24px"}}
            >
              <h3 style={titleStyle}>THE PROJECT</h3>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff", marginBottom: 6, lineHeight: 1
              }}>{hack.project}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, fontSize: 13, margin: "0 0 12px 0" }}>
                {hack.projectDesc}
              </p>
              
              <div style={{ borderTop: `1px solid rgba(${hack.accentRGB},0.15)`, paddingTop: 12 }}>
                <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: hack.color, letterSpacing: "0.1em", marginBottom: 8 }}>WHAT WE BUILT</h4>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {hack.whatWeBuilt.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                      <span style={{ color: hack.color, marginTop: 1 }}>▹</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              style={{...cardStyle, padding: "20px 24px"}}
            >
              <h3 style={titleStyle}>STATISTICS</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff" }}>{hack.duration}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>DURATION</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff" }}>{hack.teamSize}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>TEAM SIZE</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CENTER PHOTO */}
          <motion.div 
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              position: "relative", display: "flex", flexDirection: "column",
              borderRadius: 24, overflow: "hidden",
              boxShadow: `0 0 60px rgba(${hack.accentRGB},0.15), 0 20px 40px rgba(0,0,0,0.8)`,
              border: `1px solid rgba(${hack.accentRGB},0.3)`
            }}
          >
            <motion.img 
              src={hack.photo}
              initial={{ scale: 1.2, filter: "blur(10px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center", zIndex: 1
              }} 
            />
            {/* Gradient overlay to make text readable */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 2,
              background: `linear-gradient(to top, rgba(${hack.accentRGB}, 0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`
            }} />

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                position: "relative", zIndex: 3, padding: "32px",
                textAlign: "center", marginTop: "auto"
              }}
            >
              <div style={{ fontSize: 64, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))", marginBottom: -10 }}>{hack.badge}</div>
              <h2 style={{ 
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, margin: 0, color: "white",
                textShadow: "0 4px 20px rgba(0,0,0,0.8)", lineHeight: 1
              }}>
                {hack.location.split('|')[1]?.trim() || hack.name}
              </h2>
              <h3 style={{ 
                fontFamily: "'JetBrains Mono', monospace", color: hack.color, 
                fontSize: 16, margin: "12px 0 4px", letterSpacing: "0.2em", textTransform: "uppercase",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)"
              }}>
                {hack.name}
              </h3>
              <p style={{ 
                fontFamily: "'Syne', sans-serif", color: "rgba(255,255,255,0.9)", 
                fontSize: 14, margin: "0",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)"
              }}>
                Project: {hack.project}
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0, x: 50, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              style={{...cardStyle, padding: "20px 24px"}}
            >
              <h3 style={titleStyle}>RESULT</h3>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", lineHeight: 1, marginBottom: 4 }}>
                {hack.rank}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: hack.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {hack.prize} — {hack.organizedBy}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              style={{...cardStyle, padding: "20px 24px"}}
            >
              <h3 style={titleStyle}>CHALLENGES</h3>
              <p style={{ fontFamily: "'Syne', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, fontSize: 13, margin: 0 }}>
                {hack.challenges}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              style={{...cardStyle, padding: "20px 24px"}}
            >
              <h3 style={titleStyle}>TECH STACK</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {hack.tech.map((skill, i) => (
                  <span key={i} style={{
                    background: `rgba(${hack.accentRGB},0.1)`,
                    color: hack.color,
                    border: `1px solid rgba(${hack.accentRGB},0.3)`,
                    padding: "4px 10px",
                    borderRadius: 100,
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────
//  FILTER BAR
// ─────────────────────────────────────────────────────────
const FILTERS = ["all", "winner", "runner", "finalist"];

function FilterBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 48 }}>
      {FILTERS.map(f => {
        const isActive = active === f;
        const tc = TIER_CONFIG[f];
        return (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(f)}
            style={{
              padding: "8px 20px", borderRadius: 100,
              border: isActive
                ? `1px solid ${f === "all" ? "rgba(255,255,255,0.6)" : tc?.border ?? "rgba(255,255,255,0.6)"}`
                : "1px solid rgba(255,255,255,0.1)",
              background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.35)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {f === "all" ? "All" : TIER_CONFIG[f]?.label ?? f}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN GALLERY
// ─────────────────────────────────────────────────────────
export default function HackathonGallery({ onCompleteScroll, onBack }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [modalHack, setModalHack] = useState(null);
  const containerRef = useRef(null);

  const filtered = filter === "all"
    ? HACKATHONS
    : HACKATHONS.filter(h => h.tier === filter);

  // Keep activeIndex in bounds when filter changes
  useEffect(() => {
    setActiveIndex(Math.min(activeIndex, Math.max(0, filtered.length - 1)));
  }, [filter]);

  const navigate = useCallback((dir) => {
    setActiveIndex(i => {
      const next = i + dir;
      if (next > filtered.length - 1) {
        if (onCompleteScroll) onCompleteScroll();
        return i; // Stay at the end
      }
      return Math.max(0, Math.min(filtered.length - 1, next));
    });
  }, [filtered.length, onCompleteScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (modalHack) return;
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft")  navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, modalHack]);

  // Wheel scroll
  useEffect(() => {
    let locked = false;
    const handler = (e) => {
      if (modalHack) return;
      e.stopPropagation(); // Prevent bubbling to SelectionScene
      e.preventDefault();
      if (locked) return;
      locked = true;
      navigate(e.deltaY > 0 ? 1 : -1);
      setTimeout(() => { locked = false; }, 600);
    };
    const el = containerRef.current;
    el?.addEventListener("wheel", handler, { passive: false });
    return () => el?.removeEventListener("wheel", handler);
  }, [navigate, modalHack]);

  const activeHack = filtered[activeIndex];

  return (
    <>
      {/* ── KEYFRAMES injected via style tag ── */}
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: "#080808",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          overflow: "hidden", position: "relative",
          fontFamily: "'Syne', sans-serif",
          userSelect: "none",
        }}
      >
        {/* ── BACK BUTTON ── */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              position: "fixed",
              top: 56,
              left: 24,
              zIndex: 400,
              padding: "10px 22px",
              background: "rgba(10, 16, 28, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "rgba(255, 255, 255, 0.85)",
              borderRadius: 30,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ffb347";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(255,179,71,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>←</span> BACK TO THE NEXUS
          </button>
        )}

        {/* Ambient bg blobs */}
        {activeHack && (
          <motion.div
            key={activeHack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(${activeHack.accentRGB},0.06) 0%, transparent 65%)`,
            }}
          />
        )}

        {/* ── TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ textAlign: "center", marginBottom: 24, marginTop: 96 }}
        >
          <div style={{
            fontFamily: "Impact, sans-serif",
            fontSize: "clamp(32px, 6vw, 72px)",
            lineHeight: 0.95,
            color: "#fff",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            textShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}>
            HACKATHONS
          </div>
        </motion.div>



        {/* ── 3D STAGE ── */}
        <div style={{
          position: "relative",
          width: "100%", height: 480,
          display: "flex", alignItems: "center", justifyContent: "center",
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((hack, i) => {
              const position = i - activeIndex;
              if (Math.abs(position) > 2) return null;
              return (
                <HackCard
                  key={hack.id}
                  hack={hack}
                  position={position}
                  isCenter={position === 0}
                  onClick={(h) => setModalHack(h)}
                />
              );
            })}
          </AnimatePresence>

          {/* Arrow buttons */}
          {activeIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(-1)}
              style={{
                position: "absolute", left: 24, top: "50%",
                transform: "translateY(-50%)",
                width: 52, height: 52, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff", fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 20, backdropFilter: "blur(10px)",
              }}
            >‹</motion.button>
          )}
          {activeIndex < filtered.length - 1 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(1)}
              style={{
                position: "absolute", right: 24, top: "50%",
                transform: "translateY(-50%)",
                width: 52, height: 52, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff", fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 20, backdropFilter: "blur(10px)",
              }}
            >›</motion.button>
          )}
        </div>

        {/* ── PROGRESS DOTS ── */}
        <div style={{ display: "flex", gap: 8, marginTop: 32, alignItems: "center" }}>
          {filtered.map((_, i) => (
            <motion.div
              key={i}
              onClick={() => setActiveIndex(i)}
              animate={{
                width: i === activeIndex ? 28 : 6,
                background: i === activeIndex ? "#fff" : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.3 }}
              style={{ height: 6, borderRadius: 3, cursor: "pointer" }}
            />
          ))}
        </div>

        <div style={{
          marginTop: 14,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
        }}>
          Hover card to reveal rank · Click to expand · Scroll or ← → to navigate
        </div>

        {/* ── ACTIVE HACK NAME FOOTER ── */}
        {activeHack && (
          <motion.div
            key={activeHack.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 20, textAlign: "center",
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: activeHack.color, marginBottom: 4,
            }}>
              {activeHack.badge} {TIER_CONFIG[activeHack.tier].label}
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13, color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em",
            }}>
              {activeHack.name} · {activeHack.category}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {modalHack && (
          <HackathonDetailView hack={modalHack} onClose={() => setModalHack(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
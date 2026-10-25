import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AVATARS } from "../context/SceneContext";

export default function ProjectsPage({ onBack, onOpenProject }) {
  const projects = AVATARS.sanket?.data?.projects || [];
  const [filter, setFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "ai", label: "AI & ML" },
    { id: "web3d", label: "3D & Creative" },
    { id: "internship", label: "Internships" },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "ai") return p.tech.some((t) => t.includes("NLP") || t.includes("ML") || t.includes("AI") || t.includes("FastAPI"));
    if (filter === "web3d") return p.tech.some((t) => t.includes("Three") || t.includes("WebGL") || t.includes("GSAP"));
    if (filter === "internship") return p.badge === "Internship";
    return true;
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#07090e",
        backgroundImage: "radial-gradient(circle at 50% 10%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)",
        color: "#ffffff",
        fontFamily: "'Syne', var(--font-display), sans-serif",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "40px 24px 80px 24px",
      }}
    >
      {/* Background Grid Lines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto" }}>
        {/* Top Header Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
            paddingTop: 12,
          }}
        >
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -4, borderColor: "#38bdf8" }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "rgba(10, 16, 28, 0.8)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.85)",
              padding: "10px 22px",
              borderRadius: "30px",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <span>←</span> Back to Realm Selection
          </motion.button>

          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: "#38bdf8",
                textTransform: "uppercase",
              }}
            >
              Realm 01 • Construct
            </span>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.06em",
              }}
            >
              Curated Engineering Works
            </div>
          </div>
        </div>

        {/* Page Title & Mission */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#38bdf8",
                boxShadow: "0 0 12px #38bdf8",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
              }}
            >
              Featured Portfolio Projects
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', var(--font-display), sans-serif",
              fontSize: "clamp(46px, 7vw, 76px)",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "0.03em",
              color: "#ffffff",
            }}
          >
            SOFTWARE ARCHITECTURE & RESEARCH
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "16px",
              maxWidth: 720,
              lineHeight: 1.6,
              marginTop: 14,
            }}
          >
            Production applications, hackathon-winning AI systems, and interactive 3D WebGL graphics built by Sanket Patil.
          </p>

          {/* Filter Chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
            {categories.map((c) => {
              const active = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter(c.id)}
                  style={{
                    background: active ? "rgba(56, 189, 248, 0.16)" : "rgba(255,255,255,0.04)",
                    border: active ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.08)",
                    color: active ? "#38bdf8" : "rgba(255,255,255,0.7)",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    fontFamily: "var(--font-display)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 28,
          }}
        >
          {filteredProjects.map((proj, idx) => {
            const isHovered = hoveredCard === proj.id;
            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                onMouseEnter={() => setHoveredCard(proj.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: isHovered
                    ? `linear-gradient(145deg, rgba(16, 24, 40, 0.85) 0%, rgba(8, 12, 22, 0.95) 100%)`
                    : `linear-gradient(145deg, rgba(12, 18, 30, 0.7) 0%, rgba(6, 9, 16, 0.85) 100%)`,
                  borderRadius: "24px",
                  border: isHovered
                    ? `1px solid ${proj.bgColor}`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isHovered
                    ? `0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(${proj.accentRGB}, 0.2)`
                    : "0 8px 24px rgba(0,0,0,0.4)",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(16px)",
                  transition: "border 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
                }}
              >
                {/* Subtle Glow Accent in corner */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(${proj.accentRGB}, 0.2) 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Card Top: Badges & Year */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "14px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        background: `rgba(${proj.accentRGB}, 0.14)`,
                        color: proj.bgColor,
                        border: `1px solid rgba(${proj.accentRGB}, 0.3)`,
                        textTransform: "uppercase",
                      }}
                    >
                      {proj.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {proj.year}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    style={{
                      fontFamily: "'Bebas Neue', var(--font-display), sans-serif",
                      fontSize: "36px",
                      lineHeight: 1.05,
                      margin: "0 0 6px 0",
                      letterSpacing: "0.02em",
                      color: "#ffffff",
                    }}
                  >
                    {proj.title}
                  </h3>
                  <div
                    style={{
                      color: proj.bgColor,
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: 14,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {proj.tagline}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "14px",
                      lineHeight: 1.55,
                      margin: "0 0 20px 0",
                    }}
                  >
                    {proj.desc}
                  </p>

                  {/* Tech Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: 28 }}>
                    {proj.tech.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.8)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 18,
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => onOpenProject(proj)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: proj.bgColor,
                      color: proj.cardText || "#000000",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "100px",
                      fontWeight: 700,
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: `0 4px 14px rgba(${proj.accentRGB}, 0.35)`,
                    }}
                  >
                    <span>View Project</span>
                    <span style={{ fontSize: "14px" }}>→</span>
                  </motion.button>

                  {proj.buttons?.[0]?.url && (
                    <a
                      href={proj.buttons[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        textDecoration: "none",
                        letterSpacing: "0.1em",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
                    >
                      {proj.buttons[0].label} ↗
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
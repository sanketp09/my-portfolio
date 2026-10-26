import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RESEARCH_PROJECTS } from "./researchData";

export default function ResearchPage({ onBack }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'project' | 'paper' | null
  const [customPdfs, setCustomPdfs] = useState({}); // Local user-attached PDFs

  const activeProject = RESEARCH_PROJECTS.find((p) => p.id === selectedProjectId) || null;

  // Handle ESC key to close modal or return to landing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeModal) setActiveModal(null);
        else if (selectedProjectId) setSelectedProjectId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, selectedProjectId]);

  // Handle local PDF attachment
  const handlePdfUpload = (e, projectId) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setCustomPdfs((prev) => ({ ...prev, [projectId]: fileUrl }));
    }
  };

  const currentPdfUrl = activeProject
    ? customPdfs[activeProject.id] || activeProject.paper.pdfUrl
    : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#07090e",
        backgroundImage: "radial-gradient(circle at 50% 10%, rgba(56, 189, 248, 0.06) 0%, transparent 60%)",
        color: "#ffffff",
        overflowY: "auto",
        zIndex: 60,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* ── Top Header ── */}
      <header
        style={{
          padding: "54px 48px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(7, 9, 14, 0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 130,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {selectedProjectId ? (
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)"; }}
            >
              ← Back to Research Overview
            </button>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 10px #38bdf8" }} />
                <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 32, letterSpacing: "0.05em", color: "#ffffff", margin: 0, lineHeight: 1 }}>
                  RESEARCH LABORATORY
                </h1>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.45)", margin: "4px 0 0" }}>
                Academic research and technical investigations
              </p>
            </div>
          )}

          {selectedProjectId && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>/</span>
              <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, letterSpacing: "0.04em", color: "#ffffff" }}>
                {activeProject.title}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {selectedProjectId && (
            <div
              style={{
                display: "flex",
                gap: 6,
                background: "rgba(255, 255, 255, 0.04)",
                padding: "4px",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {RESEARCH_PROJECTS.map((p) => {
                const isCurrent = p.id === selectedProjectId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProjectId(p.id)}
                    style={{
                      background: isCurrent ? "rgba(255, 255, 255, 0.12)" : "transparent",
                      border: "none",
                      color: isCurrent ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {p.number} · {p.title.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={onBack}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "rgba(255, 255, 255, 0.85)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
            }}
          >
            ← Portfolio
          </button>
        </div>
      </header>

      {/* ── LANDING VIEW: WIDE 2-CARD LAYOUT UTILIZING LEFT AND RIGHT SPACE ── */}
      {!selectedProjectId && (
        <main style={{ maxWidth: 1440, margin: "0 auto", padding: "50px 48px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {RESEARCH_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                style={{
                  background: proj.solidColor || proj.accentColor,
                  border: "2px solid rgba(0, 0, 0, 0.25)",
                  borderRadius: 18,
                  padding: "36px 36px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
                  color: "#000000",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 20px 45px rgba(0, 0, 0, 0.5), 0 0 25px ${proj.solidColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.35)";
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "#000000",
                      fontWeight: 800,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                      opacity: 0.85,
                    }}
                  >
                    INVESTIGATION {proj.number} · {proj.tag}
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: 42,
                      color: "#000000",
                      margin: "0 0 4px",
                      letterSpacing: "0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {proj.title}
                  </h2>

                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#000000",
                      fontWeight: 700,
                      marginBottom: 16,
                      opacity: 0.9,
                    }}
                  >
                    {proj.subtitle}
                  </div>

                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: "#000000",
                      fontWeight: 600,
                      margin: "0 0 24px",
                    }}
                  >
                    {proj.overview}
                  </p>

                  {/* 3 Infographic Highlight Points */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {proj.problemPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "rgba(0, 0, 0, 0.08)",
                          border: "1.5px solid rgba(0, 0, 0, 0.14)",
                          borderRadius: 8,
                          padding: "10px 14px",
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{pt.icon}</span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.04em", color: "#000000" }}>
                          {pt.title.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1.5px solid rgba(0, 0, 0, 0.12)",
                    paddingTop: 18,
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    {proj.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#ffffff",
                          background: "#000000",
                          padding: "3px 10px",
                          borderRadius: 100,
                          fontWeight: 700,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    style={{
                      background: "#000000",
                      color: "#ffffff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 800,
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Open Investigation ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── PROJECT OPENED VIEW: SECTIONAL CARDS USING LEFT & RIGHT SPACE ── */}
      {selectedProjectId && activeProject && (
        <main style={{ maxWidth: 1440, margin: "0 auto", padding: "36px 48px 80px" }}>
          
          {/* Hero Header Card */}
          <div
            style={{
              background: "rgba(14, 18, 28, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "28px 36px",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: activeProject.accentColor,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                INVESTIGATION {activeProject.number} · {activeProject.tag}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "clamp(34px, 4vw, 54px)",
                color: "#ffffff",
                margin: "0 0 4px",
                letterSpacing: "0.03em",
                lineHeight: 1,
              }}
            >
              {activeProject.title}
            </h1>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.65)",
                marginBottom: 14,
              }}
            >
              {activeProject.subtitle}
            </div>

            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.8)",
                margin: 0,
                maxWidth: 1100,
              }}
            >
              {activeProject.overview}
            </p>
          </div>

          {/* ── WIDE 2-COLUMN SECTIONAL GRID (LEFT & RIGHT SPACE UTILIZATION) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 24, alignItems: "start" }}>
            
            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* CARD 1: THE CORE PROBLEM (INFOGRAPHIC CARD) */}
              <div
                style={{
                  background: "rgba(14, 18, 28, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "26px 28px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 17 }}>⚠️</span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.04em", color: "#ffffff", margin: 0 }}>
                    THE CORE PROBLEM
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeProject.problemPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(239, 68, 68, 0.04)",
                        border: "1px solid rgba(239, 68, 68, 0.16)",
                        borderRadius: 10,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 16, marginTop: 2 }}>{pt.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.04em", color: "#fca5a5", marginBottom: 3 }}>
                          {pt.title.toUpperCase()}
                        </div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.55 }}>
                          {pt.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: MY DIRECT CONTRIBUTION (INFOGRAPHIC CARD) */}
              <div
                style={{
                  background: "rgba(14, 18, 28, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "26px 28px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 17 }}>🎯</span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.04em", color: "#ffffff", margin: 0 }}>
                    MY CONTRIBUTION & DELIVERABLES
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeProject.contributionPoints.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255, 255, 255, 0.025)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 10,
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <span style={{ color: activeProject.accentColor, fontSize: 12, fontWeight: 800 }}>✓</span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9.5,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: `rgba(${activeProject.accentRGB}, 0.15)`,
                            color: activeProject.accentColor,
                          }}
                        >
                          {c.tag}
                        </span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.04em", color: "#ffffff" }}>
                          {c.title.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.55, paddingLeft: 20 }}>
                        {c.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* CARD 3: METHODOLOGY & APPROACH (INFOGRAPHIC FLOW CARD) */}
              <div
                style={{
                  background: "rgba(14, 18, 28, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "26px 28px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 17 }}>⚡</span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.04em", color: "#ffffff", margin: 0 }}>
                    METHODOLOGY & TECHNICAL APPROACH
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {activeProject.approachFlow.map((step) => (
                    <div
                      key={step.step}
                      style={{
                        background: "rgba(255, 255, 255, 0.025)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 10,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10.5,
                          letterSpacing: "0.15em",
                          color: activeProject.accentColor,
                          background: `rgba(${activeProject.accentRGB}, 0.15)`,
                          padding: "2px 7px",
                          borderRadius: 4,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {step.step}
                      </span>
                      <div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.04em", color: "#ffffff", marginBottom: 2 }}>
                          {step.name.toUpperCase()}
                        </div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.5 }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: CATEGORIZED TECHNOLOGIES (INFOGRAPHIC CHIPS CARD) */}
              <div
                style={{
                  background: "rgba(14, 18, 28, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "22px 26px",
                }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 12 }}>
                  KEY TECHNOLOGIES & TOOLS
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {activeProject.techCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: 8,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: activeProject.accentColor, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
                        {cat.category}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {cat.items.map((it) => (
                          <span
                            key={it}
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 9.5,
                              color: "rgba(255, 255, 255, 0.8)",
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              padding: "2px 7px",
                              borderRadius: 100,
                            }}
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CARD 5 & 6: THE TWO LIGHTLY TINTED ACTION PANELS ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                
                {/* PANEL 1: MY PROJECT */}
                <div
                  style={{
                    background: activeProject.tintBg,
                    border: `1px solid ${activeProject.tintBorder}`,
                    borderRadius: 14,
                    padding: "22px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>📐</span>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.04em", color: "#ffffff", margin: 0 }}>
                        MY PROJECT
                      </h3>
                    </div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.5, margin: "0 0 14px" }}>
                      Inspect the complete 7-step engineering pipeline diagram.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal("project")}
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      borderRadius: 8,
                      color: "#ffffff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10.5,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "8px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.borderColor = activeProject.accentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.16)";
                    }}
                  >
                    View Pipeline ↗
                  </button>
                </div>

                {/* PANEL 2: MY PAPER */}
                <div
                  style={{
                    background: activeProject.tintBg,
                    border: `1px solid ${activeProject.tintBorder}`,
                    borderRadius: 14,
                    padding: "22px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>📄</span>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.04em", color: "#ffffff", margin: 0 }}>
                        MY PAPER
                      </h3>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: "0.03em", color: "#ffffff", marginBottom: 4, lineHeight: 1.2 }}>
                      {activeProject.paper.title.slice(0, 42)}...
                    </div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.45, margin: "0 0 14px" }}>
                      {activeProject.paper.shortSummary.slice(0, 95)}...
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      onClick={() => setActiveModal("paper")}
                      style={{
                        background: activeProject.accentColor,
                        border: "none",
                        borderRadius: 8,
                        color: "#030712",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "8px 14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                      Read Paper ↗
                    </button>

                    <label
                      title="Attach or replace local research paper PDF"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "rgba(255, 255, 255, 0.45)",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      attach pdf
                      <input
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={(e) => handlePdfUpload(e, activeProject.id)}
                      />
                    </label>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>
      )}

      {/* ── MODAL 1: MY PROJECT METHODOLOGY PIPELINE ── */}
      <AnimatePresence>
        {activeModal === "project" && activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "24px",
            }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 14 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(720px, 94vw)",
                background: "#090e1a",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: 14,
                padding: "28px",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: activeProject.accentColor, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                    METHODOLOGY & WORKFLOW PIPELINE
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: "0.04em", color: "#ffffff", margin: "4px 0 0" }}>
                    {activeProject.title} — TECHNICAL ARCHITECTURE
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeProject.projectMethodology.map((step) => (
                  <div
                    key={step.step}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 10,
                      padding: "12px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5,
                        letterSpacing: "0.15em",
                        color: activeProject.accentColor,
                        background: `rgba(${activeProject.accentRGB}, 0.12)`,
                        padding: "3px 7px",
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      {step.step}
                    </span>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.04em", color: "#ffffff", marginBottom: 2 }}>
                        {step.name.toUpperCase()}
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.5 }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: MY PAPER PDF VIEWER ── */}
      <AnimatePresence>
        {activeModal === "paper" && activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "20px",
            }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(980px, 95vw)",
                height: "90vh",
                background: "#080c18",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Paper Reader Header */}
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#050811",
                }}
              >
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: activeProject.accentColor, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                    RESEARCH PAPER VIEWER
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.04em", color: "#ffffff", margin: "2px 0 0" }}>
                    {activeProject.paper.title}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <a
                    href={currentPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10.5,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.16)",
                      padding: "6px 14px",
                      borderRadius: 6,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Open in New Tab ↗
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: 18,
                      cursor: "pointer",
                      padding: "4px 8px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Embedded PDF Viewer Frame */}
              <div style={{ flex: 1, position: "relative", background: "#0c101c" }}>
                <iframe
                  src={currentPdfUrl}
                  title={activeProject.paper.title}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(5, 8, 17, 0.94)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    padding: "8px 20px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: "rgba(255, 255, 255, 0.8)",
                    zIndex: 20,
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: activeProject.accentColor }} />
                    <code style={{ color: "#ffffff" }}>{activeProject.paper.fileName}</code>
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
                  <a
                    href={currentPdfUrl}
                    download={activeProject.paper.fileName}
                    style={{
                      color: activeProject.accentColor,
                      textDecoration: "none",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    ⬇ Download PDF
                  </a>
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
                  <a
                    href={currentPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Fullscreen ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

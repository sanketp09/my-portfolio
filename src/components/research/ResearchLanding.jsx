import React from "react";
import { INVESTIGATIONS } from "./researchData";

/**
 * ResearchLanding Component
 * Professional, restrained laboratory landing displaying the two active investigations with focus areas,
 * research questions, and "Open Investigation ➔" interactions.
 */
export function ResearchLanding({ onOpenInvestigation, onBack }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#030712",
        color: "#ffffff",
        overflowY: "auto",
        zIndex: 60,
        fontFamily: "'Syne', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ── Top Header ── */}
      <header
        style={{
          padding: "28px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(3, 7, 18, 0.95)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8" }} />
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: "0.06em", color: "#ffffff", margin: 0, lineHeight: 1 }}>
              RESEARCH LABORATORY
            </h1>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.4)", padding: "2px 8px", borderRadius: 4, background: "rgba(255, 255, 255, 0.05)" }}>
              IT RESEARCH WORKSPACE
            </span>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "rgba(255, 255, 255, 0.55)", margin: 0, letterSpacing: "0.02em" }}>
            Two active research investigations · Methodology, empirical experiment logs, and paper drafts.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
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
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
          }}
        >
          ← Back to Portfolio
        </button>
      </header>

      {/* ── Main Workspace Body: Two Substantial Investigation Panels ── */}
      <main style={{ padding: "48px 40px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 28 }}>
            {INVESTIGATIONS.map((inv) => (
              <div
                key={inv.id}
                style={{
                  background: "rgba(8, 14, 24, 0.75)",
                  border: `1px solid rgba(255, 255, 255, 0.09)`,
                  borderRadius: 14,
                  padding: "32px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = inv.borderAccent;
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px ${inv.mutedAccent}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.09)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Subtle top indicator bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: inv.accentColor, opacity: 0.8 }} />

                <div>
                  {/* Top Metadata Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: inv.accentColor, letterSpacing: "0.14em" }}>
                      INVESTIGATION {inv.number} · {inv.code}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.5)" }}>
                      {inv.statusBadge}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: "0.04em", color: "#ffffff", margin: "0 0 6px", lineHeight: 1 }}>
                    {inv.title}
                  </h2>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14.5, fontWeight: 600, color: "rgba(255, 255, 255, 0.85)", marginBottom: 12 }}>
                    {inv.fullTitle}
                  </div>

                  {/* Category Pill */}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: inv.accentColor, marginBottom: 18 }}>
                    {inv.category}
                  </div>

                  {/* Concise Summary */}
                  <p style={{ fontSize: 13.5, color: "rgba(255, 255, 255, 0.72)", lineHeight: 1.6, margin: "0 0 20px" }}>
                    {inv.summary}
                  </p>

                  {/* Research Focus Bullet List */}
                  <div style={{ background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                      CORE RESEARCH FOCUS
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {inv.pipeline.slice(0, 5).map((p) => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255, 255, 255, 0.8)" }}>
                          <span style={{ color: inv.accentColor, fontSize: 10 }}>▹</span> {p.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Research Question Callout */}
                  <div style={{ borderLeft: `2px solid ${inv.accentColor}`, paddingLeft: 12, marginBottom: 24 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", marginBottom: 3 }}>
                      CORE HYPOTHESIS & QUESTION
                    </div>
                    <div style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.85)", fontStyle: "italic", lineHeight: 1.5 }}>
                      "{inv.researchQuestion}"
                    </div>
                  </div>
                </div>

                {/* Bottom Action Interaction */}
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    {inv.keyMetrics.slice(0, 2).map((km, idx) => (
                      <div key={idx} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                        <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{km.label}: </span>
                        <span style={{ color: "#ffffff", fontWeight: 700 }}>{km.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenInvestigation(inv.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 20px",
                      borderRadius: 6,
                      background: `rgba(${inv.accentRGB}, 0.14)`,
                      border: `1px solid ${inv.accentColor}`,
                      color: "#ffffff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = inv.accentColor;
                      e.currentTarget.style.color = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `rgba(${inv.accentRGB}, 0.14)`;
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    Open Investigation ➔
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "14px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          background: "rgba(3, 7, 18, 0.8)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <div>Department of Information Technology · Computational Research Portfolio</div>
        <div>All experiments, datasets, and pipelines verified under academic standards</div>
      </footer>
    </div>
  );
}

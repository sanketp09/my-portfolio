import React from "react";

/**
 * ResearchNotebook Component
 * Structured document layout detailing research questions, hypotheses, design decisions, and limitations.
 */
export function ResearchNotebook({ notebook, accentColor, accentRGB }) {
  if (!notebook) return null;

  return (
    <div style={{ maxWidth: 860, color: "rgba(255, 255, 255, 0.82)" }}>
      {/* ── 01: Core Research Question ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
          01 · Primary Research Question
        </div>
        <div
          style={{
            background: `rgba(${accentRGB}, 0.06)`,
            borderLeft: `4px solid ${accentColor}`,
            borderRadius: "0 10px 10px 0",
            padding: "18px 22px",
            fontFamily: "'Syne', sans-serif",
            fontSize: 16.5,
            fontWeight: 600,
            lineHeight: 1.55,
            color: "#ffffff",
          }}
        >
          "{notebook.researchQuestion}"
        </div>
      </section>

      {/* ── 02: Hypotheses & Target Objectives ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
          02 · Hypotheses & Target Objectives
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notebook.hypotheses.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: accentColor,
                  background: `rgba(${accentRGB}, 0.15)`,
                  padding: "2px 6px",
                  borderRadius: 4,
                  marginTop: 1,
                  flexShrink: 0,
                }}
              >
                H{i + 1}
              </span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "rgba(255, 255, 255, 0.85)" }}>
                {h}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03: Problem Statement ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          03 · Problem Statement & Context
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 10,
            padding: "20px 22px",
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(255, 255, 255, 0.78)",
          }}
        >
          {notebook.problemStatement}
        </div>
      </section>

      {/* ── 04: Key Design Decisions ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
          04 · Architectural & Design Decisions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notebook.designDecisions.map((d, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: 8,
                padding: "14px 18px",
              }}
            >
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14.5, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
                {d.decision}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.55 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700 }}>RATIONALE: </span>
                {d.rationale}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05: Theoretical Literature Foundations ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
          05 · Theoretical Foundations & Key Literature
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notebook.literatureReview.map((lit, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#ffffff", fontWeight: 600, marginBottom: 4 }}>
                {lit.citation}
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.5 }}>
                {lit.relevance}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06: Open Questions & Limitations ── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Open Questions */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 10,
            padding: "18px 20px",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#f59e0b", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Open Research Questions
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {notebook.openQuestions.map((q, i) => (
              <li key={i} style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Methodological Limitations */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 10,
            padding: "18px 20px",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#ef4444", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Methodological Boundaries
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {notebook.limitations.map((lim, i) => (
              <li key={i} style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.5 }}>
                {lim}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

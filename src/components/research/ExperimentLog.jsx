import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ExperimentLog Component
 * Chronological table of real experiment runs with expandable technical dossiers.
 */
export function ExperimentLog({ experiments, accentColor, accentRGB }) {
  const [selectedExpId, setSelectedExpId] = useState(experiments[0]?.id || null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return { label: "Completed", bg: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "In Progress":
        return { label: "In Progress", bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
      default:
        return { label: "Scheduled", bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" };
    }
  };

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
          Empirical Validation
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#ffffff", margin: 0 }}>
          Chronological Experiment Log
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.55)", margin: "4px 0 0" }}>
          Itemized record of computational trials, parameter sweeps, and validation benchmarks. Click any row to expand technical dossier.
        </p>
      </div>

      {/* Chronological Experiment Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {experiments.map((exp) => {
          const isExpanded = selectedExpId === exp.id;
          const statusBadge = getStatusBadge(exp.status);

          return (
            <div
              key={exp.id}
              style={{
                background: isExpanded ? "rgba(14, 22, 38, 0.85)" : "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${isExpanded ? `rgba(${accentRGB}, 0.35)` : "rgba(255, 255, 255, 0.07)"}`,
                borderRadius: 10,
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}
            >
              {/* Row Header */}
              <div
                onClick={() => setSelectedExpId(isExpanded ? null : exp.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: accentColor,
                      background: `rgba(${accentRGB}, 0.12)`,
                      padding: "4px 8px",
                      borderRadius: 4,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {exp.id}
                  </span>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14.5, fontWeight: 700, color: "#ffffff" }}>
                      {exp.title}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255, 255, 255, 0.45)" }}>
                      {exp.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      border: `1px solid ${statusBadge.border}`,
                    }}
                  >
                    ● {statusBadge.label}
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 14 }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expandable Technical Dossier */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      padding: "0 18px 18px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 14 }}>
                      {/* Objective */}
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>
                          RESEARCH OBJECTIVE
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.82)", lineHeight: 1.5 }}>
                          {exp.objective}
                        </div>
                      </div>

                      {/* Method & Dataset Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                        <div style={{ background: "rgba(0, 0, 0, 0.25)", padding: "10px 12px", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", marginBottom: 3 }}>
                            CONFIGURATION & METHOD
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.45 }}>
                            {exp.method}
                          </div>
                        </div>

                        <div style={{ background: "rgba(0, 0, 0, 0.25)", padding: "10px 12px", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", marginBottom: 3 }}>
                            DATASET / BENCHMARK SPLIT
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.45 }}>
                            {exp.dataset}
                          </div>
                        </div>
                      </div>

                      {/* Outcome & Metrics */}
                      <div style={{ background: `rgba(${accentRGB}, 0.05)`, border: `1px solid rgba(${accentRGB}, 0.18)`, padding: "12px 14px", borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700, textTransform: "uppercase" }}>
                            OBSERVED OUTCOME
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.5)" }}>
                            Metrics: {exp.metrics}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 600, lineHeight: 1.5 }}>
                          {exp.outcome}
                        </div>
                      </div>

                      {/* Interpretation & Next Action */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", marginBottom: 2 }}>
                            TECHNICAL INTERPRETATION
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.45 }}>
                            {exp.interpretation}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: accentColor, textTransform: "uppercase", marginBottom: 2, fontWeight: 700 }}>
                            NEXT ACTION
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.45 }}>
                            ➔ {exp.nextAction}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

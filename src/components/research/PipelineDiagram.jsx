import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PipelineDiagram Component
 * Renders an interactive technical methodology pipeline with step details, inputs, outputs, and status.
 */
export function PipelineDiagram({ pipeline, accentColor, accentRGB }) {
  const [activeStepId, setActiveStepId] = useState(pipeline[0]?.id || null);

  const activeStep = pipeline.find((p) => p.id === activeStepId) || pipeline[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case "implemented":
        return { label: "Implemented", bg: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "in_progress":
        return { label: "In Progress", bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
      default:
        return { label: "Proposed", bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" };
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Pipeline Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
            Technical Architecture
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#ffffff", margin: 0 }}>
            Methodology Pipeline
          </h3>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255, 255, 255, 0.45)" }}>
          CLICK A STAGE TO INSPECT SPECIFICATIONS
        </div>
      </div>

      {/* Horizontal Interactive Pipeline Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 12,
          marginBottom: 16,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {pipeline.map((step, idx) => {
          const isSelected = activeStepId === step.id;
          const statusBadge = getStatusBadge(step.status);

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => setActiveStepId(step.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 6,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: isSelected ? `rgba(${accentRGB}, 0.12)` : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isSelected ? accentColor : "rgba(255, 255, 255, 0.08)"}`,
                  color: "#ffffff",
                  cursor: "pointer",
                  minWidth: 150,
                  flexShrink: 0,
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700 }}>
                    STAGE {step.step}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8.5,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      border: `1px solid ${statusBadge.border}`,
                    }}
                  >
                    {statusBadge.label}
                  </span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.85)" }}>
                  {step.name}
                </div>
              </button>

              {/* Vector arrow separator */}
              {idx < pipeline.length - 1 && (
                <span style={{ color: "rgba(255, 255, 255, 0.25)", fontSize: 12, padding: "0 2px", flexShrink: 0 }}>
                  ➔
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer */}
      <AnimatePresence mode="wait">
        {activeStep && (
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              background: "rgba(12, 18, 30, 0.6)",
              border: `1px solid rgba(${accentRGB}, 0.2)`,
              borderRadius: 12,
              padding: "18px 22px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  STAGE {activeStep.step} SPECIFICATION
                </span>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#ffffff", margin: "4px 0 0" }}>
                  {activeStep.title}
                </h4>
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: getStatusBadge(activeStep.status).bg,
                  color: getStatusBadge(activeStep.status).color,
                  border: `1px solid ${getStatusBadge(activeStep.status).border}`,
                }}
              >
                ● {getStatusBadge(activeStep.status).label}
              </span>
            </div>

            <p style={{ fontSize: 13.5, color: "rgba(255, 255, 255, 0.78)", lineHeight: 1.6, margin: "0 0 16px" }}>
              {activeStep.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", marginBottom: 3 }}>
                  INCOMING INPUTS
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#ffffff", fontWeight: 600 }}>
                  {activeStep.inputs}
                </div>
              </div>

              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", marginBottom: 3 }}>
                  GENERATED OUTPUTS
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: accentColor, fontWeight: 600 }}>
                  {activeStep.outputs}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

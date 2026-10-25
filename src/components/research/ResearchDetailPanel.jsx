import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ResearchDetailPanel Component
 * Glassmorphic holographic panel displaying detailed component analysis, methodology, and metrics.
 */
export function ResearchDetailPanel({
  node,
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
      if (e.key === "ArrowRight" && onNext && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!node) return null;

  return (
    <motion.aside
      key={node.id}
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        top: 80,
        right: 28,
        bottom: 28,
        width: "min(440px, 92vw)",
        background: "rgba(6, 11, 22, 0.88)",
        border: `1px solid rgba(${project.accentRGB}, 0.35)`,
        borderRadius: 22,
        padding: "26px 26px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(${project.accentRGB}, 0.15)`,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowY: "auto",
      }}
    >
      <div>
        {/* Top Header: Node Badge + Project + Close Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                padding: "3px 10px",
                borderRadius: 20,
                background: `rgba(${project.accentRGB}, 0.15)`,
                border: `1px solid ${project.primaryColor}`,
                color: project.primaryColor,
                textTransform: "uppercase",
              }}
            >
              NODE {node.number} · {node.shortTag}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = project.primaryColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Node Title & Icon */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{node.icon}</span>
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {node.title}
          </h3>
        </div>

        {/* Pipeline Role Banner */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 10,
            padding: "8px 12px",
            marginBottom: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: project.primaryColor,
            fontWeight: 600,
          }}
        >
          {node.pipelineRole}
        </div>

        {/* 1. What This Component Means */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: project.primaryColor,
              marginBottom: 6,
            }}
          >
            01 · Architectural Meaning
          </div>
          <p
            style={{
              fontSize: 13.5,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {node.concept}
          </p>
        </div>

        {/* 2. Why It Matters */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#f59e0b",
              marginBottom: 6,
            }}
          >
            02 · Why It Matters
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255, 255, 255, 0.72)",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {node.whyItMatters}
          </p>
        </div>

        {/* 3. Methodology & Technical Verification Metrics */}
        {node.metrics && node.metrics.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#10b981",
                marginBottom: 8,
              }}
            >
              03 · Evaluation Benchmarks
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {node.metrics.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 18,
                      color: "#ffffff",
                      marginBottom: 2,
                    }}
                  >
                    {m.val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      color: "rgba(255, 255, 255, 0.5)",
                      lineHeight: 1.2,
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Implementation Details */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 12,
            padding: "12px 14px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "rgba(255, 255, 255, 0.65)",
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          <span style={{ color: project.primaryColor, fontWeight: 700 }}>ENGINEERING NOTE: </span>
          {node.details}
        </div>
      </div>

      {/* Bottom Node Navigation: Prev / Next buttons */}
      <div
        style={{
          paddingTop: 14,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          style={{
            background: "transparent",
            border: "none",
            color: hasPrev ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.2)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            cursor: hasPrev ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Prev Node
        </button>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          {node.number} / 06
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          style={{
            background: "transparent",
            border: "none",
            color: hasNext ? project.primaryColor : "rgba(255, 255, 255, 0.2)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            cursor: hasNext ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Next Node →
        </button>
      </div>
    </motion.aside>
  );
}

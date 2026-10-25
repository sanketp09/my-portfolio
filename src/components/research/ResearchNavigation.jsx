import React from "react";

/**
 * ResearchNavigation Component
 * Top laboratory header with project switchers, research overview subtitle, and back controls.
 */
export function ResearchNavigation({
  activeProjectId,
  onSelectProject,
  onResetView,
  onBack,
  isExpanded = false,
}) {
  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 50,
        pointerEvents: "auto",
        background: "linear-gradient(to bottom, rgba(3, 7, 18, 0.9) 0%, transparent 100%)",
      }}
    >
      {/* Left: Section Title & Scientific Subtitle */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 10px #38bdf8",
            }}
          />
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 36px)",
              letterSpacing: "0.08em",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1,
            }}
          >
            RESEARCH LABORATORY
          </h1>
        </div>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(12px, 1.4vw, 13.5px)",
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0,
            fontStyle: "italic",
            letterSpacing: "0.02em",
          }}
        >
          Two research directions. One pursuit of intelligent systems.
        </p>
      </div>

      {/* Center: Fast Project Switcher Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 30,
          padding: "4px 6px",
        }}
      >
        <button
          type="button"
          onClick={onResetView}
          style={{
            background: !isExpanded ? "rgba(255, 255, 255, 0.12)" : "transparent",
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: !isExpanded ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => onSelectProject("helix")}
          style={{
            background: activeProjectId === "helix" && isExpanded ? "rgba(56, 189, 248, 0.2)" : "transparent",
            border: `1px solid ${activeProjectId === "helix" && isExpanded ? "#38bdf8" : "transparent"}`,
            borderRadius: 20,
            padding: "6px 14px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: activeProjectId === "helix" && isExpanded ? "#38bdf8" : "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🧬</span> Project Helix
        </button>

        <button
          type="button"
          onClick={() => onSelectProject("reclaim")}
          style={{
            background: activeProjectId === "reclaim" && isExpanded ? "rgba(16, 185, 129, 0.2)" : "transparent",
            border: `1px solid ${activeProjectId === "reclaim" && isExpanded ? "#10b981" : "transparent"}`,
            borderRadius: 20,
            padding: "6px 14px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: activeProjectId === "reclaim" && isExpanded ? "#10b981" : "rgba(255, 255, 255, 0.7)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🌱</span> ReClaim
        </button>
      </div>

      {/* Right: Back to Orbital Navigation Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isExpanded && (
          <button
            type="button"
            onClick={onResetView}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            ← Collapse View
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)";
            e.currentTarget.style.borderColor = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
        >
          Back ↗
        </button>
      </div>
    </header>
  );
}

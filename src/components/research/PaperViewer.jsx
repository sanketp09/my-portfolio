import React, { useState } from "react";

/**
 * PaperViewer Component
 * Readable document-style manuscript viewer with section navigation and academic formatting.
 */
export function PaperViewer({ paper, accentColor, accentRGB }) {
  if (!paper) return null;

  const [activeSectionId, setActiveSectionId] = useState(paper.sections[0]?.id || "sec-1");

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Manuscript Header Banner */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.025)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 12,
          padding: "24px 26px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: 4,
              background: `rgba(${accentRGB}, 0.15)`,
              color: accentColor,
              border: `1px solid rgba(${accentRGB}, 0.3)`,
            }}
          >
            {paper.statusBadge}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255, 255, 255, 0.45)" }}>
            {paper.venue}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(20px, 2.4vw, 26px)",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 10px",
            lineHeight: 1.3,
          }}
        >
          {paper.title}
        </h2>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255, 255, 255, 0.65)", marginBottom: 16 }}>
          {paper.authors}
        </div>

        {/* Abstract Block */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            borderLeft: `3px solid ${accentColor}`,
            padding: "14px 18px",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: accentColor, textTransform: "uppercase", marginBottom: 6 }}>
            ABSTRACT
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "rgba(255, 255, 255, 0.8)" }}>
            {paper.abstract}
          </p>
        </div>
      </div>

      {/* Two-Column Manuscript Layout: Section Nav + Reader */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "flex-start" }}>
        {/* Sticky Section Sidebar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            position: "sticky",
            top: 20,
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.1em" }}>
            MANUSCRIPT SECTIONS
          </div>
          {paper.sections.map((sec) => {
            const isCurrent = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSectionId(sec.id);
                  const el = document.getElementById(sec.id);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: isCurrent ? `rgba(${accentRGB}, 0.12)` : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${isCurrent ? accentColor : "transparent"}`,
                  color: isCurrent ? "#ffffff" : "rgba(255, 255, 255, 0.55)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {sec.heading.split(".")[0]}. {sec.heading.split(".")[1]?.trim()}
              </button>
            );
          })}
        </div>

        {/* Document Narrative Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {paper.sections.map((sec) => (
            <div
              key={sec.id}
              id={sec.id}
              style={{
                scrollMarginTop: 24,
                paddingBottom: 20,
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <h4
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16.5,
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 10px",
                }}
              >
                {sec.heading}
              </h4>
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: "rgba(255, 255, 255, 0.78)",
                  margin: 0,
                }}
              >
                {sec.content}
              </p>
            </div>
          ))}

          {/* References Section */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16.5, fontWeight: 700, color: "#ffffff", margin: "0 0 12px" }}>
              References
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {paper.references.map((ref, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: 1.5,
                    paddingLeft: 14,
                    borderLeft: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  [{idx + 1}] {ref}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

/**
 * DataRoom Component
 * Data room with dataset schemas, field tables, safe sample records, and privacy compliance notes.
 */
export function DataRoom({ dataRoom, accentColor, accentRGB }) {
  if (!dataRoom || !dataRoom.datasets) return null;

  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const activeDataset = dataRoom.datasets[activeDatasetIndex] || dataRoom.datasets[0];

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
          Research Data Assets
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#ffffff", margin: 0 }}>
          Data Room & Schemas
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.55)", margin: "4px 0 0" }}>
          Transparent documentation of benchmark corpuses, schemas, preprocessing pipelines, and ethical compliance boundaries.
        </p>
      </div>

      {/* Dataset Selector Tabs if multiple */}
      {dataRoom.datasets.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {dataRoom.datasets.map((ds, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveDatasetIndex(i)}
              style={{
                background: activeDatasetIndex === i ? `rgba(${accentRGB}, 0.14)` : "rgba(255, 255, 255, 0.03)",
                border: `1px solid ${activeDatasetIndex === i ? accentColor : "rgba(255, 255, 255, 0.08)"}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                color: activeDatasetIndex === i ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {ds.name.split("(")[0]}
            </button>
          ))}
        </div>
      )}

      {/* Selected Dataset Detail Dossier */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Overview Metadata Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.025)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 10,
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#ffffff", margin: 0 }}>
              {activeDataset.name}
            </h4>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 4,
                background: `rgba(${accentRGB}, 0.12)`,
                color: accentColor,
                border: `1px solid rgba(${accentRGB}, 0.3)`,
              }}
            >
              {activeDataset.accessStatus}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>SOURCE & REPOSITORY</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#ffffff", marginTop: 2 }}>{activeDataset.source}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>VOLUME & SPLIT</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#ffffff", marginTop: 2 }}>{activeDataset.recordsCount} ({activeDataset.fileSize})</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>LICENSING</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: accentColor, marginTop: 2 }}>{activeDataset.license}</div>
            </div>
          </div>
        </div>

        {/* Schema Table */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
            Data Schema & Field Dictionary
          </div>
          <div
            style={{
              background: "rgba(10, 16, 28, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <th style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Field Name</th>
                  <th style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Type</th>
                  <th style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Description & Constraints</th>
                </tr>
              </thead>
              <tbody>
                {activeDataset.schema.map((f, i) => (
                  <tr key={f.field} style={{ borderBottom: i < activeDataset.schema.length - 1 ? "1px solid rgba(255, 255, 255, 0.04)" : "none" }}>
                    <td style={{ padding: "9px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#ffffff", fontWeight: 600 }}>
                      {f.field}
                    </td>
                    <td style={{ padding: "9px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: accentColor }}>
                      {f.type}
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }}>
                      {f.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preprocessing & Ethics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
              PREPROCESSING & CLEANING PIPELINE
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.55 }}>
              {activeDataset.preprocessing}
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#10b981", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
              PRIVACY & ETHICS COMPLIANCE
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.55 }}>
              {activeDataset.ethicalNotes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PipelineDiagram } from "./PipelineDiagram";
import { ResearchNotebook } from "./ResearchNotebook";
import { ExperimentLog } from "./ExperimentLog";
import { DataRoom } from "./DataRoom";
import { PaperViewer } from "./PaperViewer";
import { MilestonesTimeline } from "./MilestonesTimeline";

const WORKSPACE_TABS = [
  { id: "overview", label: "Overview", icon: "📐" },
  { id: "notebook", label: "Research Notebook", icon: "📓" },
  { id: "experiments", label: "Experiment Log", icon: "🧪" },
  { id: "dataroom", label: "Data Room", icon: "🗄️" },
  { id: "paper", label: "Paper in Progress", icon: "📄" },
  { id: "milestones", label: "Milestones", icon: "🏁" },
];

/**
 * ResearchWorkspace Component
 * Three-part desktop workbench: Left Sidebar, Central Workspace, Right Context Panel.
 */
export function ResearchWorkspace({ investigation, onBack, onSwitchInvestigation, allInvestigations }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [contextOpen, setContextOpen] = useState(true);

  if (!investigation) return null;

  const accentColor = investigation.accentColor;
  const accentRGB = investigation.accentRGB;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#030712",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 60,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* ── Top Command Bar ── */}
      <header
        style={{
          height: 52,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(6, 11, 20, 0.95)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Back & Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 4,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"; }}
          >
            ← Lab Overview
          </button>

          <span style={{ color: "rgba(255, 255, 255, 0.2)", fontSize: 12 }}>/</span>

          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, fontWeight: 700 }}>
            {investigation.code}
          </span>

          <span style={{ color: "rgba(255, 255, 255, 0.2)", fontSize: 12 }}>/</span>

          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
            {investigation.title}
          </span>
        </div>

        {/* Center: Switch Between the 2 Investigations */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 6,
            padding: "2px",
          }}
        >
          {allInvestigations.map((inv) => {
            const isCurrent = inv.id === investigation.id;
            return (
              <button
                key={inv.id}
                type="button"
                onClick={() => onSwitchInvestigation(inv.id)}
                style={{
                  background: isCurrent ? `rgba(${inv.accentRGB}, 0.16)` : "transparent",
                  border: `1px solid ${isCurrent ? inv.accentColor : "transparent"}`,
                  borderRadius: 4,
                  padding: "4px 10px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: isCurrent ? "#ffffff" : "rgba(255, 255, 255, 0.55)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {inv.number} · {inv.title}
              </button>
            );
          })}
        </div>

        {/* Right: Active Status & Context Panel Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 4,
              background: `rgba(${accentRGB}, 0.1)`,
              border: `1px solid rgba(${accentRGB}, 0.25)`,
              color: accentColor,
            }}
          >
            ● {investigation.statusBadge}
          </span>

          <button
            type="button"
            onClick={() => setContextOpen(!contextOpen)}
            title="Toggle Right Context Panel"
            style={{
              background: contextOpen ? "rgba(255, 255, 255, 0.08)" : "transparent",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 4,
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {contextOpen ? "Hide Specs ⇥" : "Show Specs ⇤"}
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body (3-Part Layout) ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* ── 1. LEFT SIDEBAR (Sections Navigation) ── */}
        <aside
          style={{
            width: 240,
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(6, 10, 18, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 0,
            padding: "20px 14px",
          }}
        >
          <div>
            {/* Investigation Badge */}
            <div style={{ padding: "0 8px 16px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: 16 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                INVESTIGATION {investigation.number}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#ffffff", marginTop: 2 }}>
                {investigation.title}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, marginTop: 2 }}>
                {investigation.category.split("·")[0]?.trim()}
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {WORKSPACE_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: isActive ? `rgba(${accentRGB}, 0.14)` : "transparent",
                      border: "none",
                      borderLeft: `2px solid ${isActive ? accentColor : "transparent"}`,
                      color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11.5,
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div style={{ padding: "12px 8px 0", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.35)", lineHeight: 1.4 }}>
              {investigation.institution}
            </div>
          </div>
        </aside>

        {/* ── 2. CENTRAL WORKSPACE (Active Content Render) ── */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 40px",
            background: "#030712",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div>
                  {/* Overview Hero Narrative */}
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
                      Executive Summary
                    </div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#ffffff", margin: "0 0 10px" }}>
                      {investigation.fullTitle}
                    </h2>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255, 255, 255, 0.78)", margin: "0 0 24px", maxWidth: 840 }}>
                      {investigation.summary}
                    </p>

                    {/* Key Metrics Strip */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, maxWidth: 840 }}>
                      {investigation.keyMetrics.map((km, i) => (
                        <div
                          key={i}
                          style={{
                            background: "rgba(255, 255, 255, 0.025)",
                            border: "1px solid rgba(255, 255, 255, 0.07)",
                            borderRadius: 8,
                            padding: "12px 14px",
                          }}
                        >
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", marginBottom: 4 }}>
                            {km.label}
                          </div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#ffffff", letterSpacing: "0.04em" }}>
                            {km.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Methodology Pipeline Diagram */}
                  <PipelineDiagram
                    pipeline={investigation.pipeline}
                    accentColor={accentColor}
                    accentRGB={accentRGB}
                  />
                </div>
              )}

              {activeTab === "notebook" && (
                <ResearchNotebook
                  notebook={investigation.notebook}
                  accentColor={accentColor}
                  accentRGB={accentRGB}
                />
              )}

              {activeTab === "experiments" && (
                <ExperimentLog
                  experiments={investigation.experiments}
                  accentColor={accentColor}
                  accentRGB={accentRGB}
                />
              )}

              {activeTab === "dataroom" && (
                <DataRoom
                  dataRoom={investigation.dataRoom}
                  accentColor={accentColor}
                  accentRGB={accentRGB}
                />
              )}

              {activeTab === "paper" && (
                <PaperViewer
                  paper={investigation.paper}
                  accentColor={accentColor}
                  accentRGB={accentRGB}
                />
              )}

              {activeTab === "milestones" && (
                <MilestonesTimeline
                  milestones={investigation.milestones}
                  accentColor={accentColor}
                  accentRGB={accentRGB}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── 3. RIGHT CONTEXT PANEL (Metadata, Specs & References) ── */}
        {contextOpen && (
          <aside
            style={{
              width: 290,
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(6, 10, 18, 0.8)",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              flexShrink: 0,
              overflowY: "auto",
            }}
          >
            {/* Section 1: Investigation Dossier */}
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
                INVESTIGATION DOSSIER
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                <div>
                  <div style={{ color: "rgba(255, 255, 255, 0.45)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5 }}>PROJECT CODE</div>
                  <div style={{ color: "#ffffff", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{investigation.code}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(255, 255, 255, 0.45)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5 }}>STATUS</div>
                  <div style={{ color: accentColor, fontFamily: "'JetBrains Mono', monospace" }}>{investigation.statusBadge}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(255, 255, 255, 0.45)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5 }}>CATEGORIES</div>
                  <div style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.4 }}>{investigation.category}</div>
                </div>
              </div>
            </div>

            {/* Section 2: Pipeline State Indicator */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
                PIPELINE COVERAGE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {investigation.pipeline.map((p) => {
                  const isDone = p.status === "implemented";
                  const isProgress = p.status === "in_progress";
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: isDone || isProgress ? "#ffffff" : "rgba(255, 255, 255, 0.4)" }}>
                        {p.step}. {p.name}
                      </span>
                      <span style={{ color: isDone ? "#10b981" : isProgress ? "#f59e0b" : "rgba(255, 255, 255, 0.3)" }}>
                        {isDone ? "✓" : isProgress ? "⏳" : "○"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Key Citations */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>
                FOUNDATIONAL REFERENCES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {investigation.notebook.literatureReview.slice(0, 2).map((lit, i) => (
                  <div key={i} style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.45, paddingLeft: 8, borderLeft: `2px solid rgba(${accentRGB}, 0.3)` }}>
                    {lit.citation.split(".")[0]}. ({lit.citation.split("(")[1]?.split(")")[0] || ""}).
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Academic Integrity Notice */}
            <div
              style={{
                marginTop: "auto",
                padding: "10px 12px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9.5,
                color: "rgba(255, 255, 255, 0.4)",
                lineHeight: 1.4,
              }}
            >
              Academic Verification: All metrics represent simulated benchmark results or empirical trials documented in the experiment log.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

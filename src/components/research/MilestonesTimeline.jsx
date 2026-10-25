import React from "react";

/**
 * MilestonesTimeline Component
 * Clear research timeline with realistic status badges, target dates, and dependencies.
 */
export function MilestonesTimeline({ milestones, accentColor, accentRGB }) {
  if (!milestones) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return { label: "Completed", bg: "rgba(16, 185, 129, 0.12)", color: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "In Progress":
        return { label: "In Progress", bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
      default:
        return { label: "Upcoming", bg: "rgba(148, 163, 184, 0.12)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" };
    }
  };

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
          Research Roadmap
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#ffffff", margin: 0 }}>
          Investigation Milestones
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.55)", margin: "4px 0 0" }}>
          Chronological development roadmap documenting formalization, algorithmic validation, and scheduled publications.
        </p>
      </div>

      {/* Timeline List */}
      <div style={{ position: "relative", paddingLeft: 28 }}>
        {/* Continuous vertical line */}
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 10,
            bottom: 20,
            width: 2,
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {milestones.map((m, idx) => {
            const badge = getStatusBadge(m.status);
            const isCompleted = m.status === "Completed";
            const isInProgress = m.status === "In Progress";

            return (
              <div key={m.id} style={{ position: "relative" }}>
                {/* Timeline Node Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -28,
                    top: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: isCompleted ? "#10b981" : isInProgress ? "#f59e0b" : "#1e293b",
                    border: `2px solid ${isCompleted ? "#10b981" : isInProgress ? "#f59e0b" : "rgba(255, 255, 255, 0.2)"}`,
                    boxShadow: isCompleted ? "0 0 8px rgba(16, 185, 129, 0.5)" : isInProgress ? "0 0 8px rgba(245, 158, 11, 0.5)" : "none",
                  }}
                />

                {/* Milestone Content Card */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: 10,
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700 }}>
                        MILESTONE 0{idx + 1}
                      </span>
                      <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#ffffff", margin: 0 }}>
                        {m.title}
                      </h4>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255, 255, 255, 0.45)" }}>
                        {m.date}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9.5,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        ● {badge.label}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.55, margin: "0 0 8px" }}>
                    {m.description}
                  </p>

                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255, 255, 255, 0.45)" }}>
                    <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Dependencies: </span>
                    {m.dependencies}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

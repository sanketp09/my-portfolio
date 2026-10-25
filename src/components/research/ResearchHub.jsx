import React, { useState } from "react";
import { motion } from "framer-motion";
import { ResearchHexagon } from "./ResearchHexagon";

/**
 * ResearchHub Component
 * The central hexagonal anchor for each research project.
 */
export function ResearchHub({
  project,
  isExpanded = false,
  isSecondary = false,
  onSelect,
  size = 320,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: isExpanded ? 1.05 : isSecondary ? 0.85 : isHovered ? 1.03 : 1,
        opacity: isSecondary ? 0.3 : 1,
        y: isHovered && !isExpanded ? -6 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      style={{
        position: "relative",
        zIndex: isExpanded ? 30 : 10,
        filter: isExpanded
          ? `drop-shadow(0 0 50px rgba(${project.accentRGB}, 0.5))`
          : isHovered
          ? `drop-shadow(0 0 35px rgba(${project.accentRGB}, 0.35))`
          : "none",
      }}
    >
      <ResearchHexagon
        size={size}
        accentColor={project.primaryColor}
        accentRGB={project.accentRGB}
        isActive={isExpanded}
        isHovered={isHovered}
        isSecondary={isSecondary}
      >
        {/* Top Research Number Badge */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            color: project.primaryColor,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: project.primaryColor,
              boxShadow: `0 0 8px ${project.primaryColor}`,
            }}
          />
          {project.number}
        </div>

        {/* Project Title */}
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: size > 300 ? 38 : 32,
            letterSpacing: "0.04em",
            color: "#ffffff",
            margin: "0 0 6px",
            lineHeight: 0.95,
            textAlign: "center",
            textShadow: `0 0 20px rgba(${project.accentRGB}, 0.4)`,
          }}
        >
          {project.title}
        </h3>

        {/* Subtitle / Category Label */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "center",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          {project.subtitle}
        </div>

        {/* 1-Line Description */}
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 11.5,
            color: "rgba(255, 255, 255, 0.6)",
            lineHeight: 1.45,
            textAlign: "center",
            maxWidth: size * 0.72,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </div>

        {/* Visual Motif Pill */}
        <div
          style={{
            background: `rgba(${project.accentRGB}, 0.08)`,
            border: `1px solid rgba(${project.accentRGB}, 0.25)`,
            borderRadius: 20,
            padding: "4px 10px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5,
            color: project.primaryColor,
            letterSpacing: "0.08em",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {project.category}
        </div>

        {/* Action Cue */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: isExpanded ? "#ffffff" : project.primaryColor,
            background: isExpanded ? project.primaryColor : "rgba(255, 255, 255, 0.04)",
            border: `1px solid ${isExpanded ? project.primaryColor : `rgba(${project.accentRGB}, 0.35)`}`,
            borderRadius: 20,
            padding: "5px 12px",
            transition: "all 0.2s ease",
          }}
        >
          {isExpanded ? "CONSTELLATION ACTIVE ●" : project.actionText}
        </div>
      </ResearchHexagon>
    </motion.div>
  );
}

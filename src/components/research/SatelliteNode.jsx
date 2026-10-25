import React, { useState } from "react";
import { motion } from "framer-motion";
import { ResearchHexagon } from "./ResearchHexagon";

/**
 * SatelliteNode Component
 * Smaller hexagonal information node orbiting the central hub in a 6-node constellation.
 */
export function SatelliteNode({
  node,
  index,
  accentColor = "#38bdf8",
  accentRGB = "56, 189, 248",
  isSelected = false,
  isDimmed = false,
  onClick,
  x = 0,
  y = 0,
  size = 140,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Staggered sequential emergence delay
  const enterDelay = 0.15 + index * 0.08;

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -20 }}
      animate={{
        x,
        y,
        scale: isSelected ? 1.15 : isHovered ? 1.08 : 1,
        opacity: isDimmed ? 0.35 : 1,
        rotate: 0,
      }}
      exit={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 20 }}
      transition={{
        duration: 0.7,
        delay: enterDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        zIndex: isSelected ? 40 : 25,
        cursor: "pointer",
        filter: isSelected
          ? `drop-shadow(0 0 28px ${accentColor})`
          : isHovered
          ? `drop-shadow(0 0 18px rgba(${accentRGB}, 0.5))`
          : "none",
      }}
    >
      <ResearchHexagon
        size={size}
        accentColor={accentColor}
        accentRGB={accentRGB}
        isActive={isSelected}
        isHovered={isHovered}
        isSecondary={isDimmed}
      >
        {/* Node Index & Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              fontWeight: 700,
              color: isSelected ? "#ffffff" : accentColor,
              letterSpacing: "0.14em",
            }}
          >
            NODE {node.number}
          </span>
          <span style={{ fontSize: 13 }}>{node.icon}</span>
        </div>

        {/* Node Title */}
        <h4
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: size > 120 ? 12.5 : 11,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            margin: "0 0 4px",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {node.title}
        </h4>

        {/* Short Explanatory Tag */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
            background: isSelected ? `rgba(${accentRGB}, 0.4)` : "rgba(255, 255, 255, 0.05)",
            border: `1px solid ${isSelected ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
            borderRadius: 12,
            padding: "2px 8px",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {node.shortTag}
        </div>

        {/* Subtle Indicator Dot on Selected */}
        {isSelected && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        )}
      </ResearchHexagon>
    </motion.div>
  );
}

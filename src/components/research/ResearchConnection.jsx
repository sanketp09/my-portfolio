import React from "react";
import { motion } from "framer-motion";

/**
 * ResearchConnection Component
 * Animated SVG connecting lines with traveling energy pulses linking the central hub to satellite nodes.
 */
export function ResearchConnection({
  startX = 0,
  startY = 0,
  endX = 0,
  endY = 0,
  accentColor = "#38bdf8",
  accentRGB = "56, 189, 248",
  isSelected = false,
  index = 0,
}) {
  const lineDelay = 0.1 + index * 0.08;

  return (
    <g>
      {/* Background Static Connection Line */}
      <motion.line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={`rgba(${accentRGB}, ${isSelected ? 0.6 : 0.2})`}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={isSelected ? "none" : "4 4"}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: lineDelay, ease: "easeOut" }}
      />

      {/* Pulsing Traveling Signal Line */}
      <motion.line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={accentColor}
        strokeWidth={isSelected ? 2.5 : 1.5}
        strokeDasharray="12 48"
        initial={{ strokeDashoffset: 60, opacity: 0 }}
        animate={{
          strokeDashoffset: [60, -60],
          opacity: isSelected ? 0.9 : 0.6,
        }}
        transition={{
          strokeDashoffset: {
            repeat: Infinity,
            duration: isSelected ? 1.4 : 2.4,
            ease: "linear",
          },
          opacity: { duration: 0.3 },
        }}
      />

      {/* Target Node Attachment Endpoint Dot */}
      <motion.circle
        cx={endX}
        cy={endY}
        r={isSelected ? 4 : 2.5}
        fill={accentColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3, delay: lineDelay + 0.3 }}
        style={{
          filter: `drop-shadow(0 0 6px ${accentColor})`,
        }}
      />
    </g>
  );
}

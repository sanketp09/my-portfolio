import React from "react";

/**
 * Generates an SVG path for a regular hexagon.
 * @param {number} size - Outer diameter / bounding box width
 * @param {boolean} pointy - true for pointy top, false for flat top
 */
export function getHexagonPoints(size, pointy = true) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const points = [];
  const startAngle = pointy ? -Math.PI / 2 : 0;

  for (let i = 0; i < 6; i++) {
    const angle = startAngle + (i * Math.PI) / 3;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return points.join(" ");
}

/**
 * ResearchHexagon Component
 * Renders a high-tech glassmorphic hexagonal card with glowing borders and inner accents.
 */
export function ResearchHexagon({
  size = 200,
  accentColor = "#38bdf8",
  accentRGB = "56, 189, 248",
  isHovered = false,
  isActive = false,
  isSecondary = false,
  pointy = true,
  children,
  onClick,
  style = {},
  className = "",
}) {
  const points = getHexagonPoints(size, pointy);
  const innerSize = size * 0.92;
  const innerPoints = getHexagonPoints(innerSize, pointy);
  const offset = (size - innerSize) / 2;

  const glowIntensity = isActive
    ? `0 0 35px rgba(${accentRGB}, 0.55), inset 0 0 25px rgba(${accentRGB}, 0.2)`
    : isHovered
    ? `0 0 25px rgba(${accentRGB}, 0.4), inset 0 0 15px rgba(${accentRGB}, 0.15)`
    : `0 8px 32px rgba(0, 0, 0, 0.6)`;

  const borderColor = isActive
    ? accentColor
    : isHovered
    ? `rgba(${accentRGB}, 0.8)`
    : isSecondary
    ? "rgba(255, 255, 255, 0.12)"
    : `rgba(${accentRGB}, 0.35)`;

  return (
    <div
      onClick={onClick}
      className={`research-hexagon ${className}`}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
        opacity: isSecondary ? 0.35 : 1,
        ...style,
      }}
    >
      {/* SVG Geometric Frame */}
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          filter: `drop-shadow(0 0 14px rgba(${accentRGB}, ${isActive ? 0.4 : isHovered ? 0.25 : 0.08}))`,
        }}
      >
        <defs>
          {/* Subtle linear gradient for outer rim */}
          <linearGradient id={`hex-grad-${accentRGB}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={isActive ? 0.9 : 0.6} />
            <stop offset="50%" stopColor={accentColor} stopOpacity={isActive ? 0.3 : 0.1} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={isActive ? 0.8 : 0.4} />
          </linearGradient>

          {/* Hexagonal Clip Path */}
          <clipPath id={`hex-clip-${size}`}>
            <polygon points={points} />
          </clipPath>
        </defs>

        {/* Outer Hexagon Fill */}
        <polygon
          points={points}
          fill="rgba(8, 14, 28, 0.75)"
          stroke={`url(#hex-grad-${accentRGB})`}
          strokeWidth={isActive ? 2.5 : isHovered ? 2 : 1.5}
        />

        {/* Inner Accent Ring */}
        <g transform={`translate(${offset}, ${offset})`}>
          <polygon
            points={innerPoints}
            fill="transparent"
            stroke={borderColor}
            strokeWidth={1}
            strokeDasharray={isHovered || isActive ? "6 4" : "none"}
            opacity={0.65}
          />
        </g>

        {/* Vertex Tech Accents (6 Corner Dots) */}
        {pointy && (
          <g fill={accentColor} opacity={isActive ? 0.9 : isHovered ? 0.7 : 0.35}>
            <circle cx={size / 2} cy={2} r={isActive ? 3 : 2} />
            <circle cx={size - 2} cy={size * 0.25} r={2} />
            <circle cx={size - 2} cy={size * 0.75} r={2} />
            <circle cx={size / 2} cy={size - 2} r={isActive ? 3 : 2} />
            <circle cx={2} cy={size * 0.75} r={2} />
            <circle cx={2} cy={size * 0.25} r={2} />
          </g>
        )}
      </svg>

      {/* Hexagonal Glass Content Area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `polygon(${points.split(" ").map((p) => `${p.split(",")[0]}px ${p.split(",")[1]}px`).join(", ")})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: size * 0.14,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

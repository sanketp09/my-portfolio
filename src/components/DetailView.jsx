import { useEffect, useMemo, useRef, useState } from "react";
import { useScene, AVATARS } from "../context/SceneContext";
import { AnimatePresence, motion } from "framer-motion";
import { OrbitalRiftScene } from "../scene/OrbitalRiftScene";

export function DetailView({ onOpenHackathons, onOpenProjects, onOpenResearch, onOpenExperience }) {
  const { selected, deselect } = useScene();
  const avatar = AVATARS[selected] || AVATARS.sanket;

  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [hoveredRealm, setHoveredRealm] = useState(null);
  const [selectedRealm, setSelectedRealm] = useState(null);

  // Wheel accumulation for silky-smooth exit back to avatars
  const wheelAccum = useRef(0);
  const wheelTimer = useRef(null);

  useEffect(() => {
    const onWheel = (e) => {
      // If user scrolls up in orbital, smoothly return to Meet the Developer
      if (e.deltaY < -20) {
        wheelAccum.current += Math.abs(e.deltaY);
        clearTimeout(wheelTimer.current);
        wheelTimer.current = setTimeout(() => {
          wheelAccum.current = 0;
        }, 300);
        if (wheelAccum.current > 75) {
          wheelAccum.current = 0;
          deselect();
        }
      } else {
        wheelAccum.current = 0;
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta < -50) {
        // Swiped down -> go back to avatars
        deselect();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      clearTimeout(wheelTimer.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [deselect]);

  const handleRealmSelect = (id) => {
    setSelectedRealm(id);
    if (id === "hackathons") {
      if (onOpenHackathons) onOpenHackathons();
    } else if (id === "projects") {
      if (onOpenProjects) onOpenProjects();
    } else if (id === "experience") {
      if (onOpenExperience) onOpenExperience();
    } else if (id === "research") {
      if (onOpenResearch) onOpenResearch();
    }
  };

  const resumeHref = "/resume/resume.pdf";

  const contactLinks = useMemo(
    () => [
      { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/sanket-patil1708/" },
      { label: "GitHub", short: "gh", href: "https://github.com/sanketp09" },
      { label: "Email", short: "✉", href: "mailto:sanketpatil.work@gmail.com" },
      { label: "Call", short: "☎", href: "tel:+919152030715" },
    ],
    []
  );

  if (!avatar) return null;

  return (
    <motion.div
      key="detail-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        zIndex: 50,
        backgroundColor: "#030712",
        overflow: "hidden",
      }}
    >
      {/* Cosmic background with subtle radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(ellipse 65% 55% at 50% 48%, rgba(20, 52, 98, 0.28) 0%, rgba(8, 20, 46, 0.18) 45%, rgba(2, 5, 14, 0.96) 88%),
            radial-gradient(circle at 50% 50%, rgba(12, 25, 54, 0.35) 0%, #030712 100%)
          `,
        }}
      />

      {/* 3D SCENE LAYER: The Four Symmetrical Models & Subtle Light Pools */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        <OrbitalRiftScene
          progress={1}
          background={null}
          hoveredId={hoveredRealm}
          selectedId={selectedRealm}
          onHoverChange={setHoveredRealm}
          onSelect={handleRealmSelect}
          showControls={false}
        />
      </div>

      {/* SVG Connecting Paths linking Center Avatar to the 4 Realms */}
      <NexusConnectingPaths hoveredRealm={hoveredRealm} />

      {/* Top Center Nexus Header */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 15,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
          }}
        >
          Four realms. One journey.
        </span>
      </div>

      {/* Back to Avatars button (top-left) */}
      <button
        type="button"
        onClick={deselect}
        style={{
          position: "absolute",
          top: 56,
          left: 24,
          padding: "8px 18px",
          background: "rgba(10, 16, 28, 0.85)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "rgba(255,255,255,0.85)",
          borderRadius: 20,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: "0.1em",
          transition: "all 0.2s ease",
          zIndex: 30,
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "white";
          e.currentTarget.style.borderColor = avatar.accent;
          e.currentTarget.style.boxShadow = `0 0 15px ${avatar.accentDim}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        ← BACK TO AVATARS
      </button>

      {/* ── CENTRAL AVATAR: EXACT SAME SIZE AS MEET THE DEVELOPER CARD ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 12,
          pointerEvents: "auto",
          userSelect: "none",
        }}
      >
        {/* Subtle Glowing Cyan Aura Ring behind the Avatar */}
        <div
          style={{
            position: "absolute",
            width: "clamp(330px, 31vw, 390px)",
            height: "clamp(330px, 31vw, 390px)",
            borderRadius: "50%",
            border: `2px solid ${avatar.accent}55`,
            boxShadow: `0 0 45px ${avatar.accent}33, inset 0 0 30px ${avatar.accent}22`,
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 1,
            background: "radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, rgba(3, 7, 18, 0.7) 70%)",
          }}
        />

        {/* Sanket's Cutout Photo */}
        <div
          style={{
            position: "relative",
            width: "clamp(295px, 28vw, 350px)",
            height: "clamp(350px, 39vh, 410px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <motion.img
            layoutId={`photo-${avatar.id}`}
            src={avatar.photo}
            alt={avatar.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center bottom",
              display: "block",
              filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.9))",
            }}
          />
        </div>

        {/* Identity Details */}
        <div style={{ textAlign: "center", zIndex: 3, marginTop: -4 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 2.2vw, 26px)",
              fontWeight: 800,
              margin: "0 0 4px 0",
              color: "#ffffff",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            {avatar.name}
          </h2>
          <p
            style={{
              color: avatar.accent,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              fontWeight: 700,
              margin: "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              textShadow: `0 0 12px ${avatar.accent}66`,
            }}
          >
            {avatar.title}
          </p>
        </div>

        {/* Action Buttons: Resume, Contact Me, Credentials & Info */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            zIndex: 3,
          }}
        >
          <motion.button
            type="button"
            onClick={() => setResumeOpen(true)}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={actionButtonStyle(true)}
          >
            Resume
          </motion.button>

          <AnimatePresence mode="wait">
            {!contactOpen ? (
              <motion.button
                key="contact-btn"
                type="button"
                onClick={() => setContactOpen(true)}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={actionButtonStyle(false)}
              >
                Contact Me
              </motion.button>
            ) : (
              <motion.div
                key="contact-row"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    style={miniActionButtonStyle(avatar.accent)}
                    title={link.label}
                  >
                    <SocialIcon type={link.label} />
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => setContactOpen(false)}
                  style={{
                    ...miniActionButtonStyle(avatar.accent),
                    fontSize: 14,
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                  }}
                  title="Close contacts"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => setInfoModalOpen(true)}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...actionButtonStyle(false),
              borderColor: "rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            Credentials & Info ▾
          </motion.button>
        </div>
      </div>

      {/* ── RESUME PREVIEW MODAL ── */}
      <AnimatePresence>
        {resumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(14px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              style={{
                width: "min(1100px, 96vw)",
                height: "min(88vh, 960px)",
                background: "#0b0b0d",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 24,
                boxShadow: "0 30px 120px rgba(0,0,0,0.8)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: avatar.accent,
                      boxShadow: `0 0 10px ${avatar.accent}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Resume Preview — {avatar.name}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      border: "1px solid rgba(0,229,255,0.4)",
                      background: "rgba(0,229,255,0.12)",
                      color: "#00e5ff",
                      borderRadius: 999,
                      padding: "8px 16px",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.1em",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Open ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setResumeOpen(false)}
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "8px 18px",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.1em",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Close ✕
                  </button>
                </div>
              </div>
              <iframe
                title="Resume"
                src={resumeHref}
                style={{ width: "100%", flex: 1, border: 0, background: "#111" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CREDENTIALS & INFO MODAL ── */}
      <AnimatePresence>
        {infoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(0,0,0,0.78)",
              backdropFilter: "blur(14px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              style={{
                width: "min(900px, 94vw)",
                maxHeight: "86vh",
                background: "#080c16",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 24,
                boxShadow: "0 30px 120px rgba(0,0,0,0.85)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 800,
                      margin: 0,
                      color: "#fff",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {avatar.name} — Credentials & Overview
                  </h3>
                  <p
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: 12,
                      color: avatar.accent,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {avatar.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInfoModalOpen(false)}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "8px 18px",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.1em",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Close ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div
                style={{
                  padding: "24px",
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                  gap: 20,
                }}
              >
                {/* About */}
                <div style={modalCardStyle}>
                  <h4 style={modalCardTitle(avatar.accent)}>ABOUT</h4>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
                    {avatar.data.about}
                  </p>
                </div>

                {/* Strengths */}
                <div style={modalCardStyle}>
                  <h4 style={modalCardTitle(avatar.accent)}>CORE STRENGTHS</h4>
                  <ul style={modalListStyle}>
                    {(avatar.data.strengths || []).map((s, i) => (
                      <li key={i} style={modalListItem}>
                        <span style={{ color: avatar.accent }}>▹</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Experience Highlights */}
                <div style={modalCardStyle}>
                  <h4 style={modalCardTitle(avatar.accent)}>EXPERIENCE</h4>
                  <ul style={modalListStyle}>
                    {(avatar.data.experience || []).map((exp, i) => (
                      <li key={i} style={modalListItem}>
                        <span style={{ color: avatar.accent }}>▹</span> {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div style={modalCardStyle}>
                  <h4 style={modalCardTitle(avatar.accent)}>TECH STACK & SKILLS</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(avatar.data.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(0, 229, 255, 0.1)",
                          color: avatar.accent,
                          border: `1px solid ${avatar.accent}40`,
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div style={{ ...modalCardStyle, gridColumn: "1 / -1" }}>
                  <h4 style={modalCardTitle(avatar.accent)}>KEY ACHIEVEMENTS</h4>
                  <ul style={modalListStyle}>
                    {(avatar.data.achievements || []).map((ach, i) => (
                      <li key={i} style={modalListItem}>
                        <span style={{ color: avatar.accent }}>★</span> {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const actionButtonStyle = (primary) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: primary ? 120 : 110,
  padding: "10px 18px",
  borderRadius: 999,
  border: primary ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,229,255,0.32)",
  background: primary ? "rgba(255,255,255,0.08)" : "rgba(0,229,255,0.1)",
  color: "#fff",
  textDecoration: "none",
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  transition: "all 0.18s ease",
});

const miniActionButtonStyle = (accent) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  padding: 0,
  borderRadius: 999,
  border: `1px solid ${accent}55`,
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  textDecoration: "none",
  backdropFilter: "blur(10px)",
  transition: "all 0.18s ease",
});

const modalCardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: "18px 20px",
};

const modalCardTitle = (accent) => ({
  margin: "0 0 10px 0",
  fontSize: 11.5,
  fontWeight: 700,
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "0.16em",
  color: accent,
  textTransform: "uppercase",
});

const modalListStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const modalListItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  fontSize: 13,
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.8)",
};

function NexusConnectingPaths({ hoveredRealm }) {
  const paths = [
    {
      id: "projects",
      color: "#38bdf8",
      d: "M 430 460 C 360 460, 310 400, 260 340",
      origin: [430, 460],
    },
    {
      id: "hackathons",
      color: "#ffb347",
      d: "M 570 460 C 640 460, 690 400, 740 340",
      origin: [570, 460],
    },
    {
      id: "experience",
      color: "#9fb8d6",
      d: "M 430 520 C 360 520, 310 580, 260 640",
      origin: [430, 520],
    },
    {
      id: "research",
      color: "#a78bff",
      d: "M 570 520 C 640 520, 690 580, 740 640",
      origin: [570, 520],
    },
  ];

  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {paths.map(({ id, color, d, origin }) => {
        const isHovered = hoveredRealm === id;
        const isAnyHovered = !!hoveredRealm;
        const pathOpacity = isHovered ? 0.95 : isAnyHovered ? 0.12 : 0.32;
        const strokeWidth = isHovered ? 2 : 1.2;

        return (
          <g key={id} style={{ transition: "all 0.3s ease" }}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth="4"
              opacity={isHovered ? 0.4 : 0.09}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={pathOpacity}
              vectorEffect="non-scaling-stroke"
            />
            <circle r="2.5" fill={color} opacity={isHovered ? 0.95 : 0.45}>
              <animateMotion
                path={d}
                dur="5s"
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
            <circle cx={origin[0]} cy={origin[1]} r="2.5" fill={color} opacity={pathOpacity} />
          </g>
        );
      })}
    </svg>
  );
}

function SocialIcon({ type }) {
  const common = {
    width: 16,
    height: 16,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <path d="M6.5 9.5V18" />
        <path d="M6.5 6.75v.25" />
        <path d="M10 18v-4.8c0-1.7 1.1-3 2.8-3 1.7 0 2.7 1.1 2.7 3V18" />
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    );
  }
  if (type === "Email") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  if (type === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <path d="M9 19c-4 1.2-4-2-5-2" />
        <path d="M15 22v-3.2c0-.8.3-1.4.8-1.9-2.6-.3-5.4-1.3-5.4-6a4.7 4.7 0 0 1 1.2-3.3 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C23 2.3 24 2.6 24 2.6a4.3 4.3 0 0 1 .1 3.2 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.8 5.7-5.4 6 .5.5.8 1.1.8 1.9V22" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" style={common}>
      <path d="M22 16.9v2.7a2 2 0 0 1-2.2 2 18 18 0 0 1-7.8-2.8 17.7 17.7 0 0 1-5.4-5.4A18 18 0 0 1 3.8 5.6 2 2 0 0 1 5.8 3.4h2.7a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L10 10.4a14 14 0 0 0 3.6 3.6l.6-.6a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

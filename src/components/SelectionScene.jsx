import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useScene, AVATARS } from "../context/SceneContext";
import { AvatarCard } from "./AvatarCard";
import { DetailView } from "./DetailView";
import HackathonGallery from "./Sliding";
import { Background } from "./Background";
import { AnimatePresence, motion } from "framer-motion";

export function SelectionScene({ onOpenHackathons, onOpenProjects, onOpenResearch, onOpenExperience }) {
  const { selected, select } = useScene();
  const promptRef = useRef();
  const [scrollStep, setScrollStep] = useState(0); // 0: Heading, 1: Cards

  useEffect(() => {
    if (selected) return;

    let isLocked = false;
    let lockTimeout;

    // Small delay on mount before accepting the first scroll, just to be safe
    const mountTimeout = setTimeout(() => {
      isLocked = false;
    }, 600);
    isLocked = true;

    const handleWheel = (e) => {
      if (isLocked) return;

      if (e.deltaY > 30) {
        setScrollStep(s => {
          if (s === 0) {
            isLocked = true;
            clearTimeout(lockTimeout);
            lockTimeout = setTimeout(() => { isLocked = false; }, 250);
            return 1;
          }
          if (s >= 1) {
            // User keeps scrolling down past MEET THE DEVELOPER!
            // Directly trigger the 4 models, skipping the info card!
            isLocked = true;
            clearTimeout(lockTimeout);
            lockTimeout = setTimeout(() => { isLocked = false; }, 350);
            select("sanket", { skipInfoCard: true });
            return s;
          }
          return s;
        });
      } else if (e.deltaY < -30) {
        setScrollStep(s => {
          if (s > 0) {
            isLocked = true;
            clearTimeout(lockTimeout);
            lockTimeout = setTimeout(() => { isLocked = false; }, 250);
            return s - 1;
          }
          return s;
        });
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta > 40) {
        if (scrollStep === 0) setScrollStep(1);
        else select("sanket", { skipInfoCard: true });
      } else if (delta < -40) {
        if (scrollStep > 0) setScrollStep(s => s - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(lockTimeout);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selected, scrollStep, select]);

  useEffect(() => {
    if (!promptRef.current) return;
    if (selected) {
      gsap.to(promptRef.current, { opacity: 0, y: 10, duration: 0.3 });
    } else {
      gsap.fromTo(promptRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
      );
    }
  }, [selected]);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      background: "var(--bg)",
    }}>
      <Background />


      {/* ── 3D Nexus View: ALWAYS MOUNTED (WARM WEBGL CONTEXT & ZERO JANK) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: selected ? "auto" : "none",
          opacity: selected ? 1 : 0,
          visibility: selected ? "visible" : "hidden",
          transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s",
        }}
      >
        <DetailView
          onOpenHackathons={onOpenHackathons}
          onOpenProjects={onOpenProjects}
          onOpenResearch={onOpenResearch}
          onOpenExperience={onOpenExperience}
        />
      </div>

      {/* ── Selection View (Meet the Developer) ── */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            key="selection-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5vh",
              padding: "80px 48px 40px",
              pointerEvents: "auto",
            }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                fontFamily: "Impact, sans-serif", 
                fontSize: "6vw", 
                color: "white", 
                textTransform: "uppercase", 
                letterSpacing: "0.02em", 
                margin: 0, 
                textShadow: "0 10px 30px rgba(0,0,0,0.8)",
                lineHeight: 1
              }}
            >
              MEET THE DEVELOPER
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              animate={{ 
                opacity: scrollStep >= 1 ? 1 : 0, 
                y: scrollStep >= 1 ? 0 : 50, 
                filter: scrollStep >= 1 ? "blur(0px)" : "blur(10px)",
                pointerEvents: scrollStep >= 1 ? "auto" : "none" 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ display: "flex", gap: "clamp(16px, 3vw, 48px)" }}
            >
              {Object.values(AVATARS).map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom prompt ──────────────────────────── */}
      {!selected && (
        <div
          ref={promptRef}
          onClick={() => {
            if (scrollStep === 0) setScrollStep(1);
            else select("sanket", { skipInfoCard: true });
          }}
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            lineHeight: 1.6
          }}>
            {scrollStep === 0 ? "Scroll down to Meet Developer" : "Scroll down to unpack 3D Nexus"}
          </p>
          <ChevronDown />
        </div>
      )}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ opacity: 0.2 }}>
      <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

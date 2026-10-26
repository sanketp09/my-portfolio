import { useState, useEffect } from "react";
import { SceneProvider, useScene } from "./context/SceneContext";
import { SelectionScene } from "./components/SelectionScene";
import HackathonGallery from "./components/Sliding";
import ProjectsGallery from "./components/ProjectsGallery";
import { SectionPage } from "./components/SectionPage";
import { OrbitalRiftNavigation } from "./scene/OrbitalRiftNavigation";
import { OrbitalRiftScene } from "./scene/OrbitalRiftScene";
import { ProjectDetail } from "./components/ProjectDetail";
import ResearchGalaxy from "./components/research/ResearchGalaxy";
import ExperiencePage from "./components/experience/ExperiencePage";
import FrameAnimation from "./components/FrameAnimation";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

export default function App() {
  const isOrbitalHash = typeof window !== "undefined" && window.location.hash === "#orbital";
  const [landingComplete, setLandingComplete] = useState(isOrbitalHash);
  const [activeView, setActiveView] = useState(isOrbitalHash ? "orbital" : "selection");
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#orbital") {
        setLandingComplete(true);
        setActiveView("selection");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const onOrbital = () => {
    setActiveView("selection");
    window.location.hash = "#orbital";
  };

  return (
    <>
      {/* LANDING PAGE ANIMATION */}
      <FrameAnimation 
        onComplete={() => setLandingComplete(true)} 
        onReverse={() => {
          setLandingComplete(false);
          setActiveView("selection");
        }} 
        isComplete={landingComplete} 
      />
      
      {/* 3D PORTFOLIO WRAPPER */}
      <div 
        style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 10, 
          pointerEvents: landingComplete ? "auto" : "none", 
        }}
      >
        <AnimatePresence>
          {landingComplete && (
            <motion.div 
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={() => {
                window.dispatchEvent(new Event("resize"));
              }}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <SceneProvider>
                <ConstantNav
                  activeView={activeView}
                  onContact={() => setActiveView("selection")}
                  onProjects={() => setActiveView("projects")}
                  onHackathons={() => setActiveView("hackathons")}
                  onResearch={() => setActiveView("research")}
                  onExperience={() => setActiveView("experience")}
                  onOrbital={onOrbital}
                  onBack={() => setActiveView("selection")}
                  onGoToHero={() => {
                    setLandingComplete(false);
                    setActiveView("selection");
                  }}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {activeView === "selection" ? (
                    <motion.div
                      key="view-selection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <SelectionScene 
                        onOpenHackathons={() => setActiveView("hackathons")} 
                        onOpenProjects={() => setActiveView("projects")}
                        onOpenResearch={() => setActiveView("research")}
                        onOpenExperience={() => setActiveView("experience")}
                      />
                    </motion.div>
                  ) : activeView === "hackathons" ? (
  <motion.div
    key="view-hackathons"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
    style={{ position: "absolute", inset: 0 }}
  >
    <HackathonGallery 
      onBack={() => setActiveView("selection")} 
      onCompleteScroll={() => {}} 
    />
  </motion.div>
) : activeView === "orbital" ? (
  <motion.div
    key="view-orbital"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
    style={{ position: "absolute", inset: 0 }}
  >
    <SelectionScene 
      onOpenHackathons={() => setActiveView("hackathons")} 
      onOpenProjects={() => setActiveView("projects")}
      onOpenResearch={() => setActiveView("research")}
      onOpenExperience={() => setActiveView("experience")}
    />
  </motion.div>

                  ) : activeView === "projects" ? (
                    <motion.div
                      key="view-projects"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ProjectsGallery
                        onBack={() => setActiveView("selection")}
                      />
                    </motion.div>
                  ) : activeView === "research" ? (
                    <motion.div
                      key="view-research"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ResearchGalaxy
                        onBack={() => setActiveView("selection")}
                      />
                    </motion.div>
                  ) : activeView === "experience" ? (
                    <motion.div
                      key="view-experience"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ExperiencePage
                        onBack={() => setActiveView("selection")}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-project-detail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ProjectDetail 
                        project={selectedProject} 
                        onBack={() => setActiveView("projects")} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </SceneProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function ConstantNav({ onContact, onProjects, onHackathons, onResearch, onExperience, onOrbital, onBack, activeView, onGoToHero }) {
  const { selected, deselect, select } = useScene();

  const handleContact = () => {
    onContact();
    select("sanket", { skipInfoCard: true });
  };

  const handleOrbital = () => {
    onOrbital();
    select("sanket", { skipInfoCard: true });
  };

  const handleBack = () => {
    if (activeView !== "selection") {
      onBack();
    } else if (selected) {
      deselect();
    } else {
      if (onGoToHero) onGoToHero();
    }
  };

  const isProjects = activeView === "projects";
  const isHackathons = activeView === "hackathons";
  const isResearch = activeView === "research";
  const isExperience = activeView === "experience";
  const isOrbital = activeView === "selection" && !!selected;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        zIndex: 120,
        pointerEvents: "auto",
        background: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        onClick={handleBack}
        style={{
          position: "absolute",
          left: 24,
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.85)",
          textTransform: "uppercase",
        }}>
          Sanket Patil
        </span>
      </div>

      <NavButton label="Projects" onClick={onProjects} active={isProjects} />
      <NavButton label="Hackathons" onClick={onHackathons} active={isHackathons} />
      <NavButton label="Research" onClick={onResearch} active={isResearch} />
      <NavButton label="Experience" onClick={onExperience} active={isExperience} />
      <NavButton label="3D Nexus" onClick={handleOrbital} active={isOrbital} />
      <NavButton label="Contact" onClick={handleContact} />

      <a
        href="/resume/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 12px",
          borderRadius: 6,
          background: "rgba(0, 229, 255, 0.12)",
          border: "1px solid rgba(0, 229, 255, 0.4)",
          color: "#00e5ff",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 229, 255, 0.25)";
          e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 229, 255, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0, 229, 255, 0.12)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Resume ↗
      </a>

      <button
        type="button"
        onClick={handleBack}
        style={{
          position: "absolute",
          right: 24,
          padding: "6px 16px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.9)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }}
      >
        ← Back
      </button>
    </nav>
  );
}

function NavButton({ label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? "rgba(255,255,255,0.1)" : "transparent",
        border: active ? "1px solid rgba(255,255,255,0.22)" : "1px solid transparent",
        borderRadius: 20,
        color: active ? "#ffffff" : "rgba(255,255,255,0.6)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5,
        fontWeight: active ? 700 : 500,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: "5px 12px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = "rgba(255,255,255,0.95)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {label}
    </button>
  );
}


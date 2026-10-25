import { createContext, useContext, useState, useCallback, useEffect } from "react";

export const SceneContext = createContext(null);

export const AVATARS = {
  sanket: {
    id: "sanket",
    photo: "/photos/sanket patil.png",
    name: "Sanket Patil",
    title: "Software Developer",
    side: "center",
    accent: "#00e5ff",
    accentDim: "rgba(0,229,255,0.12)",
    data: {
      about:        "B.E. IT student focused on full-stack development, AI/ML, and automation-driven applications.",
      strengths:    ["Full-Stack Development", "AI/ML Integration", "Automation Workflows", "Team Leadership"],
      weaknesses:   [""],
      projects:     [
        {
          id: "kisaan-vaani",
          title: "Kisaan Vaani",
          tagline: "Voice-First Hindi AI Assistant for Farmers",
          subtitle: "AgriTech • AI • Speech Recognition",
          year: "2025",
          badge: "🏆 1st Place",
          bgColor: "#38bdf8",
          cardText: "#041426",
          accentRGB: "56, 189, 248",
          desc: "Empowering rural farmers with voice-driven Hindi conversational AI, crop yield forecasting, and government subsidies.",
          tech: ["Python", "NLP", "Whisper AI", "FastAPI", "React"],
          buttons: [
            { label: "Live Demo", url: "https://github.com/sanketp09" },
            { label: "Source Code", url: "https://github.com/sanketp09" },
          ],
          whatItDoes: "An end-to-end conversational AI platform built in Hindi that allows farmers to speak naturally, ask questions about weather, crop diseases, and fertilizer requirements, and receive real-time voice and visual guidance.",
          howItWorks: [
            "Voice input processed via Hindi Speech-to-Text model",
            "NLP engine queries real-time agricultural knowledge base",
            "Yield prediction ML model computes forecasts",
            "Instant voice output synthesized and spoken back to farmer"
          ],
          keyFeatures: [
            "Hindi speech recognition tailored for regional accents",
            "Machine learning crop disease diagnostic tool",
            "Automated government scheme eligibility finder",
            "Offline cached mode for low-connectivity rural belts"
          ]
        },
        {
          id: "3d-portfolio",
          title: "Portfolio 3D Engine",
          tagline: "Cinematic WebGL & Three.js Interactive Experience",
          subtitle: "Creative Dev • Three.js • GSAP",
          year: "2025",
          badge: "Featured",
          bgColor: "#00e5ff",
          cardText: "#031720",
          accentRGB: "0, 229, 255",
          desc: "Interactive 3D portfolio featuring seamless camera animations, double helix procedural shaders, and 4 realm gateways.",
          tech: ["React Three Fiber", "Three.js", "GSAP", "Framer Motion"],
          buttons: [
            { label: "GitHub", url: "https://github.com/sanketp09" },
          ],
          whatItDoes: "A next-generation interactive web portfolio that pushes browser graphics boundaries with real-time procedural geometry, floating realm dais platforms, and responsive 3D transitions.",
          howItWorks: [
            "GPU-accelerated procedural geometry instancing",
            "Continuous scroll physics driving camera and platform transitions",
            "Bento-box reactive interface synced with 3D scene state",
            "60 FPS WebGL rendering with smart viewport occlusion culling"
          ],
          keyFeatures: [
            "Seamless single-page 3D scroll progression",
            "Dynamic floating dais platforms with frosted glass aesthetics",
            "Interactive audio-visual feedback and hover lighting",
            "Zero layout shift responsive design across all viewports"
          ]
        },
        {
          id: "palcoa-automation",
          title: "Palcoa Workflow Automation",
          tagline: "Enterprise Process Automation & AI Pipelines",
          subtitle: "Software Intern • Palcoa Solutions",
          year: "2025",
          badge: "Internship",
          bgColor: "#34d399",
          cardText: "#022114",
          accentRGB: "52, 211, 153",
          desc: "Designed and deployed automated business logic workflows, webhook pipelines, and internal tools connecting CRM to AI analytics.",
          tech: ["Node.js", "n8n", "Python", "Docker", "REST APIs"],
          buttons: [
            { label: "Documentation", url: "https://github.com/sanketp09" },
          ],
          whatItDoes: "Automated manual enterprise workflows, reducing data turnaround time by 75% through webhook triggers, n8n orchestrations, and automated document generation.",
          howItWorks: [
            "Ingestion webhooks capture client data across channels",
            "n8n workflows validate, cleanse, and structure payloads",
            "AI agents analyze documents and extract structured metadata",
            "Automated notifications and ERP sync completed in real time"
          ],
          keyFeatures: [
            "Resilient error-handling with retry queues and alert webhooks",
            "Custom n8n nodes for proprietary business services",
            "End-to-end data encryption and compliance logging",
            "Scalable microservice deployment via Docker containers"
          ]
        },
        {
          id: "zemo-sports",
          title: "Zemo Sports Analytics",
          tagline: "High-Throughput Athlete Telemetry & Performance Tracking",
          subtitle: "Software Intern • Zemo Sports Reconnect",
          year: "2025",
          badge: "Internship",
          bgColor: "#fbbf24",
          cardText: "#221701",
          accentRGB: "251, 191, 36",
          desc: "Built scalable telemetry backend and interactive mobile frontend for real-time sports biometric and performance metrics.",
          tech: ["Flutter", "MERN Stack", "WebSockets", "MongoDB"],
          buttons: [
            { label: "GitHub", url: "https://github.com/sanketp09" },
          ],
          whatItDoes: "A sports performance tracking ecosystem delivering real-time telemetry, session replay, and biomechanical analytics for competitive athletes and coaches.",
          howItWorks: [
            "Wearable sensors stream metrics via low-latency WebSockets",
            "Backend pipeline computes instant running load and fatigue index",
            "Time-series database stores session data for longitudinal study",
            "Cross-platform Flutter app displays interactive live dashboards"
          ],
          keyFeatures: [
            "Sub-50ms WebSocket telemetry streaming engine",
            "Interactive performance visualization graphs and radar charts",
            "Automated injury risk indicators based on historical exertion",
            "Offline recording with automatic background sync when reconnected"
          ]
        }
      ],
      experience:   ["Software Intern — Palcoa Solutions (Dec 2024–Apr 2025)", "Software Intern — Zemo Sports Reconnect (May 2025–Aug 2025)"],
      achievements: ["Winner — Nexothon 2025 (GCET Gujarat)", "2nd Place — HackCelestial 2.0", "4th Place — Craftverse 2025", "Finalist — HackOrbit 2025"],
      education:    ["B.E. Information Technology — VESIT, Mumbai", "HSC (Science) — K.J. Somaiya College", "SSC — Vani Vidyalaya"],
      skills:       ["Python", "Java", "JavaScript", "MERN Stack", "Flutter", "Machine Learning", "OpenCV", "n8n"],
    },
  },
};

export function SceneProvider({ children }) {
  const isOrbitalHash = typeof window !== "undefined" && window.location.hash === "#orbital";
  const [selected, setSelected] = useState(isOrbitalHash ? "sanket" : null);
  const [skipInfoCard, setSkipInfoCard] = useState(isOrbitalHash);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#orbital") {
        setSelected("sanket");
        setSkipInfoCard(true);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const select = useCallback((id, opts = {}) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSkipInfoCard(Boolean(opts?.skipInfoCard));
    setSelected(id);
    setTimeout(() => setIsAnimating(false), 900);
  }, [isAnimating]);

  const deselect = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelected(null);
    setSkipInfoCard(false);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  return (
    <SceneContext.Provider value={{ selected, isAnimating, select, deselect, skipInfoCard, setSkipInfoCard }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  return useContext(SceneContext);
}

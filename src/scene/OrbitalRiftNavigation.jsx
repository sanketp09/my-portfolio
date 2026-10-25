import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const NAV_IDS = ["hackathons", "projects", "experience", "research"];

/** Visible copy + accent colours. Override per id with the `content` prop. */
export const DEFAULT_CONTENT = {
  projects: {
    label: "Projects",
    caption: "Construct",
    realm: "CONSTRUCT",
    category: "Software & Systems",
    description: "Explore my software projects and engineering work.",
    actionLabel: "EXPLORE REALM",
    color: "#4cc9ff",
  },
  hackathons: {
    label: "Hackathons",
    caption: "Event Horizon",
    realm: "EVENT HORIZON",
    category: "Competitions & Events",
    description: "Explore my hackathons, competitions, and events.",
    actionLabel: "EXPLORE REALM",
    color: "#ffb347",
  },
  experience: {
    label: "Experience",
    caption: "Chronosphere",
    realm: "CHRONOSPHERE",
    category: "Professional Experience",
    description: "Explore my professional and practical experience.",
    actionLabel: "EXPLORE REALM",
    color: "#9fb8d6",
  },
  research: {
    label: "Research",
    caption: "Knowledge Gate",
    realm: "KNOWLEDGE GATE",
    category: "Investigations & Papers",
    description: "Explore my research and technical investigations.",
    actionLabel: "EXPLORE REALM",
    color: "#a78bff",
  },
};

const LEAVE_MS = 450; // overlay fade-out after navigation
const MIN_CONFIRM_GAP_MS = 250; // ignore a "second tap" that arrives too fast
const NOTICE_MS = 3500;

/* ------------------------------ small helpers ---------------------------- */

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const nowMs = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return "255,255,255";
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function usePrefersReducedMotion(override) {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPref(mq.matches);
    const onChange = (e) => setPref(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return typeof override === "boolean" ? override : pref;
}

/** A destination may be a string (= sectionId) or an object. null/undefined = not configured. */
function normalizeDestination(id, raw) {
  if (!raw) return null;
  const d = typeof raw === "string" ? { sectionId: raw } : raw;
  if (d.enabled === false) return null;
  return { ...d, id };
}

/* ================================ the hook =============================== */

/**
 * @param {object} opts see <OrbitalRiftNavigation> props (same names)
 */
export function useOrbitalRiftNavigation(opts = {}) {
  const {
    destinations,
    onNavigate,
    onSelect,
    onSelectionChange,
    onMissingDestination,
    reducedMotion,
    transitionMs = 950,
    armedTimeoutMs = 6000,
    touchConfirm = "auto",
    focusTarget = true,
    content,
  } = opts;

  const reduced = usePrefersReducedMotion(reducedMotion);
  const rootRef = useRef(null);

  const [nav, setNavState] = useState({ phase: "idle", id: null, origin: null });
  const navRef = useRef(nav);
  const [hoveredId, setHoveredId] = useState(null);
  const hoverRef = useRef(null);
  const [notice, setNotice] = useState(null); // { id, text }
  const [announcement, setAnnouncement] = useState("");

  const timers = useRef({ stage: null, armed: null, leave: null, notice: null });
  const committed = useRef(false); // true once navigation has been performed
  const armedAt = useRef(0);
  const coarse = useRef(false);
  const lastNotified = useRef(null);
  const warned = useRef({});

  // Latest props, readable from stable callbacks.
  const cfg = useRef({});
  cfg.current = {
    destinations,
    onNavigate,
    onSelect,
    onSelectionChange,
    onMissingDestination,
    reduced,
    transitionMs,
    armedTimeoutMs,
    touchConfirm,
    focusTarget,
    content,
  };

  const meta = (id) => ({
    ...DEFAULT_CONTENT[id],
    ...((cfg.current.content && cfg.current.content[id]) || {}),
  });
  const resolve = (id) =>
    normalizeDestination(id, cfg.current.destinations && cfg.current.destinations[id]);

  const setNav = (next) => {
    navRef.current = next;
    setNavState(next);
  };
  const announce = (text) => setAnnouncement(text);

  const clearTimers = () => {
    const t = timers.current;
    ["stage", "armed", "leave"].forEach((k) => {
      if (t[k]) {
        clearTimeout(t[k]);
        t[k] = null;
      }
    });
  };

  const notifySelect = (id) => {
    if (lastNotified.current === id) return;
    lastNotified.current = id;
    if (cfg.current.onSelect) cfg.current.onSelect(id);
    if (cfg.current.onSelectionChange) cfg.current.onSelectionChange(id);
  };

  const reset = () => {
    clearTimers();
    committed.current = false;
    setNav({ phase: "idle", id: null, origin: null });
    if (lastNotified.current !== null) {
      lastNotified.current = null;
      if (cfg.current.onSelectionChange) cfg.current.onSelectionChange(null);
    }
  };

  const showNotice = (id, text) => {
    if (timers.current.notice) clearTimeout(timers.current.notice);
    setNotice({ id, text });
    announce(text);
    timers.current.notice = setTimeout(() => {
      timers.current.notice = null;
      setNotice(null);
    }, NOTICE_MS);
  };

  const unavailable = (id, reason) => {
    const c = cfg.current;
    if (!warned.current[id] && typeof console !== "undefined") {
      warned.current[id] = true;
      console.warn(
        `[OrbitalRiftNavigation] "${id}" cannot be opened (${reason}). ` +
          "Configure `destinations` for this id (see README)."
      );
    }
    if (c.onMissingDestination) c.onMissingDestination(id, resolve(id), reason);
    if (navRef.current.phase !== "idle") reset();
    showNotice(id, `${meta(id).label} isn’t available yet.`);
  };

  /** Performs the real navigation. Returns false if the target no longer exists. */
  const performNavigation = (id) => {
    const c = cfg.current;
    const dest = resolve(id);
    if (!dest) return false;

    if (c.onNavigate) {
      c.onNavigate(dest);
      return true;
    }
    if (dest.sectionId) {
      const el = document.getElementById(dest.sectionId);
      if (!el) return false;
      el.scrollIntoView({ behavior: c.reduced ? "auto" : "smooth", block: "start" });
      if (c.focusTarget) {
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
      return true;
    }
    if (dest.href) {
      window.location.assign(dest.href);
      return true;
    }
    return false;
  };

  const finish = (id) => {
    timers.current.stage = null;
    committed.current = true; // from here on, Escape can no longer cancel
    const ok = performNavigation(id);
    if (!ok) {
      committed.current = false;
      unavailable(id, "target missing at navigation time");
      return;
    }
    setNav({ phase: "leaving", id, origin: navRef.current.origin });
    timers.current.leave = setTimeout(
      () => {
        timers.current.leave = null;
        committed.current = false;
        reset();
      },
      cfg.current.reduced ? 0 : LEAVE_MS
    );
  };

  const commit = (id) => {
    const c = cfg.current;
    const dest = resolve(id);
    if (!dest) {
      unavailable(id, "no destination configured");
      return;
    }
    // Preflight so the cinematic never plays for a missing target.
    if (!c.onNavigate) {
      const hasTarget = dest.sectionId ? !!document.getElementById(dest.sectionId) : !!dest.href;
      if (!hasTarget) {
        unavailable(id, dest.sectionId ? `no element with id "${dest.sectionId}"` : "no sectionId/href");
        return;
      }
    }

    clearTimers();
    committed.current = false;
    if (timers.current.notice) {
      clearTimeout(timers.current.notice);
      timers.current.notice = null;
    }
    setNotice(null);

    const rect = rootRef.current ? rootRef.current.getBoundingClientRect() : null;
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    setNav({ phase: "transitioning", id, origin });
    notifySelect(id);
    announce(`Opening ${meta(id).label}.`);
    timers.current.stage = setTimeout(() => finish(id), c.reduced ? 0 : c.transitionMs);
  };

  const arm = (id) => {
    clearTimers();
    committed.current = false;
    armedAt.current = nowMs();
    setNotice(null);
    setNav({ phase: "armed", id, origin: null });
    notifySelect(id);
    announce(`${meta(id).label} selected. Tap it again, or press Open, to continue.`);
    timers.current.armed = setTimeout(() => {
      timers.current.armed = null;
      reset();
    }, cfg.current.armedTimeoutMs);
  };

  const begin = (id, info = {}) => {
    if (!NAV_IDS.includes(id)) return;
    const phase = navRef.current.phase;
    if (phase === "transitioning" || phase === "leaving") return; // duplicate guard

    const c = cfg.current;
    const pt = info.pointerType;
    const touchLike = pt === "touch" || pt === "pen" || (!pt && coarse.current);
    const needsConfirm =
      info.source === "canvas" &&
      (c.touchConfirm === "always" || (c.touchConfirm === "auto" && touchLike));

    if (needsConfirm) {
      if (phase === "armed" && navRef.current.id === id) {
        if (nowMs() - armedAt.current < MIN_CONFIRM_GAP_MS) return;
        commit(id);
      } else {
        arm(id);
      }
      return;
    }
    commit(id);
  };

  const cancel = () => {
    const { phase } = navRef.current;
    if (phase === "idle" || phase === "leaving" || committed.current) return;
    reset();
    announce("Selection cancelled.");
  };

  const hover = (id, onlyIfId) => {
    if (id === null && onlyIfId && hoverRef.current !== onlyIfId) return;
    if (hoverRef.current === id) return;
    hoverRef.current = id;
    setHoveredId(id);
  };

  // Stable wrappers (always call the latest closure).
  const api = useRef({});
  api.current = { begin, commit, cancel, hover };
  const onSceneSelect = useCallback((id, info) => api.current.begin(id, info), []);
  const activate = useCallback((id) => api.current.begin(id, { source: "html" }), []);
  const confirm = useCallback((id) => api.current.commit(id), []);
  const cancelSelection = useCallback(() => api.current.cancel(), []);
  const setHover = useCallback((id, only) => api.current.hover(id, only), []);

  /* ----- effects: coarse pointer, Escape, cleanup (all with cleanup) ----- */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(pointer: coarse)");
    coarse.current = mq.matches;
    const onChange = (e) => {
      coarse.current = e.matches;
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const active = nav.phase === "armed" || nav.phase === "transitioning";
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") cancelSelection();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, cancelSelection]);

  useEffect(
    () => () => {
      const t = timers.current;
      Object.keys(t).forEach((k) => {
        if (t[k]) clearTimeout(t[k]);
      });
    },
    []
  );

  /* ------------------------------- derived ------------------------------- */
  const selectedId = nav.phase === "idle" ? null : nav.id;
  const emphasisId = selectedId || hoveredId;
  const approachId = nav.phase === "transitioning" || nav.phase === "leaving" ? nav.id : null;

  const sceneProps = useMemo(
    () => ({
      selectedId,
      onSelect: onSceneSelect,
      onHoverChange: setHover,
      emphasisId,
      approachId,
      reducedMotion: reduced,
      showControls: false,
    }),
    [selectedId, emphasisId, approachId, reduced, onSceneSelect, setHover]
  );

  const items = NAV_IDS.map((id) => ({
    id,
    ...meta(id),
    configured: !!resolve(id),
  }));

  return {
    rootRef,
    phase: nav.phase,
    origin: nav.origin,
    selectedId,
    hoveredId,
    emphasisId,
    approachId,
    notice,
    announcement,
    items,
    reduced,
    activate,
    confirm,
    cancel: cancelSelection,
    setHover,
    sceneProps,
  };
}

/* ============================ portal overlay ============================= */

/**
 * Lightweight DOM/CSS transition. Rendered into document.body through a React
 * portal so transformed/pinned ancestors (e.g. GSAP pins) cannot break
 * `position: fixed`. Not rendered at all for reduced motion.
 */
export function OrbitalRiftPortalOverlay({ phase, color, origin, durationMs }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || (phase !== "transitioning" && phase !== "leaving")) return null;
  const o = origin || { x: 0, y: 0 };
  return createPortal(
    <div
      className="orn-portal"
      data-phase={phase}
      aria-hidden="true"
      style={{
        "--orn-c": color,
        "--orn-rgb": hexToRgb(color),
        "--orn-x": `${o.x}px`,
        "--orn-y": `${o.y}px`,
        "--orn-ms": `${durationMs}ms`,
      }}
    >
      <div className="orn-wash" />
      <div className="orn-ring" />
      <div className="orn-ring orn-ring-2" />
    </div>,
    document.body
  );
}

/* ================================= styles ================================ */

const STYLES = `
.orn-root{position:relative;width:100%;height:100%;font-family:inherit;color:#dbe7ff}
.orn-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

.orn-nexus-header{position:absolute;top:max(78px,calc(env(safe-area-inset-top) + 68px));left:0;right:0;display:flex;flex-direction:column;align-items:center;pointer-events:none;z-index:15;user-select:none;text-align:center;transition:opacity .3s ease}
.orn-nexus-title{font-size:12px;font-weight:700;letter-spacing:0.38em;color:rgba(255,255,255,0.92);text-transform:uppercase;font-family:monospace;text-shadow:0 0 16px rgba(56,189,248,0.55)}
.orn-nexus-sub{font-size:10px;letter-spacing:0.18em;color:rgba(255,255,255,0.45);margin-top:4px;font-family:system-ui,sans-serif}

.orn-prompt{display:flex;align-items:center;gap:8px;padding:6px 16px;border-radius:9999px;background:rgba(6,11,24,0.65);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.45);font-family:monospace;font-size:10px;letter-spacing:0.24em;text-transform:uppercase;user-select:none;animation:orn-pulse 3s ease-in-out infinite;pointer-events:none}
.orn-prompt-dot{width:4px;height:4px;border-radius:50%;background:#38bdf8;box-shadow:0 0 8px #38bdf8}
@keyframes orn-pulse{0%,100%{opacity:.45}50%{opacity:.8}}
.orn-dock{position:absolute;left:0;right:0;bottom:max(16px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 12px;pointer-events:none;z-index:20}
.orn-card{pointer-events:auto;width:min(90vw,360px);box-sizing:border-box;padding:14px 18px;border-radius:14px;border:1px solid var(--orn-c);background:rgba(6,12,26,0.94);box-shadow:0 16px 40px rgba(0,0,0,0.85),0 0 24px rgba(var(--orn-rgb),0.25);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);animation:orn-card-in .2s ease-out}
.orn-card-head{display:flex;align-items:center;gap:12px}
.orn-card-realm{font-weight:700;font-size:1.05rem;letter-spacing:0.06em;color:#ffffff;text-transform:uppercase;line-height:1.2}
.orn-card-category{font-size:0.75rem;color:var(--orn-c);font-family:monospace;letter-spacing:0.06em;line-height:1.3;margin-top:2px}
.orn-card-desc{margin:10px 0 12px;font-size:0.84rem;line-height:1.45;color:rgba(255,255,255,0.82)}
.orn-card-actions{display:flex;gap:10px;margin-top:4px}
.orn-act{flex:1;min-height:38px;border-radius:8px;border:1px solid rgba(150,185,255,.3);background:rgba(14,24,50,.85);color:inherit;font:inherit;font-size:0.82rem;cursor:pointer;transition:all .18s ease}
.orn-act-primary{border-color:var(--orn-c);background:var(--orn-c);color:#050914;font-weight:700;letter-spacing:0.04em;box-shadow:0 0 15px rgba(var(--orn-rgb),0.4)}
.orn-act-primary:hover{filter:brightness(1.15);box-shadow:0 0 22px rgba(var(--orn-rgb),0.6)}
.orn-act:focus-visible,.orn-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
.orn-list{pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:5px;padding:4px 8px;border-radius:9999px;background:rgba(6,11,24,0.6);border:1px solid rgba(255,255,255,0.08);box-shadow:0 6px 24px rgba(0,0,0,0.5);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:.85;transition:opacity .25s ease,background .25s ease}
.orn-list:hover,.orn-list:focus-within{opacity:1;background:rgba(6,11,24,0.9)}
.orn-btn{display:flex;align-items:center;gap:6px;min-height:28px;padding:4px 12px;border-radius:9999px;border:1px solid transparent;background:transparent;color:rgba(255,255,255,0.7);font:inherit;font-size:.76rem;text-align:left;cursor:pointer;transition:all .2s ease}
.orn-btn:hover,.orn-btn[data-hot="true"]{background:rgba(255,255,255,0.08);border-color:var(--orn-c);color:#fff;box-shadow:0 0 12px rgba(var(--orn-rgb),.28)}
.orn-btn[aria-current="true"]{border-color:var(--orn-c);box-shadow:inset 0 0 0 1px var(--orn-c)}
.orn-btn[aria-disabled="true"]{opacity:.5}
.orn-dot{flex:none;width:6px;height:6px;border-radius:50%;background:var(--orn-c);box-shadow:0 0 8px var(--orn-c)}
.orn-label{display:inline-block;font-weight:600;font-size:.76rem;letter-spacing:.04em;line-height:1}
.orn-cap{display:inline-block;font-size:.66rem;opacity:.55;line-height:1;margin-left:2px;font-family:monospace}
@keyframes orn-card-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.orn-portal{position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden}
.orn-wash{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at var(--orn-x) var(--orn-y),rgba(var(--orn-rgb),.55),rgba(var(--orn-rgb),.12) 35%,rgba(5,9,20,.7) 90%)}
.orn-ring{position:absolute;left:var(--orn-x);top:var(--orn-y);width:40vmin;height:40vmin;margin:-20vmin 0 0 -20vmin;border-radius:50%;border:2px solid var(--orn-c);box-shadow:0 0 40px rgba(var(--orn-rgb),.6),inset 0 0 40px rgba(var(--orn-rgb),.35);opacity:0}
.orn-portal[data-phase="transitioning"] .orn-wash{animation:orn-wash-in var(--orn-ms) cubic-bezier(.5,0,.8,.6) forwards}
.orn-portal[data-phase="transitioning"] .orn-ring{animation:orn-ring var(--orn-ms) ease-out forwards}
.orn-portal[data-phase="transitioning"] .orn-ring-2{animation-delay:calc(var(--orn-ms) * .18)}
.orn-portal[data-phase="leaving"] .orn-wash{opacity:.9;animation:orn-wash-out ${LEAVE_MS}ms ease-out forwards}
@keyframes orn-wash-in{from{opacity:0}to{opacity:.9}}
@keyframes orn-wash-out{from{opacity:.9}to{opacity:0}}
@keyframes orn-ring{0%{transform:scale(.15);opacity:0}15%{opacity:.9}100%{transform:scale(3.2);opacity:0}}

.orn-identity-card{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;text-align:center;padding:16px 20px 18px;border-radius:20px;background:rgba(28,28,32,0.85);border:1px solid rgba(255,255,255,0.12);box-shadow:0 24px 60px rgba(0,0,0,0.7),0 0 30px rgba(0,229,255,0.08);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);pointer-events:auto;z-index:12;transition:all .35s cubic-bezier(.16,1,.3,1);width:min(280px,74vw);user-select:none}
.orn-identity-card.is-receded{opacity:0.35!important;transform:translate(-50%,-50%) scale(0.92);pointer-events:none}
.orn-identity-card:hover{border-color:rgba(0,229,255,0.4);box-shadow:0 28px 70px rgba(0,0,0,0.75),0 0 40px rgba(0,229,255,0.16)}
.orn-portrait-frame{position:relative;width:min(180px,48vw);aspect-ratio:1;border-radius:14px;overflow:hidden;background:#121214;box-shadow:0 10px 25px rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.1)}
.orn-portrait-img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.orn-identity-name{margin:14px 0 3px;font-size:1.25rem;font-weight:700;color:#ffffff;letter-spacing:.02em}
.orn-identity-title{margin:0 0 10px;font-size:.78rem;color:#00e5ff;font-family:monospace;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
.orn-profile-toggle{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);font-size:11px;font-family:monospace;letter-spacing:.06em;cursor:pointer;transition:all .2s ease}
.orn-profile-toggle:hover{background:rgba(255,255,255,0.14);border-color:#00e5ff;color:#fff}

.orn-panels-drawer{position:absolute;inset:0;z-index:25;pointer-events:none;display:flex;justify-content:space-between;padding:85px 4vw 70px;opacity:0;visibility:hidden;transition:all .35s ease}
.orn-panels-drawer.is-open{opacity:1;visibility:visible;pointer-events:auto}
.orn-drawer-col{width:min(320px,28vw);display:flex;flex-direction:column;gap:12px;overflow-y:auto;max-height:80vh}
.orn-drawer-card{padding:14px 16px;border-radius:14px;background:rgba(24,24,28,0.92);border:1px solid rgba(255,255,255,0.12);box-shadow:0 16px 40px rgba(0,0,0,0.7);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}
.orn-drawer-title{margin:0 0 8px;font-size:13px;font-weight:700;color:#00e5ff;letter-spacing:.06em;text-transform:uppercase}
.orn-drawer-item{margin-bottom:8px;font-size:12px;line-height:1.4}
.orn-drawer-item:last-child{margin-bottom:0}
.orn-drawer-item-title{font-weight:600;color:#fff}
.orn-drawer-item-sub{color:rgba(255,255,255,0.55);font-size:11px}

@media (max-width:640px){
  .orn-identity-card{width:min(230px,70vw);padding:12px 16px 14px}
  .orn-portrait-frame{width:min(140px,42vw)}
  .orn-identity-name{font-size:1.05rem;margin:10px 0 2px}
  .orn-identity-title{font-size:.72rem;margin-bottom:8px}
  .orn-list{display:flex;flex-wrap:wrap;border-radius:18px;padding:6px;gap:4px}
  .orn-btn{padding:5px 9px;min-height:28px}
  .orn-cap{display:none}
  .orn-panels-drawer{flex-direction:column;gap:12px;overflow-y:auto;padding:80px 14px 70px}
  .orn-drawer-col{width:100%;max-height:none}
}
@media (prefers-reduced-motion:reduce){.orn-list{transition:none}.orn-card{animation:none}}
`;

/* ============================ public component =========================== */

/**
 * @param {object}   props
 * @param {(sceneProps: object) => React.ReactNode} props.children
 *        Render prop. Spread `sceneProps` onto <OrbitalRiftScene />.
 * @param {Partial<Record<"hackathons"|"projects"|"experience"|"research",
 *          string | { sectionId?: string, href?: string, enabled?: boolean, [k: string]: any } | null>>} [props.destinations]
 *        string = sectionId shorthand. Missing/null/enabled:false = "not available yet".
 * @param {(destination: { id: string, sectionId?: string, href?: string, [k: string]: any }) => void} [props.onNavigate]
 *        If given, it performs navigation (router push, etc.) after the transition. Default navigation is skipped.
 * @param {(id: string) => void} [props.onSelect]               Fired when an object becomes selected.
 * @param {(id: string | null) => void} [props.onSelectionChange] Fired on select and on clear.
 * @param {(id: string, destination: object | null, reason: string) => void} [props.onMissingDestination]
 * @param {number}   [props.progress]       Optional 0..1; only used to fade the link list in with the objects.
 * @param {boolean}  [props.reducedMotion]  Override; auto-detected if omitted.
 * @param {object}   [props.content]        Per-id overrides of { label, caption, description, color }.
 * @param {number}   [props.transitionMs=950]
 * @param {number}   [props.armedTimeoutMs=6000]  Auto-disarm of a pending first tap.
 * @param {"auto"|"always"|"never"} [props.touchConfirm="auto"]  Two-tap behaviour for canvas taps.
 * @param {boolean}  [props.focusTarget=true]  Focus the target section after default navigation.
 * @param {string}   [props.ariaLabel="Portfolio sections"]
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 * @param {string}   [props.avatarSrc="/photos/sanket patil.png"]
 * @param {string}   [props.name="Sanket Patil"]
 * @param {string}   [props.title="Software Developer"]
 */
export function OrbitalRiftNavigation({
  children,
  destinations,
  onNavigate,
  onSelect,
  onSelectionChange,
  onMissingDestination,
  progress,
  reducedMotion,
  content,
  transitionMs = 950,
  armedTimeoutMs = 6000,
  touchConfirm = "auto",
  focusTarget = true,
  ariaLabel = "Portfolio sections",
  className,
  style,
  avatarSrc = "/photos/sanket patil.png",
  name = "Sanket Patil",
  title = "Software Developer",
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nav = useOrbitalRiftNavigation({
    destinations,
    onNavigate,
    onSelect,
    onSelectionChange,
    onMissingDestination,
    reducedMotion,
    transitionMs,
    armedTimeoutMs,
    touchConfirm,
    focusTarget,
    content,
  });

  const byId = (id) => nav.items.find((i) => i.id === id);
  const cardId = nav.notice ? nav.notice.id : nav.emphasisId;
  const card = cardId ? byId(cardId) : null;
  const armed = nav.phase === "armed" && card && nav.selectedId === card.id;

  const reveal = typeof progress === "number" ? smoothstep(0.3, 0.65, progress) : 1;
  const overlayItem = nav.selectedId ? byId(nav.selectedId) : null;

  return (
    <div
      ref={nav.rootRef}
      className={`orn-root${className ? ` ${className}` : ""}`}
      style={style}
    >
      <style>{STYLES}</style>

      {typeof children === "function" ? children(nav.sceneProps) : children}

      {/* Nexus Header */}
      <div className="orn-nexus-header" aria-hidden="true" style={{ opacity: reveal }}>
        <div className="orn-nexus-title">THE NEXUS</div>
        <div className="orn-nexus-sub">Four realms. One journey.</div>
      </div>

      {/* Central Developer Identity Card (Prominent, matching Meet the Developer / first screenshot) */}
      <div
        className={`orn-identity-card${card ? " is-receded" : ""}`}
        style={{ opacity: reveal }}
      >
        <div className="orn-portrait-frame">
          <img
            src={avatarSrc}
            alt={`Portrait of ${name}`}
            className="orn-portrait-img"
            draggable={false}
          />
        </div>
        <h2 className="orn-identity-name">{name}</h2>
        <p className="orn-identity-title">{title}</p>
        <button
          type="button"
          className="orn-profile-toggle"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-expanded={drawerOpen}
        >
          <span>{drawerOpen ? "Close Profile" : "Credentials & Info"}</span>
          <span style={{ fontSize: "9px" }}>{drawerOpen ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Side Credentials & Information Drawer (Education, Experience, Skills, Achievements) */}
      <div className={`orn-panels-drawer${drawerOpen ? " is-open" : ""}`}>
        {/* Left column: Education & Experience */}
        <div className="orn-drawer-col">
          <div className="orn-drawer-card">
            <h3 className="orn-drawer-title">Education</h3>
            <div className="orn-drawer-item">
              <div className="orn-drawer-item-title">B.E. Information Technology</div>
              <div className="orn-drawer-item-sub">VESIT, Mumbai // 2021–2025</div>
            </div>
            <div className="orn-drawer-item">
              <div className="orn-drawer-item-title">HSC (Science)</div>
              <div className="orn-drawer-item-sub">K.J. Somaiya College // 2019–2021</div>
            </div>
          </div>
          <div className="orn-drawer-card">
            <h3 className="orn-drawer-title">Experience</h3>
            <div className="orn-drawer-item">
              <div className="orn-drawer-item-title">Software Intern — Palcoa Solutions</div>
              <div className="orn-drawer-item-sub">Dec 2024–Apr 2025 // Full-stack development & automation workflows</div>
            </div>
            <div className="orn-drawer-item">
              <div className="orn-drawer-item-title">Software Intern — Zemo Sports Reconnect</div>
              <div className="orn-drawer-item-sub">May 2025–Aug 2025 // Sports analytics & API development</div>
            </div>
          </div>
        </div>

        {/* Right column: Skills & Achievements */}
        <div className="orn-drawer-col">
          <div className="orn-drawer-card">
            <h3 className="orn-drawer-title">Core Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["Python", "Java", "JavaScript", "MERN Stack", "Flutter", "Machine Learning", "OpenCV", "n8n", "Docker"].map((sk) => (
                <span
                  key={sk}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#dbe7ff",
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
          <div className="orn-drawer-card">
            <h3 className="orn-drawer-title">Achievements</h3>
            <div className="orn-drawer-item">
              <div className="orn-drawer-item-title">Winner — Nexothon 2025</div>
              <div className="orn-drawer-item-sub">GCET Gujarat Championship</div>
            </div>
            <div className="orn-drawer-item">
              <div className="orn-drawer-item-title">2nd Place — HackCelestial 2.0</div>
              <div className="orn-drawer-item-sub">National Level Hackathon</div>
            </div>
          </div>
        </div>
      </div>

      <div className="orn-dock">
        {!card && !nav.selectedId && (
          <div className="orn-prompt" aria-hidden="true">
            <span className="orn-prompt-dot" />
            <span>SELECT A REALM TO ENTER</span>
          </div>
        )}
        {card && (
          <div
            className="orn-card"
            style={{
              "--orn-c": card.color,
              "--orn-rgb": hexToRgb(card.color),
            }}
          >
            <div className="orn-card-head">
              <span className="orn-dot" style={{ "--orn-c": card.color }} aria-hidden="true" />
              <div style={{ flex: 1 }}>
                <div className="orn-card-realm">{card.realm || card.caption}</div>
                <div className="orn-card-category">{card.label} &bull; {card.category}</div>
              </div>
            </div>
            <p className="orn-card-desc">
              {nav.notice ? nav.notice.text : card.description}
            </p>
            <div className="orn-card-actions">
              <button
                type="button"
                className="orn-act orn-act-primary"
                onClick={() => {
                  if (armed) nav.confirm(card.id);
                  else nav.activate(card.id);
                }}
              >
                EXPLORE REALM &rarr;
              </button>
              {armed && (
                <button type="button" className="orn-act" onClick={nav.cancel}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        <nav
          className="orn-list"
          aria-label={ariaLabel}
          style={{
            opacity: reveal,
            pointerEvents: reveal > 0.05 ? "auto" : "none",
          }}
        >
          {nav.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="orn-btn"
              style={{ "--orn-c": item.color }}
              data-hot={nav.emphasisId === item.id ? "true" : undefined}
              aria-current={nav.selectedId === item.id ? "true" : undefined}
              aria-disabled={item.configured ? undefined : "true"}
              onClick={() => nav.activate(item.id)}
              onMouseEnter={() => nav.setHover(item.id)}
              onMouseLeave={() => nav.setHover(null, item.id)}
              onFocus={() => nav.setHover(item.id)}
              onBlur={() => nav.setHover(null, item.id)}
            >
              <span className="orn-dot" aria-hidden="true" />
              <span>
                <span className="orn-label">{item.label}</span>
                <span className="orn-cap">
                  {item.configured ? item.caption : "Not available yet"}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {!nav.reduced && (
        <OrbitalRiftPortalOverlay
          phase={nav.phase}
          color={overlayItem ? overlayItem.color : "#ffffff"}
          origin={nav.origin}
          durationMs={transitionMs}
        />
      )}

      <p className="orn-sr" aria-live="polite">
        {nav.announcement}
      </p>
    </div>
  );
}

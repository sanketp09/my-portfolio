export const CAMERA_FOV = 45;
export const OBJECT_IDS = ["projects", "hackathons", "experience", "research"];

/** Scroll/handoff timeline stages (progress 0..1). */
export const STAGES = Object.freeze({
  emergeStart: 0.0,
  emergeEnd: 0.65,
  settleEnd: 1.0,
});

export const INTERACTIVE_FROM = 0.5;
export const OBJECT_RADIUS = 2.1;
export const AVATAR_MAX_W = 0;
export const AVATAR_MAX_H = 0;
export const AVATAR_BASE_Y = 0;

/* ----------------------------- math helpers ----------------------------- */

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
export const easeInOutSine = (t) => -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;

/* ---------------- Symmetrical 2 × 2 Realm Grid Layout ------------------- */

/**
 * World-space positions for the 4 realm models shifted away to the corners:
 * - TOP LEFT:     Projects (Construct)       [-3.55,  1.85, 0.0]
 * - TOP RIGHT:    Hackathons (Event Horizon)  [ 3.55,  1.85, 0.0]
 * - BOTTOM LEFT:  Experience (Chronosphere)  [-3.55, -1.85, 0.0]
 * - BOTTOM RIGHT: Research (Knowledge Gate)   [ 3.55, -1.85, 0.0]
 *
 * Each model hovers above its own independent pedestal with large vertical clearance.
 */
export const OBJECT_LAYOUT = {
  projects: {
    id: "projects",
    index: "01",
    label: "PROJECTS",
    caption: "Construct",
    realm: "CONSTRUCT",
    description: "Interactive 3D Web & Scalable Systems",
    actionLabel: "EXPLORE",
    color: "#38bdf8",
    anchor: [-3.65, 1.65, 0.0],
    compact: [-2.70, 1.50, 0.0],
    scale: 1.05,
    tilt: [0.08, 0.16, 0.1],
    spin: 0.16,
    float: { amp: 0.02, speed: 0.45, phase: 1.4 },
    sway: { amp: 0.01, speed: 0.25, phase: 0.6 },
    delay: 0.0,
  },
  hackathons: {
    id: "hackathons",
    index: "02",
    label: "HACKATHONS",
    caption: "Event Horizon",
    realm: "EVENT HORIZON",
    description: "Rapid Prototyping & Competitive Wins",
    actionLabel: "EXPLORE",
    color: "#ffb347",
    anchor: [3.65, 1.65, 0.0],
    compact: [2.70, 1.50, 0.0],
    scale: 1.05,
    tilt: [0.05, 0.0, 0.0],
    spin: 0.0,
    float: { amp: 0.02, speed: 0.45, phase: 0.0 },
    sway: { amp: 0.01, speed: 0.25, phase: 1.8 },
    delay: 0.03,
  },
  experience: {
    id: "experience",
    index: "03",
    label: "EXPERIENCE",
    caption: "Chronosphere",
    realm: "CHRONOSPHERE",
    description: "Engineering Internships & Career Growth",
    actionLabel: "EXPLORE",
    color: "#9fb8d6",
    anchor: [-3.65, -1.45, 0.0],
    compact: [-2.70, -1.35, 0.0],
    scale: 1.05,
    tilt: [0.18, 0.14, -0.06],
    spin: 0.12,
    float: { amp: 0.02, speed: 0.45, phase: 3.2 },
    sway: { amp: 0.01, speed: 0.25, phase: 3.9 },
    delay: 0.06,
  },
  research: {
    id: "research",
    index: "04",
    label: "RESEARCH",
    caption: "Knowledge Gate",
    realm: "KNOWLEDGE GATE",
    description: "AI Workflows & Applied Algorithms",
    actionLabel: "EXPLORE",
    color: "#a78bff",
    anchor: [3.65, -1.45, 0.0],
    compact: [2.70, -1.35, 0.0],
    scale: 1.05,
    tilt: [-0.12, 0.2, 0.06],
    spin: -0.14,
    float: { amp: 0.02, speed: 0.45, phase: 4.8 },
    sway: { amp: 0.01, speed: 0.25, phase: 5.1 },
    delay: 0.09,
  },
};

export const layoutBlend = (aspect) => smoothstep(0.9, 1.35, aspect);

/** Final resting position [x, y, z] of an object for the given viewport aspect. */
export function getRestPosition(id, aspect) {
  const L = OBJECT_LAYOUT[id];
  const b = layoutBlend(aspect);
  return [
    lerp(L.compact[0], L.anchor[0], b),
    lerp(L.compact[1], L.anchor[1], b),
    lerp(L.compact[2], L.anchor[2], b),
  ];
}

export function getBaseScale(id, aspect) {
  return OBJECT_LAYOUT[id].scale * lerp(0.85, 1, layoutBlend(aspect));
}

/* ------------------------------ timeline -------------------------------- */
export const getIntro = (p) => smoothstep(0, 0.2, p);

/** Per-object emerge/settle values (0..1). */
export function getObjectStages(id, p) {
  const d = OBJECT_LAYOUT[id].delay;
  return {
    emerge: smoothstep(STAGES.emergeStart + d, STAGES.emergeEnd, p),
    settle: smoothstep(STAGES.emergeEnd, STAGES.settleEnd, p),
  };
}

/** The `progress` value handed to each object component: 0 hidden -> 1 settled. */
export function getObjectProgress(id, p) {
  const start = STAGES.emergeStart + OBJECT_LAYOUT[id].delay;
  return clamp01((p - start) / (STAGES.settleEnd - start));
}

/** Fraction of final distance: starts at 0 right inside the avatar, then expands out to resting corners in 3D. */
export const getRadialFactor = (emerge, settle) => Math.pow(emerge, 1.4) * 0.94 + 0.06 * settle;
/** Fraction of final scale: starts at 0 inside avatar, scales up to full size as it emerges. */
export const getScaleFactor = (emerge, settle) => Math.pow(emerge, 1.25) * 0.88 + 0.12 * settle;

/* -------------------------------- camera -------------------------------- */
export function getCameraFit(aspect) {
  const t = Math.tan((CAMERA_FOV * Math.PI) / 360);
  const items = OBJECT_IDS.map((id) => ({
    pos: getRestPosition(id, aspect),
    r: OBJECT_RADIUS * getBaseScale(id, aspect) * 1.08,
  }));

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  items.forEach(({ pos, r }) => {
    minX = Math.min(minX, pos[0] - r);
    maxX = Math.max(maxX, pos[0] + r);
    minY = Math.min(minY, pos[1] - r);
    maxY = Math.max(maxY, pos[1] + r);
  });
  const tx = 0;
  const ty = 0;

  let need = 0;
  items.forEach(({ pos, r }) => {
    need = Math.max(
      need,
      (Math.abs(pos[0] - tx) + r) / (t * aspect) + pos[2],
      (Math.abs(pos[1] - ty) + r) / t + pos[2]
    );
  });

  const startDistance = 5.2;
  const finalDistance = Math.max(need * 1.06, 6.2);

  return { startDistance, finalDistance, target: [tx, ty] };
}

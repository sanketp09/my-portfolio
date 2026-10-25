import React, { useCallback, useEffect, useId, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Stage helpers (usable by the parent controller)                     */
/* ------------------------------------------------------------------ */

export const PROFILE_STAGE_RANGES = Object.freeze({
  panelsFadeStart: 0.25, // panels begin to leave
  panelsFadeEnd: 0.55, // panels fully gone
  pullbackStart: 0.25, // avatar starts receding / hand-off begins
  pullbackEnd: 0.8, // avatar fully receded / hand-off complete
});

const clamp01 = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
};
const smooth = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};

/** "profile" | "handoff" | "orbital" */
export function getProfileStage(progress, ranges = PROFILE_STAGE_RANGES) {
  const p = clamp01(progress);
  if (p < ranges.panelsFadeStart) return "profile";
  if (p < ranges.pullbackEnd) return "handoff";
  return "orbital";
}

/** Linear 0..1 across the hand-off window; feed this to the orbital scene's emergence. */
export function getHandoffProgress(progress, ranges = PROFILE_STAGE_RANGES) {
  const { pullbackStart: a, pullbackEnd: b } = ranges;
  return b > a ? clamp01((clamp01(progress) - a) / (b - a)) : clamp01(progress);
}

/* ------------------------------------------------------------------ */
/* Data normalisation (never invents anything)                         */
/* ------------------------------------------------------------------ */

const text = (v) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const asArray = (v) => (Array.isArray(v) ? v : []);

function normTimeline(list, map) {
  return asArray(list)
    .map((raw) => {
      if (typeof raw === "string") return { title: text(raw) };
      if (!raw || typeof raw !== "object") return null;
      let { title, org, period, details } = map(raw);
      if (!title && org) {
        title = org;
        org = "";
      }
      return { title, org, period, details };
    })
    .filter((it) => it && it.title);
}

const normEducation = (list) =>
  normTimeline(list, (r) => ({
    title: [text(r.degree), text(r.field)].filter(Boolean).join(", "),
    org: text(r.institution),
    period: text(r.period),
    details: text(r.details),
  }));

const normExperience = (list) =>
  normTimeline(list, (r) => ({
    title: text(r.role),
    org: text(r.organization),
    period: text(r.period),
    details: text(r.summary),
  }));

const normAchievements = (list) =>
  normTimeline(list, (r) => ({
    title: text(r.title),
    org: "",
    period: text(r.date),
    details: text(r.detail),
  }));

const normChips = (list) =>
  asArray(list)
    .map((raw) => (typeof raw === "string" ? text(raw) : raw && typeof raw === "object" ? text(raw.name) : ""))
    .filter(Boolean);

function initialsOf(name) {
  const parts = text(name).split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Reduced motion                                                      */
/* ------------------------------------------------------------------ */

function useReducedMotion(override) {
  const [system, setSystem] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystem(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);
  return typeof override === "boolean" ? override : system;
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
.orp-root{
  --orp-text:#e9edf6; --orp-muted:#a3adc2; --orp-accent:#a9bde3;
  --orp-font:ui-sans-serif,system-ui,"Segoe UI Variable Text","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --orp-display:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  position:relative;width:100%;height:100%;overflow:hidden;pointer-events:none;
  color:var(--orp-text);font-family:var(--orp-font);
}
.orp-center{
  position:absolute;left:50%;top:50%;z-index:2;
  display:flex;flex-direction:column;align-items:center;gap:16px;
  width:min(92vw,420px);text-align:center;
  transform:translate(-50%,-50%) scale(var(--orp-scale,1));transform-origin:center;
  transition:top .5s ease;
}
.orp-avatar{
  position:relative;flex:none;
  width:var(--orp-avatar-size,clamp(150px,20vw,240px));aspect-ratio:1;border-radius:50%;
  overflow:hidden;display:grid;place-items:center;
  background:radial-gradient(circle at 30% 25%,#1b2640,#0b1120);
  box-shadow:0 0 0 1px rgba(255,255,255,.16),0 0 0 7px rgba(169,189,227,.07),0 22px 70px rgba(0,0,0,.6);
  transition:box-shadow .3s ease;
  animation:orp-in .9s cubic-bezier(.2,.7,.2,1) backwards;
}
.orp-root[data-interactive="true"] .orp-avatar{pointer-events:auto;cursor:pointer}
.orp-root[data-interactive="true"] .orp-avatar:hover{
  box-shadow:0 0 0 1px rgba(255,255,255,.3),0 0 0 9px rgba(169,189,227,.12),0 22px 70px rgba(0,0,0,.6);
}
.orp-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.orp-initials{font-family:var(--orp-display);font-size:clamp(40px,7vw,72px);color:var(--orp-accent)}
.orp-copy{
  display:flex;flex-direction:column;align-items:center;gap:6px;
  opacity:var(--orp-fade,1);animation:orp-in .9s .25s cubic-bezier(.2,.7,.2,1) backwards;
}
.orp-name{margin:0;font-family:var(--orp-display);font-weight:500;font-size:clamp(26px,3.4vw,40px);line-height:1.1;letter-spacing:.005em}
.orp-title{margin:0;color:var(--orp-muted);font-size:clamp(14px,1.3vw,16px);line-height:1.4;max-width:34ch}
.orp-btn{
  margin-top:10px;min-height:44px;padding:10px 20px;border-radius:999px;
  border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:var(--orp-text);
  font:inherit;font-size:15px;cursor:pointer;pointer-events:none;
  transition:background .25s ease,border-color .25s ease;
}
.orp-root[data-interactive="true"] .orp-btn{pointer-events:auto}
.orp-btn:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.34)}
.orp-btn:focus-visible,.orp-avatar:focus-visible{outline:2px solid var(--orp-accent);outline-offset:3px}

.orp-panels{position:absolute;inset:0;z-index:1;opacity:var(--orp-fade,1);pointer-events:none}
.orp-col{
  position:absolute;top:50%;width:min(330px,26vw);max-height:88%;
  display:flex;flex-direction:column;gap:14px;
  transform:translate(calc(var(--orp-out,0) * var(--orp-dir,1) * 48px),-50%);
}
.orp-col--left{left:4vw;--orp-dir:-1}
.orp-col--right{right:4vw;--orp-dir:1}
.orp-panel{
  padding:16px 18px;border-radius:14px;
  background:linear-gradient(160deg,rgba(24,33,54,.78),rgba(10,14,26,.72));
  border:1px solid rgba(255,255,255,.09);
  box-shadow:0 14px 40px rgba(0,0,0,.35);
  opacity:0;transform:translateY(10px);visibility:hidden;
  transition:opacity .5s ease,transform .5s ease,visibility 0s linear .5s;
}
@supports (backdrop-filter:blur(1px)){
  .orp-panel{backdrop-filter:blur(14px) saturate(1.2);-webkit-backdrop-filter:blur(14px) saturate(1.2);
    background:linear-gradient(160deg,rgba(24,33,54,.58),rgba(10,14,26,.5))}
}
.orp-root.is-open[data-interactive="true"] .orp-panel{
  opacity:1;transform:none;visibility:visible;pointer-events:auto;
  transition:opacity .5s ease calc(var(--i,0) * 70ms),transform .5s ease calc(var(--i,0) * 70ms),visibility 0s;
}
.orp-panel-title{margin:0 0 10px;font-size:15px;font-weight:600;letter-spacing:.01em;color:var(--orp-accent)}
.orp-list,.orp-chips{list-style:none;margin:0;padding:0}
.orp-list{display:flex;flex-direction:column;gap:12px}
.orp-list li{display:flex;flex-direction:column;gap:2px}
.orp-item-title{font-size:15px;font-weight:600;line-height:1.35}
.orp-item-org,.orp-item-period{font-size:14px;color:var(--orp-muted);line-height:1.4}
.orp-item-details{margin:4px 0 0;font-size:14px;line-height:1.5;color:#c5cddd}
.orp-chips{display:flex;flex-wrap:wrap;gap:8px}
.orp-chips li{padding:5px 11px;border-radius:999px;font-size:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04)}

@keyframes orp-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

@media (max-width:759px){
  .orp-center{top:34%;gap:12px}
  .orp-root.is-open .orp-center{top:21%}
  .orp-avatar{width:var(--orp-avatar-size,clamp(96px,28vw,124px))}
  .orp-panels{top:40%;padding:0 16px 16px;overflow-y:auto;overflow-x:hidden}
  .orp-root[data-interactive="true"] .orp-panels{pointer-events:auto}
  .orp-col{position:static;width:auto;max-height:none;transform:translateY(calc(var(--orp-out,0) * 40px));margin-bottom:14px}
}
.orp-root.is-static *{animation:none !important;transition-duration:.01ms !important;transition-delay:0s !important}
@media (prefers-reduced-motion:reduce){
  .orp-root *{animation:none !important;transition-duration:.01ms !important;transition-delay:0s !important}
}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

function Panel({ panel, index, Heading, headingId }) {
  return (
    <section className="orp-panel" style={{ "--i": index }} aria-labelledby={headingId}>
      <Heading id={headingId} className="orp-panel-title">
        {panel.title}
      </Heading>
      {panel.type === "chips" ? (
        <ul className="orp-chips">
          {panel.items.map((label, i) => (
            <li key={`${label}-${i}`}>{label}</li>
          ))}
        </ul>
      ) : (
        <ul className="orp-list">
          {panel.items.map((it, i) => (
            <li key={`${it.title}-${i}`}>
              <span className="orp-item-title">{it.title}</span>
              {it.org ? <span className="orp-item-org">{it.org}</span> : null}
              {it.period ? <span className="orp-item-period">{it.period}</span> : null}
              {it.details ? <p className="orp-item-details">{it.details}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function DeveloperProfileFlow({
  progress = 0,
  profile = {},
  open,
  defaultOpen = false,
  onOpenChange,
  onStageChange,
  ranges,
  reducedMotion,
  headingLevel = 2,
  className = "",
  style,
}) {
  const uid = useId();
  const panelsId = `${uid}-panels`;
  const reduced = useReducedMotion(reducedMotion);

  const r = useMemo(() => ({ ...PROFILE_STAGE_RANGES, ...(ranges || {}) }), [ranges]);

  const [innerOpen, setInnerOpen] = useState(!!defaultOpen);
  const controlled = typeof open === "boolean";
  const isOpen = controlled ? open : innerOpen;
  const setOpen = useCallback(
    (next) => {
      if (!controlled) setInnerOpen(next);
      if (onOpenChange) onOpenChange(next);
    },
    [controlled, onOpenChange]
  );

  const p = clamp01(progress);
  const fadeSpan = Math.max(0.0001, r.panelsFadeEnd - r.panelsFadeStart);
  const fade = 1 - smooth((p - r.panelsFadeStart) / fadeSpan);
  const pull = smooth(getHandoffProgress(p, r));
  const scale = 1 - 0.38 * pull;
  const interactive = fade > 0.05;
  const stage = getProfileStage(p, r);

  useEffect(() => {
    if (onStageChange) onStageChange(stage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const name = text(profile?.name);
  const title = text(profile?.title);
  const avatarSrc = text(profile?.avatarSrc);
  const avatarAlt = text(profile?.avatarAlt) || (name ? `Portrait of ${name}` : "Developer portrait");

  const panels = useMemo(() => {
    const list = [
      { key: "education", title: "Education", type: "list", items: normEducation(profile?.education) },
      { key: "experience", title: "Experience", type: "list", items: normExperience(profile?.experience) },
      { key: "skills", title: "Skills", type: "chips", items: normChips(profile?.skills) },
      { key: "achievements", title: "Achievements", type: "list", items: normAchievements(profile?.achievements) },
      { key: "interests", title: "Interests", type: "chips", items: normChips(profile?.interests) },
    ];
    return list.filter((pn) => pn.items.length > 0);
  }, [profile]);

  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => setImgFailed(false), [avatarSrc]);

  const level = Math.min(6, Math.max(1, Math.round(headingLevel) || 2));
  const NameTag = `h${level}`;
  const PanelHeading = `h${Math.min(6, level + 1)}`;

  const left = panels.filter((_, i) => i % 2 === 0);
  const right = panels.filter((_, i) => i % 2 === 1);

  const toggle = () => {
    if (interactive && panels.length) setOpen(!isOpen);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape" && isOpen) setOpen(false);
  };

  const showInitials = !avatarSrc || imgFailed;
  const initials = initialsOf(name);

  return (
    <div
      className={`orp-root${isOpen ? " is-open" : ""}${reduced ? " is-static" : ""} ${className}`.trim()}
      style={{ "--orp-fade": fade, "--orp-out": 1 - fade, "--orp-scale": scale, ...style }}
      data-stage={stage}
      data-interactive={interactive ? "true" : "false"}
      onKeyDown={onKeyDown}
    >
      <style>{CSS}</style>

      <div className="orp-center">
        <div className="orp-avatar" onClick={toggle}>
          {!showInitials ? (
            <img src={avatarSrc} alt={avatarAlt} draggable={false} onError={() => setImgFailed(true)} />
          ) : initials ? (
            <span className="orp-initials" role="img" aria-label={avatarAlt}>
              {initials}
            </span>
          ) : null}
        </div>

        {(name || title || panels.length > 0) && (
          <div className="orp-copy" aria-hidden={interactive ? undefined : true}>
            {name ? <NameTag className="orp-name">{name}</NameTag> : null}
            {title ? <p className="orp-title">{title}</p> : null}
            {panels.length > 0 && interactive ? (
              <button
                type="button"
                className="orp-btn"
                aria-expanded={isOpen}
                aria-controls={panelsId}
                onClick={toggle}
              >
                {isOpen ? "Hide profile" : "View profile"}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {panels.length > 0 && (
        <div
          id={panelsId}
          className="orp-panels"
          role="region"
          aria-label="Profile details"
          style={{ visibility: fade > 0.01 ? "visible" : "hidden" }}
        >
          <div className="orp-col orp-col--left">
            {left.map((pn, i) => (
              <Panel key={pn.key} panel={pn} index={i * 2} Heading={PanelHeading} headingId={`${uid}-${pn.key}`} />
            ))}
          </div>
          <div className="orp-col orp-col--right">
            {right.map((pn, i) => (
              <Panel key={pn.key} panel={pn} index={i * 2 + 1} Heading={PanelHeading} headingId={`${uid}-${pn.key}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeveloperProfileFlow;

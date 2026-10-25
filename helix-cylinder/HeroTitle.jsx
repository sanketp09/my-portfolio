import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SECTIONS } from "./sections";

export function HeroTitle({ focusedSection }) {
  const titleRef = useRef();
  const subRef = useRef();
  const [displayed, setDisplayed] = useState(focusedSection ?? SECTIONS[0]);

  useEffect(() => {
    if (!titleRef.current || !subRef.current) return;
    const tl = gsap.timeline();
    tl.to([titleRef.current, subRef.current], {
      opacity: 0, y: -8, duration: 0.18, ease: "power2.in",
      onComplete: () => setDisplayed(focusedSection ?? SECTIONS[0]),
    });
    tl.to([titleRef.current, subRef.current], {
      opacity: 1, y: 0, duration: 0.32, ease: "power2.out", stagger: 0.06,
    });
  }, [focusedSection]);

  const section = displayed;

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      pointerEvents: "none",
      zIndex: 5,
      // Sits BEHIND the cards (the cards are in the R3F canvas which is z:1)
    }}>
      <p ref={subRef} style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: section?.accentColor ?? "rgba(255,255,255,0.4)",
        marginBottom: 10,
        opacity: 0.7,
      }}>
        {section?.subtitle} · Scroll to explore →
      </p>
      <h1 ref={titleRef} style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        fontSize: "clamp(48px, 7vw, 96px)",
        lineHeight: 1,
        color: "#fff",
        letterSpacing: "-0.02em",
        textShadow: `0 0 120px ${section?.accentColor ?? "#2563eb"}44`,
      }}>
        {section?.label}
      </h1>
    </div>
  );
}

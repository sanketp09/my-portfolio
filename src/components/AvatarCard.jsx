import { useScene } from "../context/SceneContext";
import { motion } from "framer-motion";

export function AvatarCard({ avatar }) {
  const { selected, select } = useScene();
  const isSelected = selected === avatar.id;
  const otherSelected = selected && !isSelected;

  return (
    <motion.div
      layoutId={`card-container-${avatar.id}`}
      onClick={() => select(avatar.id, { skipInfoCard: true })}
      style={{
        width: "min(340px, 42vw)",
        height: "520px",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease",
        transform: isSelected ? "scale(1.05)" : "scale(1)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = avatar.accent;
          e.currentTarget.style.transform = "translateY(-8px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div style={{ flex: 1, minHeight: 0, display: "flex", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <motion.img
          layoutId={`photo-${avatar.id}`}
          src={avatar.photo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transform: "scale(1.2)",
          }} 
        />
      </div>
      
      {/* Bottom text area */}
      <div style={{
        padding: "24px",
        background: "var(--bg-card-2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text)",
          margin: "0 0 6px 0",
          letterSpacing: "0.02em"
        }}>
          {avatar.name}
        </h2>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: avatar.accent,
          fontWeight: 600,
          margin: 0,
          letterSpacing: "0.05em",
          textTransform: "uppercase"
        }}>
          {avatar.title}
        </p>
      </div>
    </motion.div>
  );
}

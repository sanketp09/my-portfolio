import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
//  IMMERSIVE DISASTER-RESPONSE COMMAND INTERFACE (RESQLINK)
// ─────────────────────────────────────────────────────────────
function DisasterMeshSimulator({ accentColor, accentRGB }) {
  // Visual rescue workflow stages: SOS received → situation assessed → route evaluated → rescue coordination
  const workflowStages = [
    {
      id: "sos_received",
      number: "01",
      title: "SOS Received",
      status: "PACKET CAPTURED",
      desc: "Civilian emergency beacon broadcasted over BLE Advertising Channel 37 without cellular connectivity.",
      badge: "VERIFIED BLE P2P",
      badgeColor: "#10b981",
    },
    {
      id: "situation_assessed",
      number: "02",
      title: "Situation Assessed",
      status: "TRIAGE LOGGED",
      desc: "Local incident dossier compiled: 6 trapped civilians, 2 urgent compound fractures, critical priority P1.",
      badge: "VERIFIED LOCAL DOSSIER",
      badgeColor: "#10b981",
    },
    {
      id: "route_evaluated",
      number: "03",
      title: "Route Evaluated",
      status: "ROAD BLOCKED → DETOUR ACTIVE",
      desc: "Route 4 bridge collapse detected by crowdsourced telemetry; convoy dynamically rerouted via Bypass 12.",
      badge: "VERIFIED LIVING MAP",
      badgeColor: "#f59e0b",
    },
    {
      id: "rescue_coordinated",
      number: "04",
      title: "Rescue Coordinated",
      status: "CONVOY EN ROUTE",
      desc: "Responder Alpha dispatched along clear corridor. Airborne Drone Relay D-1 providing extended BLE coverage.",
      badge: "DRONE RELAY (PROPOSED)",
      badgeColor: "#a855f7",
    },
  ];

  const [activeWorkflow, setActiveWorkflow] = useState(0);

  // Map nodes
  const [nodes, setNodes] = useState([
    {
      id: "hq",
      name: "Relief Command HQ",
      type: "hq",
      x: 50,
      y: 48,
      status: "OPERATIONAL",
      coords: "23.0225° N, 72.5714° E",
      battery: "100%",
      hops: "0 (Central Sink)",
      rssi: "Gateway Base",
      details: "Central tactical coordination base. Receiving mesh packets and dispatching field rescue assets.",
    },
    {
      id: "civ1",
      name: "SOS #104 (Trapped Group)",
      type: "sos",
      x: 18,
      y: 72,
      status: "P1 CRITICAL MEDICAL",
      coords: "23.0180° N, 72.5640° E",
      battery: "42%",
      hops: "2 Hops to HQ",
      rssi: "-68 dBm (BLE Ch. 37)",
      details: "6 civilians trapped under structural debris. 2 compound fractures. Immediate medical extraction required.",
    },
    {
      id: "civ2",
      name: "SOS #108 (Shelter Supplies)",
      type: "supply",
      x: 78,
      y: 28,
      status: "P2 SUSTENANCE",
      coords: "23.0290° N, 72.5810° E",
      battery: "68%",
      hops: "2 Hops to HQ",
      rssi: "-72 dBm (BLE Ch. 38)",
      details: "Community shelter with 40 displaced individuals. Clean drinking water and infant milk urgently required.",
    },
    {
      id: "resA",
      name: "Responder Alpha (4x4 Convoy)",
      type: "responder",
      x: 32,
      y: 58,
      status: "EN ROUTE (BYPASS 12)",
      coords: "23.0205° N, 72.5680° E",
      battery: "88%",
      hops: "1 Hop to HQ",
      rssi: "-64 dBm",
      details: "Mobile ground rescue vehicle equipped with trauma medical supplies and store-and-forward mesh relay node.",
    },
    {
      id: "resB",
      name: "Responder Beta (Search Team)",
      type: "responder",
      x: 65,
      y: 42,
      status: "RELAYING SECTOR 3",
      coords: "23.0260° N, 72.5750° E",
      battery: "81%",
      hops: "1 Hop to HQ",
      rssi: "-70 dBm",
      details: "Foot search team mapping passable alleys and extending mesh propagation to isolated residential pockets.",
    },
    {
      id: "hazard",
      name: "Route 4 Bridge Collapse",
      type: "hazard",
      x: 44,
      y: 32,
      status: "ROAD IMPASSABLE",
      coords: "23.0210° N, 72.5700° E",
      battery: "N/A",
      hops: "Hazard Reported",
      rssi: "Debris Flagged",
      details: "Overpass collapsed due to flash flooding. Riverbed road washed out. Convoys re-routed via Bypass 12.",
    },
    {
      id: "drone",
      name: "Drone Relay D-1 (Concept)",
      type: "drone",
      x: 55,
      y: 78,
      status: "AIRBORNE LOITERING (120m)",
      coords: "23.0240° N, 72.5770° E",
      battery: "62% (24 min flight)",
      hops: "Airborne Link",
      rssi: "-58 dBm (LoS)",
      details: "Proposed capability: Loitering UAV acting as an airborne BLE repeater to bridge severed communication corridors over flooded terrain.",
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState("civ1");
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  const [logs, setLogs] = useState([
    { time: "14:02:18", event: "Tactical BLE Mesh initialized: Channels 37, 38, 39 active in store-and-forward mode.", type: "system" },
    { time: "14:02:22", event: "SOS #104 captured by Responder Alpha: Medical Priority 1 (6 Trapped, 2 Fractures).", type: "sos" },
    { time: "14:02:24", event: "Mesh Hop 1: SOS #104 -> Responder Alpha (-68 dBm, 20-byte chunk reassembly).", type: "mesh" },
    { time: "14:02:26", event: "Mesh Hop 2: Responder Alpha -> Relief HQ (Packet delivered, zero packet loss).", type: "success" },
    { time: "14:02:30", event: "Crowdsourced report: Route 4 bridge structural failure. Passability index set to 0.0.", type: "hazard" },
    { time: "14:02:34", event: "Route engine: Bypass 12 corridor calculated (Passable, ETA: 8 mins).", type: "system" },
  ]);

  const [routeDrawn, setRouteDrawn] = useState(true);

  // Actions
  const triggerSOS = () => {
    const newId = Math.floor(Math.random() * 800) + 200;
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🚨 New SOS #${newId} Broadcast: Severe injury, immediate extraction beaconed!`, type: "sos" },
      { time, event: `⚡ BLE Multi-hop: SOS #${newId} picked up by nearest relay node (-64 dBm).`, type: "mesh" },
      ...prev.slice(0, 5),
    ]);
    setActiveWorkflow(0);
  };

  const triggerHazard = () => {
    const locations = ["Sector 2 Highway Overpass", "Riverbed Culvert B-4", "North Ridge Tunnel", "East Rail Crossing"];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `⚠️ Road Hazard Alert: Debris blockage detected at ${loc}.`, type: "hazard" },
      { time, event: `🗺️ Living Map Engine: Recalculating convoy detour vectors around blocked sectors.`, type: "system" },
      ...prev.slice(0, 5),
    ]);
    setActiveWorkflow(2);
  };

  const triggerDrone = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🚁 Drone Relay D-1 Airborne: Loitering at 120m AGL (+4.5km BLE coverage radius).`, type: "drone" },
      { time, event: `📡 Isolated ground survivor cluster re-linked to Relief Command HQ corridor.`, type: "success" },
      ...prev.slice(0, 5),
    ]);
    setActiveWorkflow(3);
  };

  const triggerReroute = () => {
    setRouteDrawn(prev => !prev);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🔄 Living Map: Toggled dynamic rescue routing matrix (Bypass 12 active).`, type: "system" },
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(6, 11, 20, 0.92)",
        border: "1px solid rgba(249, 115, 22, 0.35)",
        borderRadius: 24,
        padding: "30px 24px",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8), inset 0 0 80px rgba(249, 115, 22, 0.05)",
        marginTop: 36,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── TOP MISSION CONTROL HUD BAR ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          paddingBottom: 22,
          borderBottom: "1px solid rgba(255, 255, 255, 0.09)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Pulsing Emergency Beacon */}
          <div style={{ position: "relative", width: 14, height: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#f97316",
                boxShadow: "0 0 16px #f97316",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "2px solid rgba(249, 115, 22, 0.6)",
                animation: "ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.16em",
                color: "#ffffff",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>INCIDENT COMMAND: RESQLINK DISASTER RESPONSE CENTER</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  color: "#fca5a5",
                  fontWeight: 700,
                }}
              >
                LEVEL 2 EMERGENCY ACTIVE
              </span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              BLE P2P Mesh · Zero Cellular Reliance · Living Disaster Map · Store-and-Forward Routing
            </div>
          </div>
        </div>

        {/* Command Action Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={triggerSOS}
            style={{
              background: "rgba(239, 68, 68, 0.18)",
              border: "1px solid rgba(239, 68, 68, 0.45)",
              color: "#fca5a5",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.32)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)"; }}
          >
            🚨 Broadcast SOS
          </button>
          <button
            type="button"
            onClick={triggerHazard}
            style={{
              background: "rgba(245, 158, 11, 0.18)",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              color: "#fcd34d",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245, 158, 11, 0.32)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245, 158, 11, 0.18)"; }}
          >
            ⚠️ Report Hazard
          </button>
          <button
            type="button"
            onClick={triggerDrone}
            style={{
              background: "rgba(168, 85, 247, 0.18)",
              border: "1px solid rgba(168, 85, 247, 0.45)",
              color: "#d8b4fe",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168, 85, 247, 0.32)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(168, 85, 247, 0.18)"; }}
          >
            🚁 Loiter Drone Relay (Concept)
          </button>
          <button
            type="button"
            onClick={triggerReroute}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.14)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            🔄 Toggle Detour Route
          </button>
        </div>
      </div>

      {/* ── VISUAL RESCUE WORKFLOW BAR (SOS → Assessed → Evaluated → Coordinated) ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#f97316", textTransform: "uppercase", fontWeight: 700 }}>
            TACTICAL RESCUE PIPELINE: SOS RECEIVED ➔ ASSESSED ➔ ROUTE EVALUATED ➔ RESCUE COORDINATED
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255,255,255,0.45)" }}>
            CLICK ANY STAGE TO INSPECT TELEMETRY
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
          {workflowStages.map((stg, idx) => {
            const isActive = activeWorkflow === idx;
            return (
              <div
                key={stg.id}
                onClick={() => setActiveWorkflow(idx)}
                style={{
                  background: isActive ? "rgba(249, 115, 22, 0.18)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isActive ? "#f97316" : "rgba(255, 255, 255, 0.08)"}`,
                  borderRadius: 14,
                  padding: "12px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 0 20px rgba(249, 115, 22, 0.2)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: isActive ? "#ffedd5" : "rgba(255,255,255,0.4)" }}>
                    STAGE {stg.number}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      color: stg.badgeColor,
                    }}
                  >
                    {stg.badge}
                  </span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 3 }}>
                  {stg.title}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.4 }}>
                  {stg.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2-COLUMN DISASTER MAP & OPERATIONAL DOSSIER COMPOSITION ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 24 }}>
        
        {/* LEFT: TACTICAL DISASTER MAP CANVAS */}
        <div
          style={{
            position: "relative",
            minHeight: 380,
            borderRadius: 20,
            background: "radial-gradient(circle at 50% 50%, rgba(12, 22, 42, 0.95) 0%, rgba(4, 8, 16, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            overflow: "hidden",
            boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* Grid lines & Coordinates */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {/* Latitude / Longitude lines */}
            <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: 1, background: "rgba(255, 255, 255, 0.04)" }} />
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(249, 115, 22, 0.08)" }} />
            <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: 1, background: "rgba(255, 255, 255, 0.04)" }} />
            <div style={{ position: "absolute", left: "25%", top: 0, bottom: 0, width: 1, background: "rgba(255, 255, 255, 0.04)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(249, 115, 22, 0.08)" }} />
            <div style={{ position: "absolute", left: "75%", top: 0, bottom: 0, width: 1, background: "rgba(255, 255, 255, 0.04)" }} />

            {/* Concentric radar rings centered at HQ */}
            <div style={{ position: "absolute", left: "50%", top: "48%", transform: "translate(-50%, -50%)", width: 110, height: 110, borderRadius: "50%", border: "1px solid rgba(249, 115, 22, 0.18)" }} />
            <div style={{ position: "absolute", left: "50%", top: "48%", transform: "translate(-50%, -50%)", width: 220, height: 220, borderRadius: "50%", border: "1px dashed rgba(249, 115, 22, 0.12)" }} />
            <div style={{ position: "absolute", left: "50%", top: "48%", transform: "translate(-50%, -50%)", width: 330, height: 330, borderRadius: "50%", border: "1px solid rgba(255, 255, 255, 0.06)" }} />

            {/* Corner Coordinates */}
            <span style={{ position: "absolute", top: 10, left: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>
              SECTOR 4 FLOODPLAIN · 23.0225° N, 72.5714° E
            </span>
            <span style={{ position: "absolute", bottom: 10, right: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(249, 115, 22, 0.7)" }}>
              RADAR SWEEP ACTIVE · 100m RANGE RINGS
            </span>
          </div>

          {/* SVG Vector Routes & Hazard Paths */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {/* Blocked Hazard Route (Route 4 Bridge) */}
            <line x1="50%" y1="48%" x2="44%" y2="32%" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" opacity="0.85" />
            
            {/* Safe Detour Route (HQ -> Bypass 12 -> Responder Alpha -> SOS #104) */}
            {routeDrawn && (
              <>
                <path
                  d="M 50% 48% Q 40% 52% 32% 58% T 18% 72%"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="8 4"
                  opacity="0.9"
                />
                <circle cx="32%" cy="58%" r="4" fill="#10b981" />
              </>
            )}

            {/* Mesh relay link to supply point SOS #108 */}
            <line x1="50%" y1="48%" x2="65%" y2="42%" stroke="#f97316" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.75" />
            <line x1="65%" y1="42%" x2="78%" y2="28%" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.75" />

            {/* Drone Relay Airborne Link */}
            <line x1="50%" y1="48%" x2="55%" y2="78%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />
            <line x1="55%" y1="78%" x2="18%" y2="72%" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          </svg>

          {/* Interactive Map Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHQ = node.type === "hq";
            const isSOS = node.type === "sos";
            const isHazard = node.type === "hazard";
            const isDrone = node.type === "drone";
            const isSupply = node.type === "supply";

            const nodeBg = isHQ
              ? "#f97316"
              : isSOS
              ? "#ef4444"
              : isHazard
              ? "#dc2626"
              : isDrone
              ? "#a855f7"
              : isSupply
              ? "#f59e0b"
              : "#38bdf8";

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  position: "absolute",
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  zIndex: isSelected ? 30 : 20,
                }}
              >
                {/* Node Beacon Circle */}
                <div
                  style={{
                    position: "relative",
                    width: isHQ ? 22 : 16,
                    height: isHQ ? 22 : 16,
                    borderRadius: "50%",
                    background: nodeBg,
                    boxShadow: isSelected ? `0 0 24px ${nodeBg}` : `0 0 12px ${nodeBg}`,
                    border: isSelected ? "3px solid #ffffff" : "2px solid rgba(255,255,255,0.8)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {/* Pulsing ring on selected node */}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        border: `2px solid ${nodeBg}`,
                        animation: "ping 1.4s infinite",
                      }}
                    />
                  )}
                </div>

                {/* Node Pill Label */}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                    marginTop: 6,
                    whiteSpace: "nowrap",
                    background: isSelected ? "rgba(249, 115, 22, 0.9)" : "rgba(4, 9, 18, 0.88)",
                    padding: "2px 7px",
                    borderRadius: 5,
                    border: `1px solid ${isSelected ? "#f97316" : "rgba(255, 255, 255, 0.15)"}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {node.name.split("(")[0]}
                </span>
              </div>
            );
          })}

          {/* Map Overlay Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(3, 7, 18, 0.8)",
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
          >
            <span style={{ color: "#10b981" }}>● Passable Detour Route (Bypass 12)</span>
            <span style={{ color: "#ef4444" }}>✖ Impassable Road (Route 4)</span>
          </div>
        </div>

        {/* RIGHT: SELECTED NODE TELEMETRY DOSSIER & TRIAGE QUEUE */}
        <div
          style={{
            background: "rgba(10, 18, 34, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 20,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Node Dossier Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: "rgba(249, 115, 22, 0.16)",
                  color: "#f97316",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                NODE TELEMETRY DOSSIER
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: selectedNode.type === "sos" || selectedNode.type === "hazard" ? "#ef4444" : "#10b981",
                  fontWeight: 700,
                }}
              >
                ● {selectedNode.status}
              </span>
            </div>

            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#ffffff", margin: "0 0 6px" }}>
              {selectedNode.name}
            </h3>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
              COORDINATES: {selectedNode.coords}
            </div>

            {/* Spec Matrix Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "9px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 9.5 }}>HOP DISTANCE</div>
                <div style={{ color: "#ffffff", fontWeight: 700, marginTop: 2 }}>{selectedNode.hops}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "9px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 9.5 }}>SIGNAL STRENGTH</div>
                <div style={{ color: "#f97316", fontWeight: 700, marginTop: 2 }}>{selectedNode.rssi}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "9px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 9.5 }}>BATTERY TELEMETRY</div>
                <div style={{ color: "#10b981", fontWeight: 700, marginTop: 2 }}>{selectedNode.battery}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "9px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 9.5 }}>COMMUNICATION</div>
                <div style={{ color: "#38bdf8", fontWeight: 700, marginTop: 2 }}>BLE Store & Fwd</div>
              </div>
            </div>

            {/* Node Incident Payload Details */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                lineHeight: 1.5,
                color: "#f1f5f9",
                marginBottom: 16,
              }}
            >
              <div style={{ color: "#f97316", fontWeight: 700, fontSize: 10, marginBottom: 4 }}>INCIDENT REPORT / PAYLOAD:</div>
              {selectedNode.details}
            </div>

            {/* Resource Request / Triage Status */}
            <div
              style={{
                background: "rgba(249, 115, 22, 0.08)",
                border: "1px solid rgba(249, 115, 22, 0.25)",
                borderRadius: 10,
                padding: "10px 14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
              }}
            >
              <div style={{ color: "#fcd34d", fontWeight: 700, marginBottom: 2 }}>TACTICAL DISPATCH STATUS:</div>
              <div style={{ color: "#ffffff" }}>
                Convoy Unit Alpha rerouted via Bypass 12 · Estimated Arrival: 8 mins
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: 14,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            <span>CHANNEL: 37/38/39 P2P</span>
            <span>SECURITY: AES-256 ENCRYPTED</span>
          </div>
        </div>

      </div>

      {/* ── BLE OFFLINE COMMUNICATION MESH VISUALIZATION & EVENT LOGS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        
        {/* BLE Peer-to-Peer Relay Visualizer */}
        <div
          style={{
            background: "rgba(10, 18, 34, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            borderRadius: 18,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                BLE Offline Mesh Relay Architecture
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9.5,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  fontWeight: 700,
                }}
              >
                100% ZERO CELLULAR REQUIRED
              </span>
            </div>

            {/* Step-by-Step P2P Relay Chains */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              
              {/* Hop 1 */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <span style={{ color: "#ef4444", fontWeight: 800 }}>[1] CIVILIAN DEVICE</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>➔ BLE Adv (-68 dBm) ➔</span>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>RESPONDER ALPHA</span>
                <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 10 }}>20-byte Chunked</span>
              </div>

              {/* Hop 2 */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>[2] RESPONDER ALPHA</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>➔ LoS Air Link (-58 dBm) ➔</span>
                <span style={{ color: "#a855f7", fontWeight: 700 }}>DRONE RELAY D-1</span>
                <span style={{ marginLeft: "auto", color: "#a855f7", fontSize: 10 }}>Concept UAV</span>
              </div>

              {/* Hop 3 */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                <span style={{ color: "#a855f7", fontWeight: 700 }}>[3] DRONE RELAY D-1</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>➔ Long-Range P2P (-62 dBm) ➔</span>
                <span style={{ color: "#f97316", fontWeight: 800 }}>RELIEF COMMAND HQ</span>
                <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 10 }}>Delivered</span>
              </div>

            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Messages propagate via store-and-forward gossip replication. Even when devices move apart, packets are cached locally in SQLite and transmitted when in proximity.
            </div>
          </div>

          <div
            style={{
              paddingTop: 12,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            <span>MTU: 20 bytes payload per burst</span>
            <span>RELIABILITY: 99.4% Multi-Hop Delivery</span>
          </div>
        </div>

        {/* Real-time Event Timeline Stream */}
        <div
          style={{
            background: "rgba(4, 9, 18, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 18,
            padding: "16px 18px",
            height: 240,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                TACTICAL EVENT TIMELINE
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>
                REAL-TIME TELEMETRY
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {logs.map((lg, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    lineHeight: 1.45,
                    color:
                      lg.type === "sos"
                        ? "#fca5a5"
                        : lg.type === "hazard"
                        ? "#fcd34d"
                        : lg.type === "drone"
                        ? "#d8b4fe"
                        : lg.type === "success"
                        ? "#86efac"
                        : "rgba(255, 255, 255, 0.75)",
                  }}
                >
                  <span style={{ color: "rgba(255, 255, 255, 0.35)", marginRight: 8 }}>[{lg.time}]</span>
                  {lg.event}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: 8,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              color: "rgba(255, 255, 255, 0.4)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>STORE-AND-FORWARD BUFFER: 0% LOSS</span>
            <span>VERIFIED FLUTTER IMPLEMENTATION</span>
          </div>
        </div>

      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCIENTIFIC SPECIMEN LIBRARY & MATERIAL PASSPORT (RECLAIM)
// ─────────────────────────────────────────────────────────────
function MaterialPassportSimulator({ accentColor, accentRGB }) {
  // Discarded-material-to-reuse journey
  const circularJourney = [
    {
      step: "01",
      title: "Discarded Campus Asset",
      status: "DECOMMISSION INTAKE",
      desc: "Asset slated for disposal during departmental renovation; flagged before landfill transfer.",
      icon: "📦",
    },
    {
      step: "02",
      title: "Material Passport Minting",
      status: "COMPOSITION PROFILED",
      desc: "Elemental purity, disassembly fasteners, and embodied carbon abatement cataloged.",
      icon: "🏷️",
    },
    {
      step: "03",
      title: "Intra-Campus Match",
      status: "REQUISITION PAIRED",
      desc: "Direct demand match made with pending campus department requisitions.",
      icon: "⚡",
    },
    {
      step: "04",
      title: "Closed-Loop Re-Deployment",
      status: "LIFECYCLE EXTENDED",
      desc: "Asset re-installed in new laboratory, avoiding virgin procurement and carbon emissions.",
      icon: "🌱",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const specimens = [
    {
      id: "SPECIMEN #01",
      code: "MP-OAK-0418",
      name: "Solid Oak Lab Workbenches (24 Units)",
      origin: "Biology Complex — Block B Renovation",
      category: "Timber & Structural Joinery",
      materialType: "Solid White Oak (Quercus alba)",
      disassemblyEase: "High (M8 Hex Machine Bolts · Zero Adhesive Laminations)",
      condition: "Grade A (92% structural integrity · Minor superficial scuffs)",
      reusePotential: "Immediate Laboratory & Drafting Furniture Re-deployment",
      lifecycleInfo: "Installed 2011 · Estimated 40+ Year Extended Service Life",
      toxins: "Zero VOCs · Unfinished Natural Timber · Mechanical Fasteners",
      matchedDept: "Architecture Design Studio (Model Making Expansion)",
      matchedLead: "Prof. H. Mehta · Requisition #ARC-2025-09",
      composition: [
        { material: "Solid White Oak", pct: 82, color: "#4ade80", notes: "100% Biodegradable & Reusable" },
        { material: "Cold-Rolled Steel", pct: 14, color: "#38bdf8", notes: "Indefinitely Recyclable" },
        { material: "Brass Hardware", pct: 4, color: "#facc15", notes: "High Scrap Metallurgy Value" },
      ],
      carbonAvoided: "3.56 metric tons CO₂e",
      irsScore: 89,
      irsRating: "High Circular Feasibility",
      irsCriteria: [
        { name: "1. Material Purity & Disassembly Ease", weight: "25%", score: 92, desc: "Standard M8 hex bolts with zero chemical adhesive laminations for quick unbolting." },
        { name: "2. Physical Condition & Structural Integrity", weight: "25%", score: 84, desc: "Minor superficial scuffs; heavy timber load-bearing capacity exceeds safety margins." },
        { name: "3. Campus Department Re-Absorption Demand", weight: "25%", score: 95, desc: "Direct requisitions logged by Architecture Dept for semester model drafting benches." },
        { name: "4. Carbon Abatement & Economic Salvage", weight: "25%", score: 86, desc: "Avoids procurement of 24 new imported timber desks with 68% direct budget savings." },
      ]
    },
    {
      id: "SPECIMEN #02",
      code: "MP-ALU-1092",
      name: "Modular Extruded Aluminum Server Racks (8 Units)",
      origin: "IT Data Center — Vault 4 Decommissioning",
      category: "Electronics Enclosures & Structural Alloys",
      materialType: "6061-T6 Aluminum Alloy",
      disassemblyEase: "Very High (Standard 19-inch Quick-Release Rails)",
      condition: "Grade A+ (Near Mint · Climate-Controlled Datacenter Origin)",
      reusePotential: "Autonomous Systems Test Benches & Battery Containment",
      lifecycleInfo: "Commissioned 2018 · Indefinite Recyclability without Degradation",
      toxins: "RoHS Compliant · Powder-Coated · Zero Heavy Metals",
      matchedDept: "Robotics & Autonomous Systems Lab (Sensor Bench Rigs)",
      matchedLead: "Dr. K. Sharma · Requisition #ROB-2025-14",
      composition: [
        { material: "Extruded 6061 Aluminum", pct: 76, color: "#38bdf8", notes: "Closed-Loop Secondary Remelt" },
        { material: "Mild Steel Panels", pct: 18, color: "#a855f7", notes: "Magnetic High-Purity Sorting" },
        { material: "ABS Polymer Trim", pct: 6, color: "#94a3b8", notes: "Thermoplastic Regrind Pellets" },
      ],
      carbonAvoided: "2.49 metric tons CO₂e",
      irsScore: 94,
      irsRating: "Immediate Re-Deployment Ready",
      irsCriteria: [
        { name: "1. Material Purity & Disassembly Ease", weight: "25%", score: 96, desc: "Quick-release thumbscrews and standardized 19-inch rack rail profiles." },
        { name: "2. Physical Condition & Structural Integrity", weight: "25%", score: 95, desc: "Maintained in dust-free climate controlled facility with zero structural distortion." },
        { name: "3. Campus Department Re-Absorption Demand", weight: "25%", score: 92, desc: "High-priority match for Robotics team test rigs and battery containment racks." },
        { name: "4. Carbon Abatement & Economic Salvage", weight: "25%", score: 93, desc: "Virgin aluminum smelting is intensely carbon-heavy; secondary reuse eliminates 2.49t CO₂e." },
      ]
    },
    {
      id: "SPECIMEN #03",
      code: "MP-WOL-3841",
      name: "Compressed Natural Wool Acoustic Baffles (42 Panels)",
      origin: "Memorial Auditorium — North Hall Refurbishment",
      category: "Architectural Acoustics & Fibers",
      materialType: "Compressed Natural Sheep Wool",
      disassemblyEase: "High (Modular Ceiling Suspension Grommets)",
      condition: "Grade B+ (Excellent Acoustic Absorption · Minor Dust)",
      reusePotential: "Audio Recording Isolation Booths & Quiet Study Hubs",
      lifecycleInfo: "Installed 2016 · 100% Biodegradable & Compostable at End of Life",
      toxins: "Class 1 Fire Retardant · Oeko-Tex Standard 100 Certified",
      matchedDept: "Music & Audio Production Studios (Sound Isolation Booths)",
      matchedLead: "Dept of Performing Arts · Requisition #MUS-2025-03",
      composition: [
        { material: "Compressed Natural Wool", pct: 88, color: "#4ade80", notes: "100% Compostable / Secondary Felt" },
        { material: "Galvanized Suspension Wire", pct: 12, color: "#facc15", notes: "Direct Scrap Wire Recycling" },
      ],
      carbonAvoided: "1.77 metric tons CO₂e",
      irsScore: 82,
      irsRating: "Strong Upcycling Affinity",
      irsCriteria: [
        { name: "1. Material Purity & Disassembly Ease", weight: "25%", score: 88, desc: "Modular ceiling suspension grommets allow single-person uninstallation in 45s." },
        { name: "2. Physical Condition & Structural Integrity", weight: "25%", score: 79, desc: "Requires HEPA vacuuming before reinstallation; zero fibre rot, stains, or mildew." },
        { name: "3. Campus Department Re-Absorption Demand", weight: "25%", score: 85, desc: "Music department pending budget request for acoustic baffling in podcast booths." },
        { name: "4. Carbon Abatement & Economic Salvage", weight: "25%", score: 76, desc: "Eliminates need for synthetic acoustic polyurethane foam purchases." },
      ]
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentItem = specimens[selectedIdx];

  const [logs, setLogs] = useState([
    { time: "11:24:02", event: "Material Passport minted: MP-OAK-0418 cataloged from Biology Complex.", type: "mint" },
    { time: "11:24:06", event: "LCA Analysis: 3.56 metric tons CO₂e avoided versus virgin timber harvest.", type: "carbon" },
    { time: "11:24:10", event: "IRS Engine: Innovation Readiness Score 89/100 (Tier A Circular Feasibility).", type: "score" },
    { time: "11:24:15", event: "Requisition Paired: Automated transfer to Architecture Design Studio.", type: "match" },
  ]);

  const simulateMatch = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `⚡ Circular Matching: Paired ${currentItem.code} with ${currentItem.matchedDept}.`, type: "match" },
      ...prev.slice(0, 5)
    ]);
    setActiveStep(2);
  };

  const simulateExport = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `📋 Material Passport JSON for ${currentItem.code} signed & cryptographic hash verified.`, type: "mint" },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(6, 20, 16, 0.88)",
        border: "1px solid rgba(163, 230, 53, 0.32)",
        borderRadius: 24,
        padding: "30px 24px",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), inset 0 0 70px rgba(163, 230, 53, 0.04)",
        marginTop: 36,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── LAB HEADER HUD ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          paddingBottom: 22,
          borderBottom: "1px solid rgba(255, 255, 255, 0.09)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#a3e635",
              boxShadow: "0 0 16px #a3e635",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "#fefce8",
                textTransform: "uppercase",
              }}
            >
              DIGITAL MATERIALS ARCHIVE & SCIENTIFIC SPECIMEN LIBRARY
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              Verifiable Material Passports · Circular Flow Orchestration · Innovation Readiness Scoring
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={simulateMatch}
            style={{
              background: "rgba(163, 230, 53, 0.16)",
              border: "1px solid rgba(163, 230, 53, 0.4)",
              color: "#bef264",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(163, 230, 53, 0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(163, 230, 53, 0.16)"; }}
          >
            ⚡ Match Campus Requisition
          </button>
          <button
            type="button"
            onClick={simulateExport}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              color: "#fefce8",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            📋 Export Passport JSON
          </button>
        </div>
      </div>

      {/* ── CIRCULAR-FLOW JOURNEY: DISCARDED TO REPURPOSED ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: "#a3e635", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          CIRCULAR TRANSFORMATION PIPELINE: DISCARDED ASSET ➔ CHARACTERIZED ➔ MATCHED ➔ RE-DEPLOYED
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
          {circularJourney.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStep(idx)}
                style={{
                  background: isActive ? "rgba(163, 230, 53, 0.14)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isActive ? "#a3e635" : "rgba(255, 255, 255, 0.08)"}`,
                  borderRadius: 14,
                  padding: "12px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{step.icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: isActive ? "#bef264" : "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                    STAGE {step.step}
                  </span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 3 }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.4 }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SELECTABLE SPECIMEN TABS ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
        {specimens.map((sp, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={sp.code}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              style={{
                background: isSelected ? "rgba(163, 230, 53, 0.2)" : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${isSelected ? "#a3e635" : "rgba(255, 255, 255, 0.1)"}`,
                color: isSelected ? "#fefce8" : "rgba(255, 255, 255, 0.65)",
                borderRadius: 10,
                padding: "9px 16px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: isSelected ? "#bef264" : "rgba(255,255,255,0.4)" }}>{sp.id}:</span>
              <span>{sp.name.split("(")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ── 2-COLUMN PASSPORT DOSSIER & IRS EXPLAINABILITY PANEL ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 22 }}>
        
        {/* CARD 1: VERIFIED MATERIAL PASSPORT */}
        <div
          style={{
            background: "rgba(10, 24, 20, 0.75)",
            border: "1px solid rgba(163, 230, 53, 0.25)",
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 10,
                  background: "rgba(163, 230, 53, 0.15)",
                  color: "#bef264",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                {currentItem.code} · {currentItem.id}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.16)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#34d399",
                  fontWeight: 600,
                }}
              >
                ✓ VERIFIED PASSPORT DATA
              </span>
            </div>

            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#ffffff", margin: "0 0 6px" }}>
              {currentItem.name}
            </h4>
            <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
              Origin: {currentItem.origin} · Category: {currentItem.category}
            </div>

            {/* Spec Matrix Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>MATERIAL: </span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentItem.materialType}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>CONDITION: </span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{currentItem.condition.split("(")[0]}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>DISASSEMBLY: </span>
                <span style={{ color: "#bef264", fontWeight: 700 }}>{currentItem.disassemblyEase.split("(")[0]}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>EMBODIED CO₂e: </span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>{currentItem.carbonAvoided}</span>
              </div>
            </div>

            {/* Elemental Composition Spectrum */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255,255,255,0.65)", marginBottom: 6, fontWeight: 700 }}>
                ELEMENTAL COMPOSITION & REUSABILITY:
              </div>
              
              <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                {currentItem.composition.map((c, i) => (
                  <div key={i} style={{ width: `${c.pct}%`, background: c.color }} />
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {currentItem.composition.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ffffff" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.color }} />
                      <span>{c.material} ({c.pct}%)</span>
                    </div>
                    <span style={{ color: "#a3e635" }}>{c.notes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: 12,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>LIFECYCLE: {currentItem.lifecycleInfo}</span>
            <span>SAFETY: {currentItem.toxins.split("·")[0]}</span>
          </div>
        </div>

        {/* CARD 2: EXPLAINABLE INNOVATION READINESS SCORE (IRS) */}
        <div
          style={{
            background: "rgba(10, 24, 20, 0.75)",
            border: "1px solid rgba(163, 230, 53, 0.25)",
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#a3e635", textTransform: "uppercase" }}>
                  DECISION SUPPORT INDEX
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  Innovation Readiness Score (IRS)
                </div>
              </div>

              {/* Total Score Circle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(163, 230, 53, 0.16)",
                  border: "2px solid #a3e635",
                  boxShadow: "0 0 16px rgba(163, 230, 53, 0.35)",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 26,
                  color: "#fefce8",
                }}
              >
                {currentItem.irsScore}
              </div>
            </div>

            {/* 4 Explainable Criteria Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
              {currentItem.irsCriteria.map((crit, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: 9,
                    padding: "7px 12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#ffffff" }}>
                      {crit.name}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#bef264" }}>
                      {crit.score} / 100
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ width: `${crit.score}%`, height: "100%", background: "#a3e635", borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {crit.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Destination Department Match */}
            <div
              style={{
                background: "rgba(163, 230, 53, 0.08)",
                border: "1px solid rgba(163, 230, 53, 0.2)",
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
              }}
            >
              <div style={{ color: "#bef264", fontWeight: 700, marginBottom: 2 }}>RECOMMENDED INTRA-CAMPUS TRANSFER:</div>
              <div style={{ color: "#ffffff", fontWeight: 600 }}>{currentItem.matchedDept}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{currentItem.matchedLead}</div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              paddingTop: 8,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            SCORING ENGINE: Verified Multi-Attribute Decision Model
          </div>
        </div>

      </div>

      {/* Real-time Circular Event Log Stream */}
      <div
        style={{
          background: "rgba(3, 10, 8, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE CIRCULAR DECISION TELEMETRY STREAM</span>
          <span>CAMPUS REGISTRY V2.4</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#a3e635" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE DNA DATA STORAGE & AI DECODER SIMULATOR COMPONENT
// ─────────────────────────────────────────────────────────────
function DnaHelixSimulator({ accentColor, accentRGB }) {
  const records = [
    {
      id: "REC-EHR-8841",
      name: "Longitudinal Cardiology EHR Clinical Record",
      type: "JSON / FHIR Protocol",
      origSize: "148.2 KB",
      compSize: "44.6 KB (Brotli)",
      ratio: "3.32 : 1",
      ntCount: "178,400 Bases",
      theoreticalMass: "0.00000029 g DNA",
      estimatedHalfLife: "> 1,200 Years (at -18°C)",
      sequencePreview: ["A", "C", "T", "G", "C", "A", "T", "G", "A", "T", "C", "G", "A", "C", "T", "G", "A", "T", "C", "G", "T", "A", "G", "C"],
      cipherDigest: "sha256: 9f8a...c02e",
      deterministicBER: "Fails at > 2.5% noise (Packet Loss 28.4%)",
      aiNeuralBER: "99.85% Bit Recovery (Bi-LSTM Attention)",
    },
    {
      id: "REC-DCM-1204",
      name: "High-Resolution Neuro MRI DICOM Header & Voxel",
      type: "DICOM Medical Imaging",
      origSize: "392.0 KB",
      compSize: "115.3 KB (Brotli)",
      ratio: "3.40 : 1",
      ntCount: "461,200 Bases",
      theoreticalMass: "0.00000076 g DNA",
      estimatedHalfLife: "> 1,500 Years (Silicon Hermetic)",
      sequencePreview: ["T", "G", "C", "A", "G", "T", "A", "C", "G", "T", "A", "T", "C", "G", "T", "A", "C", "A", "T", "G", "A", "C", "G", "T"],
      cipherDigest: "sha256: 4b1d...88f1",
      deterministicBER: "Fails at > 3.0% noise (Frame Drift 34.2%)",
      aiNeuralBER: "99.62% Bit Recovery (Bi-LSTM Attention)",
    },
    {
      id: "REC-VCF-9410",
      name: "Whole-Exome Genomic Oncology Variant Calls",
      type: "VCF Bio-Registry",
      origSize: "512.4 KB",
      compSize: "146.4 KB (Brotli)",
      ratio: "3.50 : 1",
      ntCount: "585,600 Bases",
      theoreticalMass: "0.00000097 g DNA",
      estimatedHalfLife: "> 2,000 Years (Synthetic Silica)",
      sequencePreview: ["G", "A", "T", "C", "A", "T", "G", "C", "A", "G", "T", "A", "C", "G", "T", "A", "T", "C", "G", "A", "C", "T", "G", "A"],
      cipherDigest: "sha256: 7e32...91aa",
      deterministicBER: "Fails at > 2.2% noise (Corrupted Hash)",
      aiNeuralBER: "99.91% Bit Recovery (Bi-LSTM Attention)",
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentRec = records[selectedIdx];
  const [noiseSimulated, setNoiseSimulated] = useState(false);
  const [aiDecoded, setAiDecoded] = useState(false);

  const [logs, setLogs] = useState([
    { time: "16:14:02", event: "Brotli compression: 148.2 KB -> 44.6 KB (3.32:1 compaction ratio).", type: "comp" },
    { time: "16:14:05", event: "AES-256-GCM authenticated cipher payload synthesized.", type: "sec" },
    { time: "16:14:08", event: "Goldman rotational mapping: 178,400 bases generated (0 homopolymers).", type: "dna" },
    { time: "16:14:12", event: "Simulated archival density: ~215 Petabytes per gram certified.", type: "storage" },
  ]);

  const simulateNoise = () => {
    setNoiseSimulated(true);
    setAiDecoded(false);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🧪 Injected 5.8% Nanopore read noise (substitutions & indels).`, type: "warn" },
      { time, event: `⚠️ Deterministic Reed-Solomon Decoder: CRC failed due to nucleotide frame drift.`, type: "warn" },
      ...prev.slice(0, 5)
    ]);
  };

  const simulateAiDecode = () => {
    setAiDecoded(true);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🤖 Neural Bi-LSTM Decoder executed: Learned context vectors restored base alignment.`, type: "ai" },
      { time, event: `✓ Decompressed file verified against original: 100.0% SHA-256 byte match.`, type: "success" },
      ...prev.slice(0, 5)
    ]);
  };

  const simulateExportFasta = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `📋 FASTA sequence strand exported for #${currentRec.id} (${currentRec.ntCount}).`, type: "dna" },
      ...prev.slice(0, 5)
    ]);
  };

  const getNucleotideColor = (base) => {
    switch (base) {
      case "A": return { bg: "rgba(16, 185, 129, 0.2)", border: "#10b981", text: "#6ee7b7" }; // Adenine
      case "T": return { bg: "rgba(244, 63, 94, 0.2)", border: "#f43f5e", text: "#fda4af" };  // Thymine
      case "G": return { bg: "rgba(245, 158, 11, 0.2)", border: "#f59e0b", text: "#fcd34d" };  // Guanine
      case "C": default: return { bg: "rgba(6, 182, 212, 0.2)", border: "#06b6d4", text: "#67e8f9" }; // Cytosine
    }
  };

  return (
    <div
      style={{
        background: "rgba(14, 10, 26, 0.82)",
        border: `1px solid rgba(${accentRGB}, 0.32)`,
        borderRadius: 24,
        padding: "28px 24px",
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(${accentRGB}, 0.06)`,
        marginTop: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tactical Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#a855f7",
              boxShadow: "0 0 12px #a855f7",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Interactive DNA Storage & AI Error-Correction Simulator
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
              Computational Synthetic DNA Archival Pipeline & Neural Recovery Benchmarking
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={simulateNoise}
            style={{
              background: "rgba(244, 63, 94, 0.16)",
              border: "1px solid rgba(244, 63, 94, 0.35)",
              color: "#fda4af",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244, 63, 94, 0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244, 63, 94, 0.16)"; }}
          >
            🧪 Inject Nanopore Noise (5%)
          </button>
          <button
            type="button"
            onClick={simulateAiDecode}
            style={{
              background: `rgba(${accentRGB}, 0.2)`,
              border: `1px solid ${accentColor}`,
              color: "#e9d5ff",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.32)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.2)`; }}
          >
            🤖 Run Neural Bi-LSTM Decoder
          </button>
          <button
            type="button"
            onClick={simulateExportFasta}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            📋 Export FASTA Strand
          </button>
        </div>
      </div>

      {/* Record Selector Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {records.map((rec, idx) => (
          <button
            key={rec.id}
            type="button"
            onClick={() => {
              setSelectedIdx(idx);
              setNoiseSimulated(false);
              setAiDecoded(false);
            }}
            style={{
              background: selectedIdx === idx ? `rgba(${accentRGB}, 0.24)` : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${selectedIdx === idx ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
              color: selectedIdx === idx ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
              borderRadius: 10,
              padding: "8px 16px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {rec.type.split(" ")[0]} · {rec.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* 2-Column DNA Strand & Decoder Benchmark Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 }}>
        
        {/* CARD 1: SYNTHETIC DNA STRAND & COMPRESSION */}
        <div
          style={{
            background: "rgba(18, 12, 32, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: `rgba(${accentRGB}, 0.16)`,
                  color: "#d8b4fe",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                {currentRec.id}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                ✓ ZERO HOMOPOLYMERS
              </span>
            </div>

            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#ffffff", margin: "0 0 6px" }}>
              {currentRec.name}
            </h4>
            <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
              Format: {currentRec.type} · Cryptographic Hash: {currentRec.cipherDigest}
            </div>

            {/* Nucleotide Visualizer Strand */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 8, fontWeight: 600 }}>
                Synthesized Nucleotide Strand (A, T, G, C Mapping):
              </div>
              
              {/* Nucleotide Base Sequence Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {currentRec.sequencePreview.map((base, bIdx) => {
                  const style = getNucleotideColor(base);
                  const isCorrupted = noiseSimulated && (bIdx === 4 || bIdx === 11 || bIdx === 18);
                  return (
                    <div
                      key={bIdx}
                      style={{
                        width: 28,
                        height: 32,
                        borderRadius: 6,
                        background: isCorrupted ? "rgba(239, 68, 68, 0.35)" : style.bg,
                        border: `1px solid ${isCorrupted ? "#ef4444" : style.border}`,
                        color: isCorrupted ? "#fca5a5" : style.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                        fontWeight: 800,
                        transition: "all 0.3s ease",
                      }}
                      title={isCorrupted ? "Base substitution error from simulated sequencing read" : `Base: ${base}`}
                    >
                      {isCorrupted ? "?" : base}
                    </div>
                  );
                })}
              </div>

              {/* Nucleotide Legend */}
              <div style={{ display: "flex", gap: 14, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.6)" }}>
                <span><strong style={{ color: "#10b981" }}>A:</strong> Adenine</span>
                <span><strong style={{ color: "#f43f5e" }}>T:</strong> Thymine</span>
                <span><strong style={{ color: "#f59e0b" }}>G:</strong> Guanine</span>
                <span><strong style={{ color: "#06b6d4" }}>C:</strong> Cytosine</span>
              </div>
            </div>
          </div>

          {/* Biostorage Telemetry Cards */}
          <div
            style={{
              padding: "12px 14px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
            }}
          >
            <div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 2 }}>ORIGINAL → BROTLI</div>
              <div style={{ color: "#d8b4fe", fontWeight: 700, fontSize: 12 }}>{currentRec.origSize} → {currentRec.compSize}</div>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 2 }}>ESTIMATED PHYSICAL MASS</div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 12 }}>{currentRec.theoreticalMass}</div>
            </div>
          </div>
        </div>

        {/* CARD 2: AI NEURAL DECODER VS DETERMINISTIC BENCHMARK */}
        <div
          style={{
            background: "rgba(18, 12, 32, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#d8b4fe", textTransform: "uppercase" }}>
                  RESEARCH BENCHMARK
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  AI Neural vs. Deterministic Decoding
                </div>
              </div>

              {/* Status Pill */}
              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: aiDecoded ? "rgba(16, 185, 129, 0.16)" : (noiseSimulated ? "rgba(239, 68, 68, 0.16)" : `rgba(${accentRGB}, 0.16)`),
                  border: `1px solid ${aiDecoded ? "#10b981" : (noiseSimulated ? "#ef4444" : accentColor)}`,
                  color: aiDecoded ? "#34d399" : (noiseSimulated ? "#fca5a5" : "#e9d5ff"),
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {aiDecoded ? "AI RECOVERY: 99.85%" : (noiseSimulated ? "READ NOISE DETECTED" : "BASELINE READ: 100%")}
              </div>
            </div>

            {/* Comparison Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {/* Deterministic */}
              <div
                style={{
                  background: noiseSimulated && !aiDecoded ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${noiseSimulated && !aiDecoded ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.06)"}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#ffffff" }}>
                    Standard Deterministic Decoder (Reed-Solomon)
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: noiseSimulated && !aiDecoded ? "#ef4444" : "rgba(255,255,255,0.6)" }}>
                    {noiseSimulated && !aiDecoded ? "FAIL ❌" : "PASS ✓"}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
                  {noiseSimulated && !aiDecoded ? "Frame-shift error: Indel mutations broke byte alignment. Recovery aborted." : "Deterministic mapping verifies 100% when no physical sequencing errors exist."}
                </div>
              </div>

              {/* AI Bi-LSTM */}
              <div
                style={{
                  background: aiDecoded ? "rgba(16, 185, 129, 0.1)" : "rgba(168, 85, 247, 0.08)",
                  border: `1px solid ${aiDecoded ? "rgba(16, 185, 129, 0.35)" : "rgba(168, 85, 247, 0.25)"}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#e9d5ff" }}>
                    AI-Assisted Neural Decoder (Bi-LSTM + Attention)
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#34d399", fontWeight: 700 }}>
                    {aiDecoded ? "RECOVERED ✓" : "READY"}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
                  {aiDecoded ? "Learned probability distribution successfully corrected 3 indel shifts, restoring 100% of the original medical payload." : "Trained to identify transition-transversion mutations and resolve frameshift ambiguities."}
                </div>
              </div>
            </div>
          </div>

          {/* Research Metric Footer */}
          <div
            style={{
              padding: "10px 14px",
              background: `rgba(${accentRGB}, 0.08)`,
              border: `1px solid rgba(${accentRGB}, 0.2)`,
              borderRadius: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ color: "#d8b4fe", fontWeight: 700 }}>AI ACCURACY GAIN: </span>
              <span style={{ color: "#ffffff" }}>+22.4% over baseline</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>
              DENSITY: 1.85 bits/base
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Bio-Archival Log Stream */}
      <div
        style={{
          background: "rgba(6, 4, 14, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE COMPUTATIONAL BIO-STORAGE LOG STREAM</span>
          <span>HELIX PIPELINE V3.1</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#c084fc" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE ORCHESTRA LIVING BELIEF GRAPH SIMULATOR
// ─────────────────────────────────────────────────────────────
function OrchestraBeliefGraphSimulator({ accentColor, accentRGB }) {
  const nodes = [
    {
      id: "CLAIM-PO-881",
      label: "Claim: 1,200 MT Invoiced vs 940 MT Weighbridge Delivery",
      type: "claim",
      status: "⚠️ FLAGGED DISCREPANCY (-260 MT)",
      statusColor: "#f59e0b",
      confidence: "98.2% Discrepancy Confidence",
      discrepancyVal: "-$312,000 Unverified (260 MT Shortfall)",
      whyFlagged: "Commercial Tax Invoice #INV-2025-1044 bills for 1,200 MT structural steel, but physical security gate scale tickets log only 940 MT received across 24 trucks.",
      supportingEvidence: "ERP Purchase Order PO-2025-098 ($1,440,000 authorized allocation).",
      conflictingRecord: "Physical Weighbridge Tickets #WB-9901..9924 (Sum: 940.0 MT delivered at Site Gate 4).",
      implications: "Phase 2 crane lifting window commences in 14 days. Unverified tonnage will halt structural erection schedule.",
      coords: { x: 50, y: 35 },
    },
    {
      id: "CLAIM-CERT-410",
      label: "Claim: ISO 14001 Recycled Scrap Metallurgy Standard",
      type: "claim",
      status: "✓ COMPLIANCE VERIFIED",
      statusColor: "#10b981",
      confidence: "99.4% Verified on Bureau Veritas Key",
      discrepancyVal: "Pass (Zero Exposure)",
      whyFlagged: "Digital certificate cryptographically signed by accredited issuing body matching mill batch #MB-4029.",
      supportingEvidence: "Bureau Veritas Digital Certificate #BV-ENV-2024 (sha256 signed).",
      conflictingRecord: "None. All third-party alloy assays match mill test reports.",
      implications: "Fulfills Green Building Council LEED Platinum procurement clause with zero compliance penalty.",
      coords: { x: 78, y: 22 },
    },
    {
      id: "VENDOR-TITAN",
      label: "Vendor: Titan Metallurgy Corp (Tier 1 Mill)",
      type: "vendor",
      status: "UNDER INVESTIGATION (1 Flag)",
      statusColor: "#f59e0b",
      confidence: "Historic On-Time Fulfillment: 91.4%",
      discrepancyVal: "Active Vendor Dispute",
      whyFlagged: "Vendor has maintained a 91.4% 3-year performance record, but recent quarterly orders show recurring delivery variance.",
      supportingEvidence: "Tier 1 Master Service Agreement #MSA-2023-018 signed with Titan Metallurgy Corp.",
      conflictingRecord: "Prior delivery slip #WB-9210 logged a 4.2% weight shortfall in Q2 2025.",
      implications: "Payment milestone withheld pending physical gate re-inspection and signed credit note.",
      coords: { x: 22, y: 22 },
    },
    {
      id: "DOC-INV-1044",
      label: "Document: Commercial Tax Invoice #INV-2025-1044",
      type: "document",
      status: "PAYMENT RESERVED (Withheld $312,000)",
      statusColor: "#f59e0b",
      confidence: "Document Digest: sha256: 4e9a...b10c",
      discrepancyVal: "$1,440,000 Billed ($312,000 Flagged)",
      whyFlagged: "Automated 3-way matching failed between PO, Invoice, and Receiving Gate Records.",
      supportingEvidence: "Uploaded PDF invoice matches vendor tax identification number.",
      conflictingRecord: "Quantity mismatch: Billed 1,200 MT vs Received 940 MT.",
      implications: "Automated payment release blocked by human-in-the-loop compliance rule.",
      coords: { x: 28, y: 65 },
    },
    {
      id: "DEP-PHASE2",
      label: "Milestone: Phase 2 Structural Steel Erection",
      type: "dependency",
      status: "⚠️ CRITICAL PATH MILESTONE AT RISK",
      statusColor: "#ef4444",
      confidence: "Schedule Buffer: 14 Days Remaining",
      discrepancyVal: "Potential 2-Week Site Delay",
      whyFlagged: "Downstream crane mobilization requires certified delivery of all 1,200 MT before foundation assembly.",
      supportingEvidence: "Project Master Schedule #PMS-REV-4 (Target start: Nov 12, 2025).",
      conflictingRecord: "Missing 260 MT structural columns halts upper girder mounting.",
      implications: "Contractual liquidated damages clause triggered if milestone is delayed past Nov 26, 2025.",
      coords: { x: 72, y: 65 },
    },
  ];

  const [selectedNodeId, setSelectedNodeId] = useState("CLAIM-PO-881");
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const [logs, setLogs] = useState([
    { time: "09:30:14", event: "Belief Graph initialized: 5 nodes, 6 semantic relationship edges compiled.", type: "sys" },
    { time: "09:30:18", event: "3-Way Match discrepancy detected on #CLAIM-PO-881: 260 MT unverified ($312,000).", type: "warn" },
    { time: "09:30:22", event: "Downstream impact evaluated: Milestone #DEP-PHASE2 flagged at critical path risk.", type: "risk" },
    { time: "09:30:26", event: "Human-in-the-loop gate active: Payment release withheld pending officer signoff.", type: "auth" },
  ]);

  const triggerReconcile = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `⚖️ Vendor reconciliation request dispatched to Titan Metallurgy Corp for #CLAIM-PO-881.`, type: "warn" },
      { time, event: `📋 Requesting revised credit memo for -$312,000 or bill of lading proof for 260 MT shortfall.`, type: "sys" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerInspectGate = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🔍 Physical Gate 4 Weighbridge tickets #WB-9901..9924 inspected & OCR checksum re-verified.`, type: "auth" },
      { time, event: `✓ Gross weight confirms 940 MT tare weight verified. Shortfall of 260 MT firmly established.`, type: "risk" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerOfficerOverride = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `✅ Human Procurement Officer Override authenticated: Partial payment of $1,128,000 released for 940 MT.`, type: "auth" },
      { time, event: `🔒 Audit trail logged to immutable procurement ledger (sha256 signed).`, type: "sys" },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(10, 14, 22, 0.9)",
        border: "1px solid rgba(245, 158, 11, 0.35)",
        borderRadius: 24,
        padding: "30px 24px",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8), inset 0 0 80px rgba(245, 158, 11, 0.05)",
        marginTop: 36,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── TOP ENTERPRISE COMMAND BAR ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          paddingBottom: 22,
          borderBottom: "1px solid rgba(255, 255, 255, 0.09)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#f59e0b",
              boxShadow: "0 0 16px #f59e0b",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "#ffffff",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>ORCHESTRA: LIVING BELIEF GRAPH PROCUREMENT INTELLIGENCE</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "rgba(245, 158, 11, 0.2)",
                  border: "1px solid rgba(245, 158, 11, 0.5)",
                  color: "#fcd34d",
                  fontWeight: 700,
                }}
              >
                1 DISCREPANCY FLAGGED
              </span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              Living Graph Topology · Traceable Evidence Chains · Human-in-the-Loop Procurement Controls
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={triggerReconcile}
            style={{
              background: "rgba(245, 158, 11, 0.18)",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              color: "#fcd34d",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245, 158, 11, 0.32)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245, 158, 11, 0.18)"; }}
          >
            ⚖️ Reconcile Claim
          </button>
          <button
            type="button"
            onClick={triggerInspectGate}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            🔍 Inspect Gate Logs
          </button>
          <button
            type="button"
            onClick={triggerOfficerOverride}
            style={{
              background: "rgba(16, 185, 129, 0.16)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#6ee7b7",
              borderRadius: 8,
              padding: "8px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.16)"; }}
          >
            ✅ Partial Officer Approval
          </button>
        </div>
      </div>

      {/* ── 2-COLUMN LIVING BELIEF GRAPH & EVIDENCE INSPECTION PANEL ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 24, marginBottom: 24 }}>
        
        {/* LEFT: LIVING BELIEF GRAPH CANVAS */}
        <div
          style={{
            position: "relative",
            minHeight: 380,
            borderRadius: 20,
            background: "radial-gradient(circle at 50% 50%, rgba(18, 24, 38, 0.95) 0%, rgba(6, 10, 18, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            overflow: "hidden",
            boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* Subtle Grid & Directional Vectors */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255, 255, 255, 0.04)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255, 255, 255, 0.04)" }} />
            <span style={{ position: "absolute", top: 12, left: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>
              GRAPH TOPOLOGY · NEO4J / NETWORKX SEMANTIC MODEL
            </span>
          </div>

          {/* SVG Directional Edges */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {/* Vendor -> Invoice */}
            <line x1="22%" y1="22%" x2="28%" y2="65%" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" strokeDasharray="4 3" />
            {/* Invoice -> Flagged Claim */}
            <line x1="28%" y1="65%" x2="50%" y2="35%" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 3" />
            {/* Vendor -> Compliance Certificate Claim */}
            <line x1="22%" y1="22%" x2="78%" y2="22%" stroke="rgba(16, 185, 129, 0.45)" strokeWidth="2" />
            {/* Flagged Claim -> Milestone Dependency */}
            <line x1="50%" y1="35%" x2="72%" y2="65%" stroke="#ef4444" strokeWidth="3" strokeDasharray="5 3" />
          </svg>

          {/* Interactive Graph Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isFlagged = node.status.includes("FLAGGED") || node.status.includes("RISK");

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  position: "absolute",
                  left: `${node.coords.x}%`,
                  top: `${node.coords.y}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  zIndex: isSelected ? 30 : 20,
                }}
              >
                {/* Node Beacon */}
                <div
                  style={{
                    position: "relative",
                    width: isSelected ? 22 : 18,
                    height: isSelected ? 22 : 18,
                    borderRadius: "50%",
                    background: node.statusColor,
                    boxShadow: isSelected ? `0 0 24px ${node.statusColor}` : `0 0 12px ${node.statusColor}`,
                    border: isSelected ? "3px solid #ffffff" : "2px solid rgba(255,255,255,0.7)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {isFlagged && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        border: `2px solid ${node.statusColor}`,
                        animation: "ping 1.4s infinite",
                      }}
                    />
                  )}
                </div>

                {/* Node Label Pill */}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                    marginTop: 6,
                    whiteSpace: "nowrap",
                    background: isSelected ? "rgba(217, 119, 6, 0.95)" : "rgba(6, 12, 22, 0.9)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: `1px solid ${isSelected ? "#f59e0b" : "rgba(255, 255, 255, 0.15)"}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {node.id}
                </span>
              </div>
            );
          })}

          {/* Graph Legend */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(3, 7, 18, 0.85)",
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
          >
            <span style={{ color: "#f59e0b" }}>● Billed vs Delivered Discrepancy</span>
            <span style={{ color: "#10b981" }}>● Compliance Verified</span>
            <span style={{ color: "#ef4444" }}>● Milestone Critical Path at Risk</span>
          </div>
        </div>

        {/* RIGHT: EVIDENCE INSPECTION DOSSIER */}
        <div
          style={{
            background: "rgba(14, 20, 32, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 20,
            padding: "22px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: "rgba(245, 158, 11, 0.16)",
                  color: "#fcd34d",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                EVIDENCE INSPECTION PANEL
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: selectedNode.statusColor,
                  fontWeight: 700,
                }}
              >
                ● {selectedNode.status}
              </span>
            </div>

            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff", margin: "0 0 6px" }}>
              {selectedNode.label}
            </h3>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
              CONFIDENCE INTERVAL: {selectedNode.confidence}
            </div>

            {/* Why This Claim Was Flagged */}
            <div
              style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              <div style={{ color: "#fcd34d", fontWeight: 700, fontSize: 10, marginBottom: 4 }}>
                WHY THIS RECORD WAS FLAGGED (EXPLAINABLE AUDIT):
              </div>
              <div style={{ color: "#ffffff" }}>{selectedNode.whyFlagged}</div>
            </div>

            {/* Side-by-side Evidence vs Conflicting Records */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>
                <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 2 }}>SUPPORTING RECORD:</div>
                <div style={{ color: "rgba(255,255,255,0.75)" }}>{selectedNode.supportingEvidence}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>
                <div style={{ color: "#f87171", fontWeight: 700, marginBottom: 2 }}>CONFLICTING RECORD:</div>
                <div style={{ color: "rgba(255,255,255,0.75)" }}>{selectedNode.conflictingRecord}</div>
              </div>
            </div>

            {/* Downstream Implications */}
            <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px 12px", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>DOWNSTREAM IMPLICATION: </span>
              <span style={{ color: "#fcd34d" }}>{selectedNode.implications}</span>
            </div>
          </div>

          <div
            style={{
              paddingTop: 12,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            <span>DISCREPANCY EXPOSURE: {selectedNode.discrepancyVal}</span>
            <span>AUDIT TRAIL: SHA-256 SIGNED</span>
          </div>
        </div>

      </div>

      {/* ── REAL-TIME GRAPH TELEMETRY LOG STREAM ── */}
      <div
        style={{
          background: "rgba(6, 10, 16, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE BELIEF GRAPH & ENTITY RESOLUTION TELEMETRY STREAM</span>
          <span>ORCHESTRA CORE V3.2</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#f59e0b" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE KISAAN VAANI HINDI VOICE & FARM ANALYTICS SIMULATOR
// ─────────────────────────────────────────────────────────────
function KisaanVaaniSimulator({ accentColor, accentRGB }) {
  const voiceQueries = [
    {
      id: "Q1",
      title: "१. खाद व्यय (₹2,500 Expense)",
      queryHindi: "२५०० रुपये यूरिया खाद के लिए दर्ज करो",
      queryPhonetic: "2500 rupaye urea khaad ke liye darj karo",
      intent: "EXPENSE_LOGGING",
      category: "खाद (Fertilizer)",
      amount: "₹2,500",
      ttsSpokenResponse: "आपका ₹२,५०० का यूरिया खाद खर्च सफलतापूर्वक दर्ज कर लिया गया है। इस महीने का कुल कृषि खर्च ₹८,४०० है।",
      sqliteQuery: "INSERT INTO farm_expenses (date, category, amount, notes) VALUES ('2025-10-25', 'Fertilizer', 2500, 'Urea');",
      farmStatus: "Ledger Synced · SQLite Cache Updated",
      analyticsSlice: { fertilizer: 42, labor: 25, seeds: 18, irrigation: 15 },
    },
    {
      id: "Q2",
      title: "२. पत्ती धब्बा रोग (Leaf Spot Disease)",
      queryHindi: "टमाटर की फसल में पत्ती धब्बा रोग के उपचार क्या हैं?",
      queryPhonetic: "Tamatar ki fasal mein patti dhabba rog ke upchar kya hain?",
      intent: "CROP_DISEASE_ADVISORY",
      category: "रोग प्रबंधन (Disease Control)",
      amount: "निशुल्क सलाह (Advisory)",
      ttsSpokenResponse: "पत्ती धब्बा रोग (Leaf Spot) के लिए कॉपर ऑक्सीक्लोराइड ३ ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें। जलभराव से बचें।",
      sqliteQuery: "SELECT treatment, dosage FROM crop_advisories WHERE disease='Leaf Spot' AND crop='Tomato';",
      farmStatus: "Advisory Loaded · ICAR Guideline Matched",
      analyticsSlice: { fertilizer: 38, labor: 29, seeds: 18, irrigation: 15 },
    },
    {
      id: "Q3",
      title: "३. सिंचाई योजना (Irrigation Weather)",
      queryHindi: "अगले ३ दिनों में गेहूँ की सिंचाई करनी चाहिए या नहीं?",
      queryPhonetic: "Agle 3 dinon mein gehun ki sinchai karni chahiye ya nahi?",
      intent: "IRRIGATION_SCHEDULE",
      category: "सिंचाई योजना (Irrigation)",
      amount: "मौसम पूर्वानुमान (Forecast)",
      ttsSpokenResponse: "कल रात भारी बारिश (२२ मिमी) की संभावना है। अभी गेहूं में सिंचाई स्थगित करने की सलाह दी जाती है।",
      sqliteQuery: "SELECT rain_prob, temp_c FROM weather_cache WHERE date >= CURRENT_DATE LIMIT 3;",
      farmStatus: "Precipitation Alert: 22mm Expected Tomorrow",
      analyticsSlice: { fertilizer: 42, labor: 30, seeds: 18, irrigation: 10 },
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentQuery = voiceQueries[selectedIdx];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const [logs, setLogs] = useState([
    { time: "10:18:22", event: "Flutter STT initialized: Locale set to 'hi_IN' (Hindi Audio Stream).", type: "stt" },
    { time: "10:18:24", event: "Speech recognized: '२५०० रुपये यूरिया खाद के लिए दर्ज करो'.", type: "voice" },
    { time: "10:18:25", event: "Intent parsed: EXPENSE_LOGGING -> Category: Fertilizer, Amount: ₹2,500.", type: "intent" },
    { time: "10:18:27", event: "SQLite executed: Local ledger committed via sqflite without internet.", type: "sqlite" },
    { time: "10:18:29", event: "flutter_tts synthesized: Spoken Hindi voice response queued to speaker.", type: "tts" },
  ]);

  const triggerVoiceInput = () => {
    setIsSpeaking(true);
    setIsLogged(false);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🎙️ Microphone active: Listening in Hindi (hi_IN acoustic model)...`, type: "stt" },
      { time, event: `⚡ STT matched: "${currentQuery.queryHindi}"`, type: "voice" },
      ...prev.slice(0, 5)
    ]);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 1200);
  };

  const triggerLogExpense = () => {
    setIsLogged(true);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `💾 sqflite: ${currentQuery.sqliteQuery}`, type: "sqlite" },
      { time, event: `📢 flutter_tts audio: "${currentQuery.ttsSpokenResponse.slice(0, 48)}..."`, type: "tts" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerPredictYield = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🌾 Python ML Model: Evaluating soil NPK (120:60:40) & seasonal rainfall (180mm).`, type: "ml" },
      { time, event: `✓ Crop Yield Predicted: 4.2 tons/hectare (R² = 0.88, Confidence = 93%).`, type: "ml" },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(24, 18, 6, 0.82)",
        border: `1px solid rgba(${accentRGB}, 0.32)`,
        borderRadius: 24,
        padding: "28px 24px",
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(${accentRGB}, 0.05)`,
        marginTop: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tactical Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#eab308",
              boxShadow: "0 0 12px #eab308",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Interactive Hindi Voice & Mobile Farm Analytics Simulator
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
              Flutter speech_to_text · Offline SQLite · flutter_tts Audio Synthesis · fl_chart
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={triggerVoiceInput}
            style={{
              background: isSpeaking ? "rgba(234, 179, 8, 0.35)" : "rgba(234, 179, 8, 0.16)",
              border: "1px solid rgba(234, 179, 8, 0.4)",
              color: "#fde047",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(234, 179, 8, 0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isSpeaking ? "rgba(234, 179, 8, 0.35)" : "rgba(234, 179, 8, 0.16)"; }}
          >
            🎙️ {isSpeaking ? "Listening..." : "Speak Query in Hindi"}
          </button>
          <button
            type="button"
            onClick={triggerLogExpense}
            style={{
              background: "rgba(16, 185, 129, 0.16)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#6ee7b7",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.16)"; }}
          >
            💰 Commit Expense (SQLite)
          </button>
          <button
            type="button"
            onClick={triggerPredictYield}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            🌾 Run Yield ML Model
          </button>
        </div>
      </div>

      {/* Query Selector Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {voiceQueries.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => {
              setSelectedIdx(idx);
              setIsSpeaking(false);
              setIsLogged(false);
            }}
            style={{
              background: selectedIdx === idx ? `rgba(${accentRGB}, 0.24)` : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${selectedIdx === idx ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
              color: selectedIdx === idx ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
              borderRadius: 10,
              padding: "8px 16px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* 2-Column Voice Interaction & Farm Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 }}>
        
        {/* CARD 1: HINDI VOICE INTERACTION & RECOGNITION */}
        <div
          style={{
            background: "rgba(28, 20, 8, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: `rgba(${accentRGB}, 0.16)`,
                  color: "#fde047",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                HINDI VOICE INPUT · hi_IN
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                ✓ OFFLINE SQLITE READY
              </span>
            </div>

            {/* Recognized Voice Transcript */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                Acoustic Transcript (speech_to_text):
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
                "{currentQuery.queryHindi}"
              </div>
              <div style={{ fontSize: 11, color: "#fde047", fontFamily: "'JetBrains Mono', monospace" }}>
                Phonetic: {currentQuery.queryPhonetic}
              </div>
            </div>

            {/* Extracted Entity Table */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
              }}
            >
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>INTENT: </span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentQuery.intent}</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>CATEGORY: </span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentQuery.category.split("(")[0]}</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>AMOUNT: </span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{currentQuery.amount}</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>STATUS: </span>
                <span style={{ color: isLogged ? "#34d399" : "#fde047", fontWeight: 700 }}>
                  {isLogged ? "COMMITTED ✅" : "PENDING"}
                </span>
              </div>
            </div>

            {/* TTS Audio Response Box */}
            <div
              style={{
                background: `rgba(${accentRGB}, 0.08)`,
                border: `1px solid rgba(${accentRGB}, 0.22)`,
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: 10.5, color: "#fde047", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3, fontWeight: 700 }}>
                📢 Spoken Audio Feedback (flutter_tts):
              </div>
              <div style={{ fontSize: 12.5, color: "#ffffff", lineHeight: 1.5 }}>
                "{currentQuery.ttsSpokenResponse}"
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>STORAGE: Local SQLite via sqflite</span>
            <span>PROVIDER: State Synchronized</span>
          </div>
        </div>

        {/* CARD 2: FARM DASHBOARD & CROP YIELD ML PREDICTOR */}
        <div
          style={{
            background: "rgba(28, 20, 8, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#fde047", textTransform: "uppercase" }}>
                  FARM DASHBOARD ANALYTICS
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  fl_chart Spending & Yield Model
                </div>
              </div>

              {/* Monthly Total Pill */}
              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "rgba(16, 185, 129, 0.16)",
                  border: "1px solid #10b981",
                  color: "#34d399",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                TOTAL: ₹8,400
              </div>
            </div>

            {/* fl_chart Expense Breakdown Bars */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 8, fontWeight: 600 }}>
                Seasonal Input Expenditure Distribution (fl_chart):
              </div>
              
              {/* Stacked Percentage Bar */}
              <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ width: `${currentQuery.analyticsSlice.fertilizer}%`, background: "#f59e0b" }} title="Fertilizer: 42%" />
                <div style={{ width: `${currentQuery.analyticsSlice.labor}%`, background: "#10b981" }} title="Labor: 25%" />
                <div style={{ width: `${currentQuery.analyticsSlice.seeds}%`, background: "#06b6d4" }} title="Seeds: 18%" />
                <div style={{ width: `${currentQuery.analyticsSlice.irrigation}%`, background: "#ec4899" }} title="Irrigation: 15%" />
              </div>

              {/* Category Legend */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#f59e0b" }}>■</span> खाद (Fertilizer): {currentQuery.analyticsSlice.fertilizer}%
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#10b981" }}>■</span> मजदूरी (Labor): {currentQuery.analyticsSlice.labor}%
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#06b6d4" }}>■</span> बीज (Seeds): {currentQuery.analyticsSlice.seeds}%
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#ec4899" }}>■</span> सिंचाई (Irrigation): {currentQuery.analyticsSlice.irrigation}%
                </div>
              </div>
            </div>

            {/* Python ML Yield Predictor Box */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: 12,
                padding: "12px 14px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#ffffff" }}>
                  🐍 Python Yield Prediction Artifact
                </span>
                <span style={{ fontSize: 10, color: "#34d399", fontWeight: 700 }}>
                  R² = 0.88 ACCURACY
                </span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5, marginBottom: 8 }}>
                Regression inputs: Soil NPK (120:60:40) · Rainfall (180 mm) · Field Area (2.5 Acres)
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: `rgba(${accentRGB}, 0.1)`, padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "#fde047", fontSize: 11, fontWeight: 700 }}>PREDICTED YIELD (गेहूँ / Wheat):</span>
                <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 800 }}>4.2 tons / hectare</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>MODEL: scikit-learn Serialized Artifact</span>
            <span>STATUS: Code-level Verified</span>
          </div>
        </div>

      </div>

      {/* Real-time Flutter & SQLite Log Stream */}
      <div
        style={{
          background: "rgba(10, 8, 2, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE FLUTTER & SQLITE CLIENT TELEMETRY STREAM</span>
          <span>MAD_KISAANVAANI REPOSITORY V1.2</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#eab308" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE BREAST CANCER DETECTION & ONCOLOGY CDSS SIMULATOR
// ─────────────────────────────────────────────────────────────
function OncoPilotCdssSimulator({ accentColor, accentRGB }) {
  const patientCases = [
    {
      id: "PT-BC-408",
      name: "Patient #BC-408 (Invasive Ductal Carcinoma)",
      age: 54,
      stage: "Stage IIA (cT2 N0 M0)",
      tumorSize: "2.2 cm",
      nodes: "0 / 3 Positive (N0)",
      er: "Positive (85%)",
      pr: "Positive (65%)",
      her2: "Negative (IHC 1+)",
      ki67: "16% (Low Proliferation)",
      predictedSubtype: "Luminal A (Hormone Receptor Positive)",
      confidence: "96.4%",
      recurrenceScore: "14 (Low Risk of Distant Recurrence)",
      pathwayGuidelines: "NCCN Breast v4.2025: Adjuvant Endocrine Therapy indicated (Tamoxifen / Aromatase Inhibitors for 5-10 yrs). Low benefit from adjuvant chemotherapy.",
      matchedTrial: "NCT04523675 — Endocrine Duration Optimization in Low-Risk Luminal A",
    },
    {
      id: "PT-BC-712",
      name: "Patient #BC-712 (HER2-Enriched Carcinoma)",
      age: 48,
      stage: "Stage IIB (cT2 N1 M0)",
      tumorSize: "3.1 cm",
      nodes: "1 / 4 Positive (N1)",
      er: "Negative (0%)",
      pr: "Negative (0%)",
      her2: "Positive (IHC 3+ / FISH Amplified)",
      ki67: "45% (High Proliferation)",
      predictedSubtype: "HER2-Enriched Molecular Subtype",
      confidence: "95.2%",
      recurrenceScore: "Elevated Risk without Targeted Monoclonal Blockade",
      pathwayGuidelines: "NCCN Breast v4.2025: Dual HER2-targeted blockade (Trastuzumab + Pertuzumab) combined with taxane-based chemotherapy, followed by maintenance antibody therapy.",
      matchedTrial: "NCT05128471 — Novel HER2 Antibody-Drug Conjugate (ADC) Post-Neoadjuvant Trial",
    },
    {
      id: "PT-BC-920",
      name: "Patient #BC-920 (Triple-Negative Carcinoma)",
      age: 42,
      stage: "Stage IIA (cT2 N0 M0)",
      tumorSize: "2.6 cm",
      nodes: "0 / 2 Positive (N0)",
      er: "Negative (0%)",
      pr: "Negative (0%)",
      her2: "Negative (IHC 0)",
      ki67: "68% (Aggressive Proliferation)",
      predictedSubtype: "Triple-Negative Breast Cancer (TNBC)",
      confidence: "97.1%",
      recurrenceScore: "High Risk of Early Relapse",
      pathwayGuidelines: "NCCN Breast v4.2025: Neoadjuvant platinum-containing chemotherapy with immune checkpoint inhibitor (Pembrolizumab) consideration, followed by surgical resection.",
      matchedTrial: "NCT04892408 — Checkpoint Immunotherapy Combination in Primary TNBC",
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentCase = patientCases[selectedIdx];
  const [analyzed, setAnalyzed] = useState(true);
  const [trialMatched, setTrialMatched] = useState(false);

  const [logs, setLogs] = useState([
    { time: "14:22:04", event: "Pathology record ingested: Biomarkers ER, PR, HER2, Ki-67 extracted via BioBERT.", type: "nlp" },
    { time: "14:22:07", event: "Pydantic ClinicalInput validated: Zero conflicting contradictory attributes.", type: "valid" },
    { time: "14:22:10", event: "Gradient Boosting Classifier: Subtype categorized with 96.4% confidence.", type: "ml" },
    { time: "14:22:14", event: "CDSS Decision Engine: NCCN v4.2025 pathway matched (Non-prescriptive).", type: "cdss" },
  ]);

  const triggerAnalyze = () => {
    setAnalyzed(true);
    setTrialMatched(false);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🧪 Re-evaluating ${currentCase.name.split(" ")[0]}: Tumor ${currentCase.tumorSize}, Nodes ${currentCase.nodes}.`, type: "nlp" },
      { time, event: `✓ Subtype classified: ${currentCase.predictedSubtype} (${currentCase.confidence} confidence).`, type: "ml" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerMatchTrials = () => {
    setTrialMatched(true);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `🎯 ClinicalTrials.gov API queried: Stage ${currentCase.stage}, ${currentCase.predictedSubtype.split(" ")[0]}.`, type: "trial" },
      { time, event: `✓ Matched active open trial: ${currentCase.matchedTrial}.`, type: "trial" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerExportReport = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `📋 Clinical Decision Support summary exported for ${currentCase.id} with NCCN references.`, type: "cdss" },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(24, 10, 16, 0.82)",
        border: `1px solid rgba(${accentRGB}, 0.32)`,
        borderRadius: 24,
        padding: "28px 24px",
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(${accentRGB}, 0.05)`,
        marginTop: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tactical Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ec4899",
              boxShadow: "0 0 12px #ec4899",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Interactive Clinical Decision Support (CDSS) & Biomarker Classifier
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
              BioBERT Entity Extraction · Molecular Subtyping · NCCN-Aligned Decision Pathways
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={triggerAnalyze}
            style={{
              background: `rgba(${accentRGB}, 0.2)`,
              border: `1px solid ${accentColor}`,
              color: "#fbcfe8",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.32)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.2)`; }}
          >
            🧪 Re-Classify Subtype
          </button>
          <button
            type="button"
            onClick={triggerMatchTrials}
            style={{
              background: "rgba(16, 185, 129, 0.16)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#6ee7b7",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.16)"; }}
          >
            🎯 Match Clinical Trials
          </button>
          <button
            type="button"
            onClick={triggerExportReport}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            📋 Export CDSS Report
          </button>
        </div>
      </div>

      {/* Patient Case Selector Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {patientCases.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setSelectedIdx(idx);
              setTrialMatched(false);
            }}
            style={{
              background: selectedIdx === idx ? `rgba(${accentRGB}, 0.24)` : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${selectedIdx === idx ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
              color: selectedIdx === idx ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
              borderRadius: 10,
              padding: "8px 16px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {c.name.split("(")[0]}
          </button>
        ))}
      </div>

      {/* 2-Column Clinical Profile & Decision Support Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 }}>
        
        {/* CARD 1: EXTRACTED BIOMARKER & TUMOR PROFILE */}
        <div
          style={{
            background: "rgba(28, 14, 20, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: `rgba(${accentRGB}, 0.16)`,
                  color: "#fbcfe8",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                {currentCase.id} · {currentCase.stage}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                ✓ BIOMARKERS VALIDATED
              </span>
            </div>

            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#ffffff", margin: "0 0 6px" }}>
              {currentCase.name}
            </h4>
            <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
              Age: {currentCase.age} · Tumor: {currentCase.tumorSize} · Lymph Nodes: {currentCase.nodes}
            </div>

            {/* Biomarker Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
              }}
            >
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>ER RECEPTOR: </span>
                <span style={{ color: currentCase.er.includes("Positive") ? "#34d399" : "#fca5a5", fontWeight: 700 }}>
                  {currentCase.er}
                </span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>PR RECEPTOR: </span>
                <span style={{ color: currentCase.pr.includes("Positive") ? "#34d399" : "#fca5a5", fontWeight: 700 }}>
                  {currentCase.pr}
                </span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>HER2 STATUS: </span>
                <span style={{ color: currentCase.her2.includes("Positive") ? "#f43f5e" : "#06b6d4", fontWeight: 700 }}>
                  {currentCase.her2}
                </span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>Ki-67 INDEX: </span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentCase.ki67}</span>
              </div>
            </div>

            {/* Model Subtype Prediction Banner */}
            <div
              style={{
                background: `rgba(${accentRGB}, 0.1)`,
                border: `1px solid rgba(${accentRGB}, 0.25)`,
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10.5, color: "#fbcfe8", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  PREDICTED MOLECULAR SUBTYPE:
                </span>
                <span style={{ fontSize: 11, color: "#34d399", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  {currentCase.confidence} CONFIDENCE
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>
                {currentCase.predictedSubtype}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>ENGINE: oncopilot CDSS</span>
            <span>SCHEMA: Pydantic ClinicalProfile</span>
          </div>
        </div>

        {/* CARD 2: NCCN DECISION SUPPORT & CLINICAL TRIALS */}
        <div
          style={{
            background: "rgba(28, 14, 20, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#fbcfe8", textTransform: "uppercase" }}>
                  DECISION SUPPORT PATHWAY
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  Evidence-Based Guidance (NCCN v4.2025)
                </div>
              </div>

              <div
                style={{
                  padding: "5px 10px",
                  borderRadius: 14,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: 600,
                }}
              >
                NON-PRESCRIPTIVE
              </div>
            </div>

            {/* Recurrence Risk */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>
                ESTIMATED RECURRENCE RISK PROFILE:
              </div>
              <div style={{ fontSize: 12.5, color: "#ffffff", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                {currentCase.recurrenceScore}
              </div>
            </div>

            {/* Guideline Informational Pathway */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 10.5, color: "#fbcfe8", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 4 }}>
                📖 Guideline-Aligned Informational Resource:
              </div>
              <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.55 }}>
                {currentCase.pathwayGuidelines}
              </div>
            </div>

            {/* Clinical Trials Matching Panel */}
            <div
              style={{
                background: trialMatched ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${trialMatched ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.06)"}`,
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: trialMatched ? "#34d399" : "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {trialMatched ? "✓ ACTIVE CLINICAL TRIAL MATCHED:" : "CLINICAL TRIAL DISCOVERY:"}
                </span>
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                  ClinicalTrials.gov
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: "#ffffff", fontFamily: "'JetBrains Mono', monospace" }}>
                {currentCase.matchedTrial}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.45)",
              lineHeight: 1.4,
            }}
          >
            ⚠️ Medical Disclaimer: Model outputs are clinical decision support aids and do not independently determine therapy.
          </div>
        </div>

      </div>

      {/* Real-time CDSS Inference Log Stream */}
      <div
        style={{
          background: "rgba(10, 4, 8, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE ONCOLOGY CDSS INGESTION & INFERENCE LOG STREAM</span>
          <span>ONCOPILOT CDSS ENGINE V2.1</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#f472b6" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE INTERVIEW ACE PRO SIMULATOR COMPONENT
// ─────────────────────────────────────────────────────────────
function InterviewAceSimulator({ accentColor, accentRGB }) {
  const roles = [
    {
      id: "ROLE-SWE",
      title: "Senior Full-Stack Engineer",
      domain: "System Design & Distributed Scalability",
      question: "How would you design a distributed rate limiter for an API handling millions of concurrent requests? Walk me through your architecture and trade-offs.",
      candidateResponse: "I would implement a distributed Redis token-bucket algorithm with sliding-window logs. Client API keys are hashed and stored with sliding timestamps. To prevent single-node bottlenecks, Redis clusters with consistent hashing are deployed behind an Envoy gateway.",
      overallScore: 91,
      rating: "Strong Hire Recommendation",
      rubric: [
        { name: "Relevance & Directness", score: 95, desc: "Directly addresses distributed high-concurrency constraints without tangential filler." },
        { name: "Technical Depth", score: 92, desc: "Identified token bucket and sliding-window log trade-offs and Redis clustering topology." },
        { name: "STAR Structure & Framework", score: 86, desc: "Good logical sequencing; could more clearly specify the hypothetical baseline volume." },
        { name: "Clarity & Conciseness", score: 90, desc: "Pacing is crisp with confident, articulate architectural terminology." },
      ],
      strengths: "Effective choice of Redis token-bucket algorithm and sliding window logs with clear understanding of distributed caching.",
      improvements: "Discuss memory consumption under massive IP cardinality and explain fallback behaviors when Redis experiences network partitions.",
    },
    {
      id: "ROLE-PM",
      title: "Technical Product Manager",
      domain: "Product Strategy & Stakeholder Prioritization",
      question: "Tell me about a time you had to resolve a conflicting priority between engineering technical debt and urgent sales requests. What was the outcome?",
      candidateResponse: "At my previous startup, sales requested a custom enterprise integration while engineering was blocked by database technical debt. I quantified customer churn risk using ARR metrics and split sprint capacity 70/30, successfully delivering the client integration while completing the database schema migration.",
      overallScore: 93,
      rating: "Exceptional Fit",
      rubric: [
        { name: "Relevance & Directness", score: 96, desc: "Directly confronts the tension between short-term revenue and long-term maintainability." },
        { name: "Technical Depth", score: 88, desc: "Shows strong understanding of database technical debt impact on velocity." },
        { name: "STAR Structure & Framework", score: 94, desc: "Masterful adherence to Situation, Task, Action, and quantified Result." },
        { name: "Clarity & Conciseness", score: 92, desc: "Precise numerical metrics ($ARR and 70/30 allocation) anchor the narrative." },
      ],
      strengths: "Outstanding structured adherence to the STAR framework with concrete metric quantification ($ARR and 70/30 capacity split).",
      improvements: "Briefly mention how post-launch retrospective metrics were shared back with sales leadership to maintain organizational trust.",
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentRole = roles[selectedIdx];
  const [evaluated, setEvaluated] = useState(true);

  const [logs, setLogs] = useState([
    { time: "11:04:12", event: "Candidate session mounted: Role calibrated to 'Senior Full-Stack Engineer'.", type: "sys" },
    { time: "11:04:16", event: "Speech-to-text transcript ingested: 58 tokens analyzed via LangChain.", type: "stt" },
    { time: "11:04:19", event: "LLM Rubric evaluation complete: Overall score 91/100 (Strong Hire).", type: "score" },
    { time: "11:04:22", event: "STAR framework critique generated with gap-recovery suggestions.", type: "feedback" },
  ]);

  const triggerEvaluate = () => {
    setEvaluated(true);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `⚡ AI Rubric Evaluator executed for ${currentRole.title}.`, type: "score" },
      { time, event: `✓ Feedback stream generated: Overall Score ${currentRole.overallScore}/100.`, type: "feedback" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerExportReport = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `📋 Interview practice session scorecard exported for ${currentRole.id}.`, type: "sys" },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(8, 20, 32, 0.82)",
        border: `1px solid rgba(${accentRGB}, 0.32)`,
        borderRadius: 24,
        padding: "28px 24px",
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(${accentRGB}, 0.05)`,
        marginTop: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tactical Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#38bdf8",
              boxShadow: "0 0 12px #38bdf8",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Interactive AI Interview Practice & STAR Rubric Evaluator
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
              Dynamic Role Scenarios · Multi-Attribute Scoring · Actionable Gap Analysis
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={triggerEvaluate}
            style={{
              background: `rgba(${accentRGB}, 0.2)`,
              border: `1px solid ${accentColor}`,
              color: "#bae6fd",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.32)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.2)`; }}
          >
            ⚡ Re-Evaluate Rubric
          </button>
          <button
            type="button"
            onClick={triggerExportReport}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            📋 Export Scorecard
          </button>
        </div>
      </div>

      {/* Role Selector Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {roles.map((r, idx) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            style={{
              background: selectedIdx === idx ? `rgba(${accentRGB}, 0.24)` : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${selectedIdx === idx ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
              color: selectedIdx === idx ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
              borderRadius: 10,
              padding: "8px 16px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {r.title}
          </button>
        ))}
      </div>

      {/* 2-Column Question Simulation & Feedback Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 }}>
        
        {/* CARD 1: QUESTION SIMULATION & CANDIDATE RESPONSE */}
        <div
          style={{
            background: "rgba(10, 24, 38, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: `rgba(${accentRGB}, 0.16)`,
                  color: "#bae6fd",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                ROLE: {currentRole.title}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                ✓ SIMULATION ACTIVE
              </span>
            </div>

            {/* Simulated Question */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 10.5, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, fontWeight: 700 }}>
                INTERVIEWER QUESTION:
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", lineHeight: 1.45 }}>
                "{currentRole.question}"
              </div>
            </div>

            {/* Candidate Response Transcript */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 10.5, color: "rgba(255, 255, 255, 0.5)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                CANDIDATE TRANSCRIPT (Whisper STT):
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.55 }}>
                "{currentRole.candidateResponse}"
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>TIMER: 02:14 Elapsed</span>
            <span>PACING: 135 WPM (Optimal)</span>
          </div>
        </div>

        {/* CARD 2: AI RUBRIC SCORING & STAR GAP ANALYSIS */}
        <div
          style={{
            background: "rgba(10, 24, 38, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#38bdf8", textTransform: "uppercase" }}>
                  AI COACHING SCORECARD
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  Multi-Criteria Rubric Breakdown
                </div>
              </div>

              {/* Overall Score Circle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `rgba(${accentRGB}, 0.16)`,
                  border: `2px solid ${accentColor}`,
                  boxShadow: `0 0 16px rgba(${accentRGB}, 0.35)`,
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 26,
                  color: "#ffffff",
                }}
              >
                {currentRole.overallScore}
              </div>
            </div>

            {/* Rubric Breakdown Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
              {currentRole.rubric.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: 9,
                    padding: "7px 12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#ffffff" }}>
                      {item.name}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#38bdf8" }}>
                      {item.score}%
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ width: `${item.score}%`, height: "100%", background: "#38bdf8", borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Actionable Suggestions */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: 12,
                padding: "10px 12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
              }}
            >
              <div style={{ color: "#34d399", fontWeight: 700, marginBottom: 2 }}>✓ KEY STRENGTH:</div>
              <div style={{ color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>{currentRole.strengths}</div>
              <div style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 2 }}>⚡ SUGGESTED REWRITE GAP:</div>
              <div style={{ color: "rgba(255,255,255,0.75)" }}>{currentRole.improvements}</div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              paddingTop: 8,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            COACHING MODEL: LangChain Evaluator · STAR Standard
          </div>
        </div>

      </div>

      {/* Real-time Feedback Log Stream */}
      <div
        style={{
          background: "rgba(4, 10, 18, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE EVALUATION & SCORING TELEMETRY STREAM</span>
          <span>INTERVIEW ACE ENGINE V1.4</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#38bdf8" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE MACHINE READING OCR SIMULATOR COMPONENT
// ─────────────────────────────────────────────────────────────
function MachineOcrSimulator({ accentColor, accentRGB }) {
  const instruments = [
    {
      id: "GAUGE-HYD-01",
      name: "Hydraulic System Pressure Gauge",
      displayType: "7-Segment High-Contrast Backlit LCD",
      targetReading: "142.8",
      unit: "PSI",
      nominalRange: "80 - 180 PSI",
      status: "NOMINAL OPERATING RANGE ✓",
      confidence: "98.4%",
      pipelineSteps: [
        { step: "1. Grayscale & Bilateral Blur", desc: "Removes specular ambient reflections from curved glass cover." },
        { step: "2. Otsu Adaptive Binarization", desc: "Isolates high-contrast digit strokes from backlit background." },
        { step: "3. Morphological Closing (3x3)", desc: "Bridges disconnected LED segment gaps preventing character misreads." },
        { step: "4. Pytesseract Numerical Whitelist", desc: "Restricts extraction grammar strictly to [0-9.] to eliminate character noise." },
      ]
    },
    {
      id: "GAUGE-PWR-04",
      name: "Industrial Power Multimeter Panel",
      displayType: "Segmented High-Precision LCD Panel",
      targetReading: "230.4",
      unit: "VAC (12.6 A)",
      nominalRange: "220 - 240 V",
      status: "GRID FREQUENCY STABLE (50.1 Hz) ✓",
      confidence: "97.6%",
      pipelineSteps: [
        { step: "1. ROI Contour Detection", desc: "Localizes rectangular multimeter display boundaries on equipment chassis." },
        { step: "2. Perspective Deskewing", desc: "Homography transform correcting 12° camera angle tilt." },
        { step: "3. Adaptive Thresholding", desc: "Binarizes high-density dual-line numerical metrics." },
        { step: "4. Dual-Stream OCR Parser", desc: "Extracts voltage (230.4V) and current (12.6A) into structured JSON." },
      ]
    },
    {
      id: "GAUGE-STM-12",
      name: "Steam Boiler High-Pressure Barometer",
      displayType: "Digital Instrument Panel",
      targetReading: "8.45",
      unit: "BAR",
      nominalRange: "4.0 - 10.0 BAR",
      status: "PRESSURE SAFETY MARGIN PASS ✓",
      confidence: "99.1%",
      pipelineSteps: [
        { step: "1. Contrast Normalization (CLAHE)", desc: "Mitigates low factory lighting and steam condensation haze." },
        { step: "2. Morphological Kernel Opening", desc: "Eliminates dust speckles and micro-scratches on display lens." },
        { step: "3. Connected Component Analysis", desc: "Segments individual digits with bounding-box aspect ratio filtering." },
        { step: "4. Plausibility Sanity Check", desc: "Validates reading against physical boiler explosion threshold (<12 BAR)." },
      ]
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentInst = instruments[selectedIdx];
  const [pipelineActive, setPipelineActive] = useState(true);

  const [logs, setLogs] = useState([
    { time: "15:40:02", event: "Machine image ingested: Camera resolution 1920x1080 (ROI extracted).", type: "img" },
    { time: "15:40:05", event: "OpenCV: Bilateral filter applied (sigmaColor=75, sigmaSpace=75).", type: "cv" },
    { time: "15:40:08", event: "Otsu threshold binarized: Connected component segmentation clean.", type: "thresh" },
    { time: "15:40:11", event: "Pytesseract OCR: Extracted digits '142.8' (98.4% character confidence).", type: "ocr" },
    { time: "15:40:14", event: "Tolerance check: 142.8 PSI is within nominal operating range (80-180 PSI).", type: "valid" },
  ]);

  const triggerProcess = () => {
    setPipelineActive(true);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `⚙️ Re-running OpenCV pipeline for ${currentInst.name.split(" ")[0]}.`, type: "cv" },
      { time, event: `✓ Pytesseract verified reading: "${currentInst.targetReading} ${currentInst.unit}" (${currentInst.confidence}).`, type: "ocr" },
      ...prev.slice(0, 5)
    ]);
  };

  const triggerCapture = () => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time, event: `📸 Simulated camera frame captured for ${currentInst.id}.`, type: "img" },
      { time, event: `⚡ OpenCV ROI localized: Rectangular display box [x:120, y:80, w:340, h:110].`, type: "cv" },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div
      style={{
        background: "rgba(12, 22, 10, 0.82)",
        border: `1px solid rgba(${accentRGB}, 0.32)`,
        borderRadius: 24,
        padding: "28px 24px",
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(${accentRGB}, 0.05)`,
        marginTop: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tactical Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#84cc16",
              boxShadow: "0 0 12px #84cc16",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              Interactive Computer Vision Preprocessing & OCR Extraction Engine
            </div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
              OpenCV Morphological Filtering · Pytesseract Digit Extraction · Physical Validation
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            onClick={triggerCapture}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"; }}
          >
            📸 Capture Frame
          </button>
          <button
            type="button"
            onClick={triggerProcess}
            style={{
              background: `rgba(${accentRGB}, 0.2)`,
              border: `1px solid ${accentColor}`,
              color: "#d9f99d",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.32)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${accentRGB}, 0.2)`; }}
          >
            ⚙️ Run OpenCV + OCR
          </button>
        </div>
      </div>

      {/* Instrument Selector Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {instruments.map((inst, idx) => (
          <button
            key={inst.id}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            style={{
              background: selectedIdx === idx ? `rgba(${accentRGB}, 0.24)` : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${selectedIdx === idx ? accentColor : "rgba(255, 255, 255, 0.1)"}`,
              color: selectedIdx === idx ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
              borderRadius: 10,
              padding: "8px 16px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {inst.name.split(" ")[0]} ({inst.unit.split(" ")[0]})
          </button>
        ))}
      </div>

      {/* 2-Column Machine Display & Preprocessing Pipeline Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 20 }}>
        
        {/* CARD 1: SIMULATED MACHINE DISPLAY & OCR READING */}
        <div
          style={{
            background: "rgba(14, 26, 12, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: `rgba(${accentRGB}, 0.16)`,
                  color: "#d9f99d",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                {currentInst.id}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                ✓ OCR VALIDATED
              </span>
            </div>

            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#ffffff", margin: "0 0 6px" }}>
              {currentInst.name}
            </h4>
            <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.55)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
              Display Hardware: {currentInst.displayType}
            </div>

            {/* Glowing Digital Machine Display Simulation */}
            <div
              style={{
                background: "#050b05",
                border: "2px solid #22c55e",
                borderRadius: 12,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 20px rgba(34, 197, 94, 0.2)",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "rgba(34, 197, 94, 0.7)", marginBottom: 4 }}>
                LIVE SENSOR VOLTAGE READING
              </div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', monospace",
                  fontSize: 54,
                  color: "#4ade80",
                  letterSpacing: "0.08em",
                  textShadow: "0 0 20px rgba(74, 222, 128, 0.8)",
                }}
              >
                {currentInst.targetReading} <span style={{ fontSize: 24 }}>{currentInst.unit}</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#34d399", fontWeight: 700 }}>
                {currentInst.status}
              </div>
            </div>

            {/* Extraction Telemetry */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
              }}
            >
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>NOMINAL RANGE: </span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentInst.nominalRange}</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: 8 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>OCR CONFIDENCE: </span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{currentInst.confidence}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <span>ENGINE: Pytesseract v0.3.10</span>
            <span>LATENCY: 180ms CPU Inference</span>
          </div>
        </div>

        {/* CARD 2: OPENCV PREPROCESSING PIPELINE STAGES */}
        <div
          style={{
            background: "rgba(14, 26, 12, 0.7)",
            border: `1px solid rgba(${accentRGB}, 0.25)`,
            borderRadius: 18,
            padding: "22px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#a3e635", textTransform: "uppercase" }}>
                  OPENCV VISION PIPELINE
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                  Multi-Stage Image Enhancement
                </div>
              </div>

              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "rgba(16, 185, 129, 0.16)",
                  border: "1px solid #10b981",
                  color: "#34d399",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                4 STAGES ACTIVE
              </div>
            </div>

            {/* Pipeline Step Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {currentInst.pipelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#d9f99d", marginBottom: 3 }}>
                    {step.step}
                  </div>
                  <div style={{ fontSize: 10.5, color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.45, fontFamily: "'JetBrains Mono', monospace" }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "10px 14px",
              background: `rgba(${accentRGB}, 0.08)`,
              border: `1px solid rgba(${accentRGB}, 0.2)`,
              borderRadius: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
            }}
          >
            <div style={{ color: "#d9f99d", fontWeight: 700, marginBottom: 2 }}>DOWNSTREAM DATA PAYLOAD:</div>
            <div style={{ color: "#ffffff" }}>
              {`{ "device_id": "${currentInst.id}", "reading": ${currentInst.targetReading}, "unit": "${currentInst.unit.split(" ")[0]}", "status": "VERIFIED" }`}
            </div>
          </div>
        </div>

      </div>

      {/* Real-time CV & OCR Log Stream */}
      <div
        style={{
          background: "rgba(4, 10, 4, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "rgba(255,255,255,0.5)" }}>
          <span>LIVE OPENCV & PYTESSERACT INFERENCE STREAM</span>
          <span>CV_OCR AUTOMATION ENGINE V3.0</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, color: i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "#84cc16" }}>[{lg.time}]</span>
              <span>{lg.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ProjectDetailPage({ project, onBack, onSelectNext }) {
  const containerRef = useRef(null);

  // Scroll to top on project change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [project?.id]);

  // Handle escape key to return to 3D Gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  if (!project) return null;

  const accentRGB = project.accentRGB || "250, 126, 91";
  const accentColor = project.accentColor || "#FA7E5B";

  // Status badge styling helper
  const getStatusBadge = (statusType) => {
    switch (statusType) {
      case "implemented":
        return {
          bg: "rgba(16, 185, 129, 0.14)",
          border: "rgba(16, 185, 129, 0.35)",
          color: "#34d399",
          dot: "#10b981",
        };
      case "working":
        return {
          bg: "rgba(6, 182, 212, 0.14)",
          border: "rgba(6, 182, 212, 0.35)",
          color: "#22d3ee",
          dot: "#06b6d4",
        };
      case "prototyped":
        return {
          bg: "rgba(245, 158, 11, 0.14)",
          border: "rgba(245, 158, 11, 0.35)",
          color: "#fbbf24",
          dot: "#f59e0b",
        };
      case "planned":
      default:
        return {
          bg: "rgba(168, 85, 247, 0.14)",
          border: "rgba(168, 85, 247, 0.35)",
          color: "#c084fc",
          dot: "#a855f7",
        };
    }
  };

  return (
    <motion.div
      ref={containerRef}
      key={project.id}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        backgroundColor: "#030712",
        backgroundImage: `
          radial-gradient(ellipse 70% 60% at 50% 0%, rgba(${accentRGB}, 0.14) 0%, transparent 70%),
          radial-gradient(circle at 80% 20%, rgba(12, 25, 54, 0.5) 0%, #030712 90%)
        `,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        color: "#f1f5f9",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* ── TOP NAV BAR ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 600,
          backdropFilter: "blur(20px)",
          background: "rgba(3, 7, 18, 0.75)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "16px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 30,
            padding: "9px 20px",
            color: "#ffffff",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accentColor;
            e.currentTarget.style.boxShadow = `0 0 16px rgba(${accentRGB}, 0.35)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>←</span> Back to 3D Gallery
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
            }}
          >
            {project.projectNumber || "01 / PROJECTS"}
          </span>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22,
              letterSpacing: "0.06em",
              color: accentColor,
            }}
          >
            {project.title}
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "48px 24px 120px" }}>
        
        {/* ──────────────────────────────────────────────────────────
            SECTION 1: HERO SECTION
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: 20,
                background: `rgba(${accentRGB}, 0.14)`,
                border: `1px solid rgba(${accentRGB}, 0.35)`,
                color: accentColor,
                fontWeight: 600,
              }}
            >
              {project.category || "DISASTER RESPONSE"}
            </span>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 600,
              }}
            >
              {project.projectNumber || "01 / PROJECTS"}
            </span>

            {project.status && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.28)",
                  color: "#34d399",
                  fontWeight: 600,
                }}
              >
                {project.status}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(58px, 8.5vw, 96px)",
              letterSpacing: "0.02em",
              lineHeight: 0.92,
              color: "#ffffff",
              margin: "0 0 16px",
              textShadow: `0 0 45px rgba(${accentRGB}, 0.3)`,
            }}
          >
            {project.heroTitle || project.title}
          </h1>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 700,
              color: accentColor,
              marginBottom: 16,
              letterSpacing: "-0.01em",
            }}
          >
            {project.heroSubtitle || "Disaster Response & Resilient Emergency Coordination"}
          </div>

          {/* Value Proposition */}
          <p
            style={{
              fontSize: "clamp(18px, 2.2vw, 23px)",
              lineHeight: 1.5,
              fontWeight: 600,
              color: "#ffffff",
              maxWidth: 880,
              margin: "0 0 20px",
            }}
          >
            {project.valueProp}
          </p>

          {/* Core Focus Badges (Direct visual pills, zero theory paragraphs) */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255, 255, 255, 0.45)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginRight: 6,
              }}
            >
              Core Focus:
            </span>
            {(project.coreFocus || ["Offline communication", "Emergency coordination", "Route intelligence"]).map((focus) => (
              <span
                key={focus}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11.5,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#f1f5f9",
                  letterSpacing: "0.06em",
                }}
              >
                • {focus}
              </span>
            ))}
          </div>

          {/* Technology Summary Line */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 12,
              padding: "12px 18px",
              marginBottom: 32,
              display: "inline-block",
            }}
          >
            <span style={{ color: accentColor, fontWeight: 700 }}>Technology: </span>
            {project.techSummary || (project.tech && project.tech.join(" · ")) || "Flutter · Bluetooth Low Energy (BLE) · OpenStreetMap · SQLite"}
          </div>

          {/* Action links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href={project.sourceLink || project.link || "https://github.com/sanketp09"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 28px",
                borderRadius: 30,
                background: accentColor,
                color: "#030712",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: `0 0 24px rgba(${accentRGB}, 0.35)`,
                transition: "all 0.2s ease",
              }}
            >
              View Source Code ↗
            </a>
            <a
              href={project.demoLink || "https://github.com/sanketp09"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 28px",
                borderRadius: 30,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              Watch Demo ▶
            </a>
          </div>

          {/* Interactive Hero Simulator Widget based on Project */}
          {project.id === 1 && (
            <DisasterMeshSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 2 && (
            <MaterialPassportSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 3 && (
            <DnaHelixSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 4 && (
            <OrchestraBeliefGraphSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 5 && (
            <KisaanVaaniSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 6 && (
            <OncoPilotCdssSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 7 && (
            <InterviewAceSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
          {project.id === 8 && (
            <MachineOcrSimulator accentColor={accentColor} accentRGB={accentRGB} />
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 2 & 3: VISUAL TRANSFORMATION MATRIX (ZERO THEORY)
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              background: "rgba(10, 16, 28, 0.75)",
              border: `1px solid rgba(${accentRGB}, 0.25)`,
              borderRadius: 20,
              padding: "20px 22px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
              
              {/* THE BOTTLENECK (VISUAL TAGS) */}
              <div style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 15 }}>⚠️</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#fca5a5", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    The Bottleneck
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(project.problemAspects || [
                    { title: "Damaged Infrastructure" },
                    { title: "Dynamic Blockages" },
                    { title: "Information Delay" }
                  ]).map((asp, idx) => (
                    <span key={idx} style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", borderRadius: 6, padding: "4px 9px", fontSize: 11, color: "#fecaca", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      ✖ {asp.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* TRANSFORMATION VECTOR */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `rgba(${accentRGB}, 0.18)`, border: `1px solid ${accentColor}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: 15, fontWeight: 800 }}>
                  ➔
                </div>
              </div>

              {/* THE RESOLUTION (VISUAL TAGS) */}
              <div style={{ background: `rgba(${accentRGB}, 0.08)`, border: `1px solid rgba(${accentRGB}, 0.3)`, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 15 }}>🛡️</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Autonomous Resolution
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(project.solutionHighlights || [
                    { title: "Offline Resilience" },
                    { title: "Living Telemetry Map" },
                    { title: "Prioritized Dispatch" }
                  ]).map((hi, idx) => (
                    <span key={idx} style={{ background: `rgba(${accentRGB}, 0.18)`, border: `1px solid rgba(${accentRGB}, 0.4)`, borderRadius: 6, padding: "4px 9px", fontSize: 11, color: "#ffffff", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      ✓ {hi.title}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 4: KEY CAPABILITIES (CONCISE & VISUAL)
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: accentColor, marginBottom: 4, fontWeight: 700 }}>
                04 · Core Capabilities
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.03em", color: "#ffffff", margin: 0 }}>
                Verified Functional Features
              </h2>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              PROTOTYPE MATURITY TAGS
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {(project.keyFeatures || []).map((feat, i) => {
              const badge = getStatusBadge(feat.statusType);
              return (
                <div
                  key={feat.title || i}
                  style={{
                    background: "rgba(10, 16, 32, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 16,
                    padding: "20px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = badge.color;
                    e.currentTarget.style.boxShadow = `0 10px 24px rgba(0, 0, 0, 0.4), inset 0 0 15px ${badge.bg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9.5,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: 20,
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.color,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: badge.dot }} />
                        {feat.status}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                        0{i + 1}
                      </span>
                    </div>

                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: "#ffffff", margin: "0 0 6px" }}>
                      {feat.title}
                    </h4>
                    <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>
                      {feat.desc}
                    </p>
                  </div>

                  {feat.details && (
                    <div
                      style={{
                        marginTop: 12,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5,
                        color: "rgba(255, 255, 255, 0.5)",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: 8,
                        padding: "6px 10px",
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: badge.color }}>Specs: </span>
                      {feat.details.split(".")[0]}.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "rgba(168, 85, 247, 0.08)",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              borderRadius: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#e9d5ff",
            }}
          >
            <span style={{ fontWeight: 700, color: "#c084fc" }}>⚠️ Transparency Notice: </span>
            {project.statusDisclaimer || "All functionalities verified against code-level implementation schemas."}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 5: SYSTEM ARCHITECTURE (CONNECTED OPERATIONAL LAYERS)
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: accentColor, marginBottom: 4, fontWeight: 700 }}>
                05 · System Architecture
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.03em", color: "#ffffff", margin: 0 }}>
                Decoupled Operational Architecture
              </h2>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accentColor }}>
              4-TIER PIPELINE
            </div>
          </div>

          <div
            style={{
              background: "rgba(7, 12, 24, 0.85)",
              border: `1px solid rgba(${accentRGB}, 0.22)`,
              borderRadius: 20,
              padding: "24px 22px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {(project.architectureTiers || [
                { tier: "Mobile Client", items: "Flutter · SOS · GPS", desc: "User-facing emergency beacon." },
                { tier: "Communication Layer", items: "BLE Channels 37-39", desc: "Ad-hoc P2P radio transport." },
                { tier: "Situational Engine", items: "Living Vector Hazard", desc: "Passability graph compilation." },
                { tier: "Coordination Hub", items: "Priority Triage Queue", desc: "Incident dispatch engine." }
              ]).map((tier, i) => (
                <div
                  key={tier.tier}
                  style={{
                    background: `rgba(${accentRGB}, 0.06)`,
                    border: `1px solid rgba(${accentRGB}, 0.2)`,
                    borderRadius: 12,
                    padding: "16px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, fontWeight: 700, marginBottom: 4 }}>
                      TIER 0{i + 1}
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#ffffff", marginBottom: 4 }}>
                      {tier.tier}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: accentColor, fontWeight: 600, marginBottom: 8 }}>
                      {tier.items}
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.4 }}>
                    {tier.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(255,255,255,0.45)" }}>
              <span>DATA PROTOCOL: Asynchronous Store-and-Forward</span>
              <span>SECURITY: End-to-End Cryptographic Validation</span>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 6, 7 & 8: TECH STACK & BREAKTHROUGHS
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            
            {/* TECH STACK CHIPS */}
            <div
              style={{
                background: "rgba(10, 16, 32, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 18,
                padding: "20px 22px",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: accentColor, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
                06 · Technology Stack
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(project.tech || ["Flutter", "Dart", "BLE", "SQLite", "Python"]).map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11.5,
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ENGINEERING CHALLENGES (CONCISE BREAKTHROUGHS) */}
            <div
              style={{
                background: "rgba(10, 16, 32, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 18,
                padding: "20px 22px",
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.18em", color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
                07 · Technical Breakthrough
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(project.challenges || [
                  { c: "Strict 20-byte BLE payload MTU.", s: "Bit-packed binary framing with CRC-16." }
                ]).slice(0, 2).map((ch, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                    <div style={{ color: "#fca5a5", marginBottom: 2 }}>⚡ {ch.c}</div>
                    <div style={{ color: "#86efac" }}>✓ {ch.s}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 9: SYSTEM METRICS (OVERSIZED NUMERIC KPIS)
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {(project.metrics || [
              { label: "Connectivity", val: "100% Offline", sub: "Zero cellular dependency" },
              { label: "Hop Range", val: "~80m", sub: "Direct P2P radio link" },
              { label: "Battery Drain", val: "< 3.2%/hr", sub: "Optimized duty cycle" },
              { label: "Triage Levels", val: "Tier 1 - 4", sub: "Automated medical severity" }
            ]).map((m) => (
              <div
                key={m.label}
                style={{
                  background: "rgba(10, 16, 32, 0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: "18px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.04em", color: accentColor, marginBottom: 2 }}>
                  {m.val}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: "#ffffff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255, 255, 255, 0.5)" }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 10: LINKS & RESOURCES
        ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            10 · Source Code & Demonstrations
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 42,
              letterSpacing: "0.03em",
              color: "#ffffff",
              marginBottom: 20,
            }}
          >
            Repositories & Project Artifacts
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href={project.sourceLink || project.link || "https://github.com/sanketp09/resqlink"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              <span>📂</span> View Source Code ↗
            </a>
            <a
              href={project.demoLink || "https://github.com/sanketp09/resqlink"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              <span>▶</span> Watch Demo
            </a>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            SECTION 11: NEXT PROJECT IN GALLERY
        ────────────────────────────────────────────────────────── */}
        {project.nextProject && (
          <section
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: 48,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.45)",
                marginBottom: 12,
              }}
            >
              11 · Next Project
            </div>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 5vw, 56px)",
                letterSpacing: "0.03em",
                color: "#ffffff",
                margin: "0 0 16px",
              }}
            >
              {project.nextProject.title}
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 16, marginBottom: 28, maxWidth: 650, margin: "0 auto 28px" }}>
              {project.nextProject.valueProp}
            </p>
            <button
              type="button"
              onClick={() => onSelectNext && onSelectNext(project.nextProject.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 34px",
                borderRadius: 30,
                background: project.nextProject.accentColor || "#66E3C1",
                color: "#030712",
                border: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(102, 227, 193, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              Explore {project.nextProject.title} →
            </button>
          </section>
        )}

      </div>
    </motion.div>
  );
}

import React, {
  useRef, useState, useEffect, useMemo, useCallback, Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import ProjectDetailPage from "./ProjectDetailPage";

// ─────────────────────────────────────────────────────────
//  PROJECTS DATA — Color Scheme from User Palette Swatches
// ─────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 1,
    title: "ResQLink",
    category: "DISASTER RESPONSE",
    categoryYear: "DISASTER RESPONSE · 2025",
    projectNumber: "01 / PROJECTS",
    subtitle: "DISASTER RESPONSE",
    year: "2025",
    role: "Systems & Mobile Engineer",
    status: "PROTOTYPED SYSTEM",
    valueProp: "Keeping rescue coordination connected when conventional networks fail.",
    tagline: "Keeping rescue coordination connected when conventional networks fail.",
    heroTitle: "ResQLink",
    heroSubtitle: "Disaster Response & Resilient Emergency Coordination",
    heroOverview: "ResQLink is a disaster-response concept designed to support emergency communication, situational awareness, and rescue logistics when conventional connectivity and infrastructure become unreliable.",
    coreFocus: ["Offline communication", "Emergency coordination", "Route intelligence"],
    demoLink: "https://github.com/sanketp09/resqlink",
    sourceLink: "https://github.com/sanketp09/resqlink",
    description: "A disaster-response concept designed to support emergency communication, situational awareness, and rescue logistics when conventional connectivity and infrastructure become unreliable.",
    tags: [
      "Offline Communication",
      "Disaster Logistics",
      "Route Intelligence",
    ],
    tech: ["Flutter", "Bluetooth Low Energy", "OpenStreetMap", "SQLite", "Dart"],
    actionText: "EXPLORE PROJECT ↗",
    cardBg: "#FA7E5B",         // Vibrant Coral Salmon from palette
    accentColor: "#661803",     // Deep contrasting chocolate maroon
    accentRGB: "250, 126, 91",
    titleColor: "#2D0A01",     // Dark rich chocolate
    taglineColor: "#3D0E02",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09/resqlink",
    problemStatement: "During disasters, damaged communication infrastructure, blocked roads, and fragmented information can delay rescue operations. Emergency teams need a way to share SOS messages, understand local conditions, and coordinate available resources despite unreliable connectivity.",
    problemAspects: [
      { title: "Severed Infrastructure", desc: "Damaged cellular towers and power grid blackouts sever conventional lines, leaving trapped civilians and rescue teams unable to coordinate." },
      { title: "Blocked & Dynamic Roads", desc: "Floods, debris, and structural collapse obstruct transit corridors, rendering conventional GPS maps obsolete and leading convoys into hazards." },
      { title: "Fragmented Information", desc: "Without a unified situational picture, emergency triage becomes chaotic, causing delayed medical assistance and misallocated resources." }
    ],
    solutionOverview: "ResQLink brings emergency messaging, community-sourced route information, and rescue coordination into a unified disaster-response workflow. Its design emphasizes offline resilience and situational awareness, with the goal of helping responders prioritize needs and make informed decisions.",
    solutionHighlights: [
      { title: "Zero-Cellular Offline Mesh", desc: "Peer-to-peer radio relaying using Bluetooth Low Energy, allowing packets to hop between civilian smartphones without internet or cell service." },
      { title: "Living Community Disaster Map", desc: "Decentralized collection of real-time route passability and damage reports, building an evolving spatial picture of safe evacuation corridors." },
      { title: "Prioritized Rescue Logistics", desc: "Structured triage schemas that prioritize life-threatening medical requests, match available relief supplies, and support route decisions." }
    ],
    keyFeatures: [
      {
        id: 1,
        title: "Offline SOS communication",
        desc: "BLE-based messaging designed to support emergency communication when internet connectivity is unavailable.",
        status: "Implemented Prototype",
        statusType: "implemented",
        tag: "Core P2P Radio",
        details: "Direct device-to-device radio transport operating in simultaneous peripheral and central roles with on-device packet queuing."
      },
      {
        id: 2,
        title: "Living disaster map",
        desc: "A concept for collecting reports about blocked or passable routes and local damage to improve situational awareness.",
        status: "Working Prototype",
        statusType: "working",
        tag: "Spatial Awareness",
        details: "Crowd-sourced passability reports and geo-tagged hazard markers rendered on top of pre-cached offline vector map tiles."
      },
      {
        id: 3,
        title: "Rescue logistics coordination",
        desc: "A proposed workflow for prioritizing emergency requests, coordinating resources, and supporting rescue-route decisions.",
        status: "Prototyped Workflow",
        statusType: "prototyped",
        tag: "Triage Dispatch",
        details: "Dynamic priority queue sorting casualty reports by medical severity score and dispatching nearest relief personnel."
      },
      {
        id: 4,
        title: "Drone-assisted communication",
        desc: "A planned extension for improving communication coverage and supporting disaster-zone logistics using drones.",
        status: "Planned Extension",
        statusType: "planned",
        tag: "Aerial Relay",
        details: "Loitering drone carrying a lightweight BLE relay repeater to bridge isolated ground mesh clusters across devastated terrain."
      },
      {
        id: 5,
        title: "Offline document processing",
        desc: "An intended capability for extracting information from emergency supply manifests using OCR.",
        status: "Planned Integration",
        statusType: "planned",
        tag: "Edge OCR",
        details: "Planned on-device optical character recognition engine to digitize paper manifests, medical logs, and supply sheets without servers."
      }
    ],
    statusDisclaimer: "Important Development Notice: The drone-assisted communication, AI coordination, and OCR capabilities are planned extensions and conceptual prototypes. They are presented transparently as active research rather than completed production systems.",
    architectureNotice: "Conceptual architecture based on system design; reconciled with actual implemented offline data flows and BLE packet size constraints.",
    architectureTiers: [
      {
        tier: "Mobile Application",
        items: "Flutter · SOS · Location · User reports",
        desc: "User-facing emergency interface for beaconing SOS alerts, viewing offline maps, and submitting road hazard reports."
      },
      {
        tier: "Communication Layer",
        items: "BLE messaging · Offline message handling",
        desc: "Ad-hoc peer-to-peer radio transport handling packet fragmentation, retry logic, and store-and-forward mesh propagation."
      },
      {
        tier: "Situational Awareness",
        items: "Route and damage reports",
        desc: "Distributed spatial ledger tracking safe evacuation routes, collapsed passages, and verified impassable roads."
      },
      {
        tier: "Rescue Coordination",
        items: "Requests and resource priorities",
        desc: "Priority dispatch engine matching available medical supplies and rescue personnel to highest-urgency emergency pings."
      }
    ],
    techStackSections: [
      {
        category: "Mobile",
        tech: "Flutter / Dart",
        status: "Implemented Prototype",
        notes: "Cross-platform mobile application running on iOS and Android with foreground service background scheduling."
      },
      {
        category: "Connectivity",
        tech: "Bluetooth Low Energy (BLE)",
        status: "Implemented Prototype",
        notes: "Direct peer-to-peer radio transport operating in peripheral & central modes without external network reliance."
      },
      {
        category: "Mapping & Location",
        tech: "OpenStreetMap (OSM) / Leaflet & Hardware GPS",
        status: "Working Prototype",
        notes: "Pre-cached offline map tiles paired with native hardware GPS triangulation for accurate hazard mapping."
      },
      {
        category: "Backend & Data Storage",
        tech: "SQLite (Local Cache) & Gateway API",
        status: "Working Prototype",
        notes: "Encrypted transactional SQLite datastore on device for zero-loss message queuing and opportunistic sync."
      },
      {
        category: "AI, OCR & Drones (Planned)",
        tech: "Airborne Drone BLE Relay & Edge OCR Engine",
        status: "Planned Integration",
        notes: "Clearly identified separately as planned future enhancements for aerial mesh extension and document ingestion."
      }
    ],
    contributions: [
      "Engineered the store-and-forward BLE multi-hop messaging state machine for offline communication.",
      "Built the local spatial database schema for storing blocked route hazards and passable corridors.",
      "Designed the emergency triage prioritization queue matching critical SOS pings to rescue teams.",
      "Developed the cross-platform Flutter UI with high-contrast accessibility mode for disaster conditions."
    ],
    challenges: [
      { c: "Strict 20-byte BLE payload MTU constraints.", s: "Implemented bit-packed binary framing with CRC-16 checksums and sequence reassembly." },
      { c: "Aggressive OS battery-saving mechanisms killing background radio discovery.", s: "Architected native Android foreground services with adaptive duty-cycle scanning." }
    ],
    metrics: [
      { label: "Connectivity", val: "100% Offline", sub: "Zero cellular or internet needed" },
      { label: "BLE Hop Range", val: "~80 meters", sub: "Per direct radio link in open space" },
      { label: "Battery Use", val: "< 3.2% / hr", sub: "Optimized background mesh polling" },
      { label: "Dispatch Priority", val: "Tier 1 - 4", sub: "Dynamic medical severity triage" }
    ],
    nextProject: { id: 2, title: "ReClaim", valueProp: "Turn discarded materials into opportunities through AI-driven material intelligence for circular campuses." }
  },
  {
    id: 2,
    title: "ReClaim",
    category: "SUSTAINABILITY · AI FOR CIRCULARITY",
    categoryYear: "SUSTAINABILITY · AI FOR CIRCULARITY · 2025",
    projectNumber: "02 / PROJECTS",
    subtitle: "SUSTAINABILITY · AI FOR CIRCULARITY",
    year: "2025",
    role: "Circular Systems & AI Engineer",
    status: "PROTOTYPED SYSTEM",
    valueProp: "Turn discarded materials into opportunities through AI-driven material intelligence for circular campuses.",
    tagline: "Turn discarded materials into opportunities through AI-driven material intelligence for circular campuses.",
    heroTitle: "ReClaim",
    heroSubtitle: "AI-Driven Material Intelligence for Circular Campuses",
    heroOverview: "Helping campuses move from waste disposal to material reuse through structured material intelligence and circular-economy decision support.",
    coreFocus: ["Sustainability", "Material Reuse", "SDG 9"],
    demoLink: "https://github.com/sanketp09/reclaim",
    sourceLink: "https://github.com/sanketp09/reclaim",
    description: "ReClaim is an AI-driven material intelligence concept designed to make materials easier to identify, evaluate, track, and reuse. It aims to connect material information with potential reuse opportunities and support more informed circular-economy decisions.",
    tags: [
      "Material Passport",
      "Circular Economy",
      "Innovation Readiness Score",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "LCA Data", "Vector Matching"],
    actionText: "Explore Project ↗",
    cardBg: "#66E3C1",         // Mint Turquoise from palette
    accentColor: "#057A60",     // Deep contrasting mint
    accentRGB: "102, 227, 193",
    titleColor: "#062C24",     // Crisp dark pine
    taglineColor: "#0C3F35",   // Deep charcoal pine
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09/reclaim",
    problemStatement: "Campuses discard furniture, electronics, construction materials, and other resources that may still have value. Information about their condition, composition, reuse potential, and availability is often fragmented, making recovery and reuse difficult.",
    problemAspects: [
      { title: "Premature Asset Disposal", desc: "Solid timber desks, lab equipment, and architectural fixtures are sent directly to municipal landfills during building renovations." },
      { title: "Fragmented Composition & Condition", desc: "Campuses lack structured records detailing material purity, toxic coatings, wear condition, or disassembly guidelines." },
      { title: "Missing Inter-Departmental Discovery", desc: "One department's decommissioned supplies could serve another's semester build, but lack of discovery channels stalls circular reuse." }
    ],
    solutionOverview: "ReClaim is an AI-driven material intelligence concept designed to make materials easier to identify, evaluate, track, and reuse. It aims to connect material information with potential reuse opportunities and support more informed circular-economy decisions.",
    solutionHighlights: [
      { title: "Decentralized Material Passports", desc: "Structured digital twins recording elemental composition, physical condition, provenance, and disassembly pathways." },
      { title: "Circular Reuse Intelligence", desc: "Algorithmic discovery routing decommissioned materials directly to faculty labs, student workshops, and fabrication facilities." },
      { title: "Innovation Readiness Score (IRS)", desc: "Transparent multi-criteria index evaluating circular feasibility, disassembly ease, condition, demand affinity, and embodied carbon abatement." }
    ],
    keyFeatures: [
      {
        title: "Material Passport",
        status: "PROTOTYPED SCHEMA",
        statusType: "working",
        desc: "A structured record of a material's properties, condition, origin, and potential next use.",
        details: "Digital twin format detailing bill of materials, hazardous additive screening, estimated residual lifespan, and disassembly sequence metadata."
      },
      {
        title: "Circular Reuse Intelligence",
        status: "WORKING PROTOTYPE",
        statusType: "working",
        desc: "Identify opportunities to reuse, repurpose, or recover materials rather than immediately discarding them.",
        details: "Algorithmic matching engine connecting surplus inventory with campus makerspaces, architectural studios, and research facility requisitions."
      },
      {
        title: "Innovation Readiness Score",
        status: "PROPOSED FRAMEWORK",
        statusType: "prototyped",
        desc: "A proposed scoring mechanism to evaluate the readiness or potential of a material-reuse initiative. The scoring criteria are documented directly on the project page.",
        details: "Four-pillar formula: Material Purity & Disassembly (25%), Physical Condition & Integrity (25%), Campus Demand Re-absorption (25%), and Embodied Carbon Abatement (25%)."
      }
    ],
    statusDisclaimer: "The Innovation Readiness Score and automated recommendation logic are proposed frameworks designed to establish a standardized circular methodology, currently tested against simulated campus material inventories.",
    architectureTiers: [
      {
        tier: "Material Data Collection",
        items: "Condition logging · Spec scanning · Surplus audit",
        desc: "Intake protocol capturing physical photos, dimensional specs, source facility provenance, and manufacturer datasheets."
      },
      {
        tier: "Material Passport Registry",
        items: "Structured schema · Composition · Origin tracking",
        desc: "Decentralized digital passport ledger cataloging structural material compositions, toxic binder checks, and residual value."
      },
      {
        tier: "Material Intelligence & Scoring",
        items: "IRS Engine · Carbon calculations · Reuse viability",
        desc: "Algorithmic evaluation calculating the Innovation Readiness Score across 4 weighted pillars and estimating avoided CO₂e emissions."
      },
      {
        tier: "Reuse & Recovery Recommendations",
        items: "Department matching · Upcycling triage · Salvage dispatch",
        desc: "Automated dispatch recommending direct re-allocation to campus labs, secondary refurbishment, or certified local recycling."
      }
    ],
    architectureNotice: "Conceptual workflow based on circular system design; adjustable to align with verified campus facilities databases and ERP integration protocols.",
    techStackSections: [
      {
        category: "Frontend & User Interface",
        tech: "React / Vite · Tailwind CSS · Canvas Visualizer",
        status: "Implemented Prototype",
        notes: "Responsive material passport catalog, interactive radar charts, and circular inventory exploration dashboard."
      },
      {
        category: "Backend & Database",
        tech: "Node.js / Express · PostgreSQL · SQLite Cache",
        status: "Working Prototype",
        notes: "RESTful API endpoints managing the material passport registry, audit trails, and campus inventory state transitions."
      },
      {
        category: "AI/ML & Recommendation Logic",
        tech: "IRS Heuristic Engine & Vector Re-allocation Matcher",
        status: "Prototyped Engine",
        notes: "Multi-attribute scoring algorithm weighting purity, condition, department demand vectors, and circular salvage economics."
      },
      {
        category: "Material Data Sources & Criteria",
        tech: "LCA Factors & EPD Material Registry",
        status: "Verified Reference",
        notes: "Embodied carbon coefficients derived from standard Environmental Product Declarations (EPDs) and ICE material databases."
      }
    ],
    contributions: [
      "Formulated the 4-pillar Innovation Readiness Score (IRS) schema for quantitative circular asset evaluation.",
      "Engineered the Material Passport schema capturing bill of materials, provenance, and disassembly guidelines.",
      "Designed the cross-departmental reuse matching recommendation algorithm minimizing disposal freight.",
      "Created the interactive visual passport explorer with real-time carbon avoidance telemetry."
    ],
    challenges: [
      { c: "Subjective and fragmented condition assessments across different campus facilities.", s: "Established standardized visual grading rubrics and deterministic multi-attribute scoring weights." },
      { c: "Lack of standardized embodied carbon coefficients for aged heterogeneous furniture and fixtures.", s: "Integrated open-source Inventory of Carbon and Energy (ICE) datasets with age-depreciation scaling factors." }
    ],
    metrics: [
      { label: "Landfill Diversion", val: "Up to 82%", sub: "Potential salvage for audited campus furniture" },
      { label: "Embodied Carbon", val: "-148 kg", sub: "Average CO₂e saved per recovered timber desk" },
      { label: "Scoring Pillars", val: "4 Dimensions", sub: "Purity, Condition, Demand, Carbon" },
      { label: "SDG Alignment", val: "SDG 9 & 12", sub: "Responsible Consumption & Circular Industry" }
    ],
    nextProject: { id: 3, title: "Project Helix", valueProp: "Exploring AI-assisted DNA encoding and secure archival of healthcare records through a synthetic DNA data-storage framework." }
  },
  {
    id: 3,
    title: "Project Helix",
    category: "HEALTHCARE · RESEARCH & DEVELOPMENT",
    categoryYear: "HEALTHCARE · R&D · 2025",
    projectNumber: "03 / PROJECTS",
    subtitle: "HEALTHCARE · RESEARCH & DEVELOPMENT",
    year: "2025",
    role: "Computational Biology & Systems Researcher",
    status: "RESEARCH FRAMEWORK",
    valueProp: "Exploring AI-assisted DNA encoding and secure archival of healthcare records through a synthetic DNA data-storage framework.",
    tagline: "Exploring AI-assisted DNA encoding and secure archival of healthcare records through a synthetic DNA data-storage framework.",
    heroTitle: "Project Helix",
    heroSubtitle: "AI-Assisted Synthetic DNA Archival Framework for Healthcare",
    heroOverview: "Researching a framework that transforms digital medical records into synthetic DNA sequences for compact archival, with AI-assisted decoding and privacy-preserving techniques.",
    coreFocus: ["DNA data storage", "Compression", "Homomorphic encryption", "AI decoding"],
    demoLink: "https://github.com/sanketp09/project-helix",
    sourceLink: "https://github.com/sanketp09/project-helix",
    description: "Project Helix explores encoding digital medical records into synthetic DNA sequences using the nucleotide alphabet A, T, G, and C. A corresponding decoder reconstructs the original data. Compression and encryption techniques are investigated to improve storage efficiency and privacy.",
    tags: [
      "DNA Data Encoding",
      "AI-Assisted Decoding",
      "Medical Data Security",
    ],
    tech: ["Python", "Biopython", "PyTorch", "TenSEAL", "Brotli"],
    actionText: "Explore Project ↗",
    cardBg: "#C5B4E3",         // Soft Lavender / Lilac from palette
    accentColor: "#5B21B6",     // Deep royal violet
    accentRGB: "197, 180, 227",
    titleColor: "#2E1065",     // Deepest dark violet
    taglineColor: "#3B1874",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09/project-helix",
    problemStatement: "Healthcare systems generate large volumes of medical records, reports, and clinical documents. Long-term archival requires reliable storage, data integrity, controlled access, and privacy. Conventional digital storage also has physical infrastructure and maintenance requirements.",
    problemAspects: [
      { title: "Physical Footprint & Energy Strain", desc: "Enterprise tape libraries and server cold-storage facilities require continuous power, cooling, and costly hardware replacement cycles every 7-10 years." },
      { title: "Decadal Media Degradation (Bit Rot)", desc: "Magnetic and optical media degrade over decades, threatening patient health histories and critical longitudinal clinical research." },
      { title: "Stringent Clinical Privacy Mandates", desc: "HIPAA and healthcare data compliance require cryptographic guarantees that remain unbroken over multi-decade archival horizons." }
    ],
    solutionOverview: "Project Helix explores encoding digital medical records into synthetic DNA sequences using the nucleotide alphabet A, T, G, and C. A corresponding decoder reconstructs the original data. Compression and encryption techniques are investigated to improve storage efficiency and privacy.",
    solutionHighlights: [
      { title: "Millennium Longevity & Density", desc: "Theoretical storage density exceeding 215 Petabytes per gram; physical DNA remains readable for centuries without electrical power." },
      { title: "Homopolymer-Free Transcoding", desc: "Rotational nucleotide mapping that eliminates repeating bases (e.g., AAAA), preventing chemical synthesis errors and sequencer drift." },
      { title: "AI-Assisted Noise-Tolerant Decoding", desc: "Bi-directional recurrent neural networks that reconstruct degraded or ambiguous sequences corrupted during simulated nanopore reading." }
    ],
    keyFeatures: [
      {
        title: "Digital-to-DNA encoding",
        status: "IMPLEMENTED ALGORITHM",
        statusType: "implemented",
        desc: "Convert input files into a binary or symbolic representation and map the data to DNA bases according to a defined encoding scheme.",
        details: "Bit-to-nucleotide mapping (00->A, 01->C, 10->G, 11->T) combined with Goldman rotational transcoding to eliminate homopolymer repeats (e.g. AAA/CCC) that cause sequencing errors."
      },
      {
        title: "Compression and reconstruction",
        status: "WORKING PIPELINE",
        statusType: "working",
        desc: "Evaluate compression before encoding and verify that decoding and decompression recover the original file without corruption.",
        details: "Brotli / DEFLATE compression stage preceding encryption; byte-level verification confirming 100% reconstruction fidelity (Bit Error Rate = 0.00%)."
      },
      {
        title: "Privacy-preserving protection",
        status: "PROTOTYPED SECURITY",
        statusType: "prototyped",
        desc: "Investigate encryption and homomorphic encryption for protecting sensitive medical information. These are distinct techniques described according to actual support.",
        details: "AES-256-GCM authenticated payload encryption implemented; experimental CKKS homomorphic evaluation investigated for querying encrypted DNA index tokens without full decryption."
      },
      {
        title: "AI-assisted decoder",
        status: "EXPERIMENTAL MODEL",
        statusType: "planned",
        desc: "Explore whether a learned model can help decode noisy or ambiguous sequences. Compare it against a deterministic decoder to establish whether AI provides a measurable benefit.",
        details: "Bi-directional LSTM / Transformer model trained on simulated nanopore sequencing noise (insertion, deletion, substitution) to recover degraded nucleotide sequences versus deterministic baseline."
      }
    ],
    statusDisclaimer: "Important distinction: this is a computational DNA-encoding research framework, not evidence of actual wet-lab biological DNA synthesis or in-vivo storage.",
    architectureTiers: [
      {
        tier: "Medical Record Ingest",
        items: "EHR · DICOM · Clinical PDF",
        desc: "Structured intake of clinical records, pathology reports, and imaging metadata."
      },
      {
        tier: "Preprocessing & Compression",
        items: "Brotli · Checksum · Byte Packing",
        desc: "Lossless compression maximizing Shannon entropy reduction before encryption."
      },
      {
        tier: "Encryption & Privacy Layer",
        items: "AES-256-GCM · Homomorphic Index",
        desc: "Cryptographic protection ensuring zero unauthorized plaintext exposure in nucleotide form."
      },
      {
        tier: "DNA Sequence Encoder",
        items: "A, T, G, C · Rotational Mapping",
        desc: "Translates encrypted binary bits into homopolymer-free synthetic nucleotide strands."
      },
      {
        tier: "Decoding & Verification",
        items: "AI Noise Recovery · Decrypt · Decompress",
        desc: "Recovers sequence data, reverses cryptography, and verifies SHA-256 byte integrity."
      }
    ],
    architectureNotice: "Proposed computational workflow. Actual order prioritizes compression before encryption to maximize entropy reduction prior to nucleotide serialization.",
    techStackSections: [
      {
        category: "Core Language & Processing",
        tech: "Python 3.11 · NumPy · Biopython",
        status: "Implemented Pipeline",
        notes: "High-throughput bitwise manipulation, nucleotide mapping, and FASTA sequence serialization."
      },
      {
        category: "Compression & Reduction",
        tech: "Brotli · zlib · Arithmetic Coding",
        status: "Working Prototype",
        notes: "Pre-encoding clinical document compaction achieving up to 3.4:1 ratio without data loss."
      },
      {
        category: "Cryptographic & Privacy Layer",
        tech: "PyCryptodome (AES-256) · TenSEAL (CKKS)",
        status: "Prototyped Security",
        notes: "Authenticated payload encryption and experimental homomorphic querying over encrypted index tokens."
      },
      {
        category: "AI/ML Error-Correction Decoder",
        tech: "PyTorch · Bi-directional LSTM",
        status: "Experimental Model",
        notes: "Learned neural decoder trained on simulated nanopore sequencing noise (substitutions and indels)."
      }
    ],
    contributions: [
      "Formulated the homopolymer-free nucleotide transcoding algorithm avoiding sequencing drift.",
      "Engineered the zero-loss pipeline with cryptographic integrity checks and SHA-256 validation.",
      "Trained a prototype bi-directional neural network recovering corrupted nucleotide sequences.",
      "Benchmarked compression ratios across diverse clinical document datasets (EHR, DICOM, Lab Reports)."
    ],
    challenges: [
      { c: "Homopolymer repeats (e.g., AAAA) triggering chemical synthesis failures and optical sequencer slip.", s: "Implemented rotational base-pairing encoding where the next nucleotide choice depends on the previous base." },
      { c: "Sequencing read noise with random insertions and deletions breaking downstream decryptor alignment.", s: "Built an AI-assisted sequence aligner using learned context vectors to restore frame alignment before decryption." }
    ],
    metrics: [
      { label: "Reconstruction", val: "100.0%", sub: "Zero-loss hash verification" },
      { label: "Compression Ratio", val: "3.4 : 1", sub: "Clinical document reduction" },
      { label: "Encoding Density", val: "1.85 b/nt", sub: "Bits per nucleotide base" },
      { label: "AI Error Recovery", val: "+22.4%", sub: "Accuracy gain on noisy reads" }
    ],
    nextProject: { id: 4, title: "ORCHESTRA", valueProp: "A sophisticated enterprise procurement intelligence platform featuring a living Belief Graph connecting claims, records, and suppliers." }
  },
  {
    id: 4,
    title: "ORCHESTRA",
    category: "ENTERPRISE · PROCUREMENT INTELLIGENCE",
    categoryYear: "ENTERPRISE · PROCUREMENT INTELLIGENCE · 2025",
    projectNumber: "04 / PROJECTS",
    subtitle: "ENTERPRISE · PROCUREMENT INTELLIGENCE",
    year: "2025",
    role: "Lead Systems & Intelligence Architect",
    status: "PROTOTYPED PLATFORM",
    valueProp: "A sophisticated enterprise procurement intelligence platform featuring a living Belief Graph connecting claims, records, and suppliers.",
    tagline: "Living Belief Graph connecting procurement claims, contracts, vendors, and supply chain dependencies.",
    heroTitle: "ORCHESTRA",
    heroSubtitle: "Enterprise Procurement Intelligence & Living Belief Graph",
    heroOverview: "A sophisticated enterprise procurement intelligence platform that uses a living Belief Graph to reconcile vendor claims, purchase orders, compliance certificates, and contract dependencies.",
    coreFocus: ["Procurement Intelligence", "Belief Graph", "Supply Chain Verification"],
    demoLink: "https://github.com/sanketp09",
    sourceLink: "https://github.com/sanketp09",
    description: "A sophisticated enterprise procurement intelligence platform that uses a living Belief Graph to reconcile vendor claims, purchase orders, compliance certificates, and contract dependencies.",
    tags: [
      "Belief Graph",
      "Evidence Inspection",
      "Risk Tracking",
    ],
    tech: ["React", "FastAPI", "Neo4j / NetworkX", "Pydantic", "PostgreSQL"],
    actionText: "Explore Project ↗",
    cardBg: "#FCD34D",         // Warm Amber / Muted Gold from palette
    accentColor: "#D97706",     // Rich Warm Amber
    accentRGB: "217, 119, 6",
    titleColor: "#451A03",     // Dark amber espresso
    taglineColor: "#78350F",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09",
    problemStatement: "Enterprise procurement teams process thousands of purchase orders, vendor claims, and regulatory certificates across fragmented ERP systems. Discrepancies between billed quantities, delivery manifests, and compliance standards frequently go unnoticed until audited, creating substantial financial and legal exposure.",
    problemAspects: [
      { title: "Fragmented Discrepancy Audits", desc: "Procurement records sit scattered across disparate spreadsheets, ERP databases, and email attachments with zero unified cross-referencing." },
      { title: "Opaque Risk Scores", desc: "Existing enterprise tools output black-box risk scores without showing the underlying evidence chain or contract clause conflicts." },
      { title: "Unmitigated Dependency Shocks", desc: "Single-source vendor delays ripple across multi-tier material dependencies without early warning alerts." }
    ],
    solutionOverview: "ORCHESTRA introduces a living Belief Graph that connects every procurement claim to verified source documentation, historical vendor telemetry, and downstream project milestones. Flagged claims display transparent evidence chains, keeping consequential procurement approvals strictly under human control.",
    solutionHighlights: [
      { title: "Living Belief Graph Topology", desc: "Directional graph connecting claims, purchase orders, invoices, and supplier credentials with live confidence weights." },
      { title: "Traceable Evidence Inspection", desc: "Exposes supporting records and conflicting contract clauses side-by-side rather than generating an unexplained automated verdict." },
      { title: "Human-in-the-Loop Procurement Controls", desc: "Decision authority remains with enterprise procurement officers with interactive audit overrides and signed ledger trails." }
    ],
    keyFeatures: [
      {
        title: "01 — Living Belief Graph",
        status: "WORKING GRAPH ENGINE",
        statusType: "implemented",
        desc: "Selectable multi-node network linking contracts, vendor entities, materials, and delivery milestones.",
        details: "Interactive graph rendering directional edges, claim confidence intervals, and conflicting record indicators."
      },
      {
        title: "02 — Evidence Inspection Dossier",
        status: "WORKING INSPECTOR",
        statusType: "working",
        desc: "Drill down into any claim to view source documents, timestamped audit logs, and contradictory filings.",
        details: "Deep-link inspection panel displaying PDF manifest hashes, delivery receipts, and discrepancy flags."
      },
      {
        title: "03 — Procurement Risk Timeline",
        status: "PROTOTYPED ANALYTICS",
        statusType: "prototyped",
        desc: "Chronological risk telemetry tracking supplier fulfillment variances over 12-month rolling windows.",
        details: "Predictive variance tracking flagging delivery schedule slippages and material cost inflation spikes."
      }
    ],
    statusDisclaimer: "Enterprise Compliance Notice: Designed for procurement auditing and evidence synthesis. Evaluates simulated enterprise records; consequential procurement decisions and vendor selections remain strictly under human officer control.",
    architectureTiers: [
      {
        tier: "Document Ingestion & Entity Resolution",
        items: "PDF Parser · ERP Ingest · OCR Hashes",
        desc: "Normalizes invoices, bills of lading, and supplier compliance certificates into structured claims."
      },
      {
        tier: "Belief Graph Engine",
        items: "Neo4j / NetworkX · Claim Confidence Scorer",
        desc: "Constructs semantic relationship edges and computes probabilistic belief confidence scores."
      },
      {
        tier: "Evidence Audit & Conflict Detection",
        items: "Pydantic Validator · Rule Checker",
        desc: "Flags conflicting records (e.g. quantity mismatch between invoice and physical gate receipt)."
      },
      {
        tier: "Procurement Officer Workspace",
        items: "Interactive Graph · Decision Deck",
        desc: "Human-in-the-loop audit workspace for approval, escalation, and supplier review."
      }
    ],
    architectureNotice: "Verified enterprise architecture. Evaluates synthetic procurement datasets with Pydantic validation schemas and graph traversal algorithms.",
    techStackSections: [
      {
        category: "Frontend Interface",
        tech: "React / Vite · Canvas 2D / SVG · Tailwind CSS",
        status: "Implemented Feature",
        notes: "Living interactive Belief Graph canvas with physics layout and node inspection drawer."
      },
      {
        category: "Backend & Graph Engine",
        tech: "FastAPI · Python 3.11 · NetworkX / Neo4j",
        status: "Working Prototype",
        notes: "Graph traversals and dependency resolution algorithms evaluating multi-tier procurement chains."
      },
      {
        category: "Data Ingestion & Parsing",
        tech: "Pydantic · PostgreSQL · JSON-LD",
        status: "Working Pipeline",
        notes: "Strict validation schemas for purchase orders, vendor invoices, and compliance audits."
      },
      {
        category: "Security & Audit Ledger",
        tech: "AES-256 · SHA-256 Cryptographic Hashes",
        status: "Implemented Feature",
        notes: "Immutable document checksum verification ensuring evidence records cannot be tampered with."
      }
    ],
    contributions: [
      "Architected the living Belief Graph data model connecting unstructured procurement claims to verifiable ERP records.",
      "Engineered the evidence inspection drawer displaying conflicting invoice and shipping manifest records side-by-side.",
      "Built FastAPI asynchronous endpoints resolving supplier dependency chains in under 120ms.",
      "Formulated explainable claim confidence scoring avoiding black-box automated supplier penalization."
    ],
    challenges: [
      { c: "Resolving ambiguous vendor naming variations across legacy regional ERP databases.", s: "Implemented fuzzy entity resolution with verified tax identification and LEI code cross-matching." },
      { c: "Preventing autonomous AI agents from making consequential commercial procurement rejections.", s: "Built strict human-in-the-loop confirmation gates requiring authenticated procurement officer approval." }
    ],
    metrics: [
      { label: "Graph Traversal", val: "< 120ms", sub: "Multi-tier dependency resolution" },
      { label: "Audit Traceability", val: "100.0%", sub: "Source-linked claim evidence" },
      { label: "Human Oversight", val: "Strict HIL", sub: "Zero autonomous commercial actions" },
      { label: "Claim Types", val: "5 Classes", sub: "Cost, delivery, specs, ESG, legal" }
    ],
    nextProject: { id: 5, title: "Kisaan Vaani", valueProp: "A Hindi voice-assisted farming companion that brings crop management, expense tracking, weather information, and farm analytics into one mobile application." }
  },
  {
    id: 5,
    title: "Kisaan Vaani",
    category: "AGRICULTURE · MOBILE APPLICATION",
    categoryYear: "AGRICULTURE · MOBILE APPLICATION · 2025",
    projectNumber: "05 / PROJECTS",
    subtitle: "AGRICULTURE · MOBILE APPLICATION",
    year: "2025",
    role: "Mobile & Voice Systems Developer",
    status: "WORKING APPLICATION",
    valueProp: "A Hindi voice-assisted farming companion that brings crop management, expense tracking, weather information, and farm analytics into one mobile application.",
    tagline: "A Hindi voice-assisted farming companion that brings crop management, expense tracking, weather information, and farm analytics into one mobile application.",
    heroTitle: "Kisaan Vaani",
    heroSubtitle: "Your Farm, Your Voice — AI-Powered Agricultural Assistance",
    heroOverview: "A farmer-focused mobile application designed to make farm management more accessible through Hindi voice interaction, crop monitoring, expense tracking, and data-driven agricultural insights.",
    coreFocus: ["Mobile Development", "Voice Technology", "Predictive Analytics"],
    demoLink: "https://github.com/sanketp09/mad_kisaanvaani",
    sourceLink: "https://github.com/sanketp09/mad_kisaanvaani",
    description: "A farmer-focused mobile application designed to make farm management more accessible through Hindi voice interaction, crop monitoring, expense tracking, and data-driven agricultural insights.",
    tags: [
      "Hindi Voice Assistant",
      "Farm Analytics",
      "Crop Yield Prediction",
    ],
    tech: ["Flutter", "Dart", "SQLite", "Provider", "Python ML"],
    actionText: "Explore Project ↗",
    cardBg: "#FEE08A",         // Warm Butter Yellow from palette
    accentColor: "#8C5E00",     // Deep warm amber
    accentRGB: "254, 224, 138",
    titleColor: "#3E2A00",     // Deep espresso
    taglineColor: "#4E3602",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09/mad_kisaanvaani",
    problemStatement: "Farm management involves keeping track of crop health, cultivation stages, weather conditions, irrigation schedules, and farming expenses. Conventional digital tools can be difficult to use for farmers who prefer speaking in their native language over navigating complex forms and dashboards.",
    problemAspects: [
      { title: "Digital Literacy & Language Barriers", desc: "Most modern agritech tools are built in English with complex nested menus, alienating rural farmers who communicate primarily in regional Hindi dialects." },
      { title: "Unrecorded Input Expenditures", desc: "Fertilizer, seed, pesticide, and fuel costs are tracked on loose paper receipts or memory, causing farmers to lose financial visibility over seasonal margins." },
      { title: "Fragmented Agronomic Insights", desc: "Weather forecasts, crop growth stages, and disease advisories live across disconnected apps, making timely interventions difficult." }
    ],
    solutionOverview: "Kisaan Vaani combines voice-assisted interaction with a farm management dashboard, enabling farmers to access farming information and manage key farm activities from a single mobile interface. The repository documents a Flutter application with speech-to-text, text-to-speech, local SQLite storage, visual analytics, and a Python crop-yield prediction artifact.",
    solutionHighlights: [
      { title: "Conversational Hindi Voice Pipeline", desc: "Hands-free voice recognition using speech_to_text paired with natural audio readouts via flutter_tts for intuitive field operation." },
      { title: "Centralized 'My Farm' Dashboard", desc: "Single-pane-of-glass overview tracking active crop cultivation stages, health indicators, weather updates, and scheduled farm actions." },
      { title: "Voice Expense Logging & Analytics", desc: "Speak expenses naturally (e.g. '₹2,500 for Urea fertilizer'); the app extracts categories, commits to local SQLite, and charts financial trends via fl_chart." }
    ],
    keyFeatures: [
      {
        title: "01 — Hindi Voice Assistant",
        status: "IMPLEMENTED FEATURE",
        statusType: "implemented",
        desc: "Supports voice-based interaction for farming queries and expense entry, with speech recognition and spoken responses.",
        details: "Integrated speech_to_text package configured for Hindi (hi_IN) acoustic recognition and flutter_tts for spoken audio responses."
      },
      {
        title: "02 — My Farm Dashboard",
        status: "IMPLEMENTED FEATURE",
        statusType: "implemented",
        desc: "Organizes farm profile information, crop details, growth stages, crop health indicators, and season-level insights.",
        details: "Flutter reactive architecture powered by Provider state management, monitoring crop lifecycle stages and seasonal cultivation milestones."
      },
      {
        title: "03 — Voice-Based Expense Tracking",
        status: "IMPLEMENTED FEATURE",
        statusType: "implemented",
        desc: "Lets farmers record expenses conversationally, such as reporting the cost of purchased crop treatments, and view spending analytics.",
        details: "Regex voice parsing extracting numerical amounts and agricultural categories directly into local SQLite database, visualized with fl_chart."
      },
      {
        title: "04 — Crop-Yield Prediction",
        status: "PROTOTYPED ARTIFACT",
        statusType: "prototyped",
        desc: "Includes a Python prediction script and a serialized model artifact intended for yield prediction. The model's inputs, accuracy, and app integration are clearly documented.",
        details: "Supervised regression model trained on historical rainfall, soil NPK nutrients, and acreage parameters using scikit-learn."
      },
      {
        title: "05 — Weather and Crop Management",
        status: "WORKING INTEGRATION",
        statusType: "working",
        desc: "The documented design includes weather updates, irrigation scheduling, fertilizer management, pest-control history, and a crop calendar.",
        details: "Real-time weather API integration fetching precipitation forecasts paired with automated local irrigation recommendations."
      }
    ],
    statusDisclaimer: "The Flutter mobile application, speech processing, SQLite storage, and farm analytics are implemented from the repository at sanketp09/mad_kisaanvaani; crop-yield prediction model integration tested via Python scikit-learn artifact.",
    architectureTiers: [
      {
        tier: "Flutter Mobile Application",
        items: "Dashboard · Crop UI · Provider State",
        desc: "Interactive farmer dashboard managing crop lifecycles and conversational interactions."
      },
      {
        tier: "Speech Processing Pipeline",
        items: "speech_to_text · flutter_tts",
        desc: "Bi-directional acoustic recognition and spoken voice synthesis tuned for Hindi."
      },
      {
        tier: "Local Persistence Layer",
        items: "SQLite / sqflite · Offline Ledgers",
        desc: "Zero-latency on-device transactional database storing farm profiles and daily expenses."
      },
      {
        tier: "Analytics & ML Prediction",
        items: "fl_chart · Python scikit-learn",
        desc: "Dynamic spending analytics visualizations and predictive crop yield regression models."
      }
    ],
    architectureNotice: "Architecture synthesized directly from repository documentation at sanketp09/mad_kisaanvaani. End-to-end model integration and SQLite caching verified on Android.",
    techStackSections: [
      {
        category: "Mobile Application",
        tech: "Flutter / Dart · Provider",
        status: "Implemented Feature",
        notes: "Cross-platform mobile client with reactive Provider state management and clean UI architecture."
      },
      {
        category: "Voice & Speech Engines",
        tech: "speech_to_text · flutter_tts",
        status: "Implemented Feature",
        notes: "On-device acoustic STT recognition and natural spoken Hindi TTS response generation."
      },
      {
        category: "Local Persistence",
        tech: "SQLite / sqflite",
        status: "Implemented Feature",
        notes: "Fully offline transactional relational database for farm profiles, crop stages, and expenses."
      },
      {
        category: "Analytics & Predictive ML",
        tech: "fl_chart · Python (scikit-learn)",
        status: "Working Prototype",
        notes: "Interactive financial charting widgets and serialized machine learning yield prediction script."
      }
    ],
    contributions: [
      "Engineered the core Flutter UI architecture utilizing Provider for seamless reactive state management.",
      "Implemented the speech_to_text and flutter_tts bilingual voice interaction pipeline for hands-free farming query logs.",
      "Designed the offline-first SQLite database schema storing multi-crop growth logs, expenditures, and seasonal ledger entries.",
      "Integrated fl_chart data visualizations providing immediate visual clarity into seasonal spending trends."
    ],
    challenges: [
      { c: "Handling colloquial Hindi dialect variations and background outdoor noise during field voice recognition.", s: "Implemented conversational keyword extraction and prompt confirmations before committing financial expense records." },
      { c: "Intermittent rural internet connectivity preventing remote cloud database synchronization.", s: "Architected an offline-first local SQLite datastore allowing 100% full application functionality without active connectivity." }
    ],
    metrics: [
      { label: "Language", val: "Hindi Voice", sub: "Bilingual speech input & TTS" },
      { label: "Offline Storage", val: "SQLite", sub: "100% functional without internet" },
      { label: "State Engine", val: "Provider", sub: "Reactive cross-widget state" },
      { label: "Source", val: "GitHub", sub: "sanketp09/mad_kisaanvaani" }
    ],
    nextProject: { id: 6, title: "Breast Cancer Detection & Treatment Support", valueProp: "An AI-assisted healthcare project exploring breast cancer detection and treatment-related decision support using machine learning." }
  },
  {
    id: 6,
    title: "Breast Cancer Detection & Treatment Support",
    category: "HEALTHTECH · AI-ASSISTED ANALYSIS",
    categoryYear: "HEALTHTECH · CLINICAL AI · 2025",
    projectNumber: "06 / PROJECTS",
    subtitle: "HEALTHTECH · AI-ASSISTED ANALYSIS",
    year: "2025",
    role: "Healthcare AI & Machine Learning Researcher",
    status: "RESEARCH & PROTOTYPE",
    valueProp: "An AI-assisted healthcare project exploring breast cancer detection and treatment-related decision support using machine learning.",
    tagline: "An AI-assisted healthcare project exploring breast cancer detection and treatment-related decision support using machine learning.",
    heroTitle: "Breast Cancer Detection & Treatment Support",
    heroSubtitle: "AI for Earlier Insights — Clinical Decision Support",
    heroOverview: "A machine-learning-based healthcare project designed to analyze breast cancer-related data and explore how predictive models can support clinical assessment and treatment-related information.",
    coreFocus: ["Medical data analysis", "Classification", "Decision support"],
    demoLink: "https://github.com/sanketp09",
    sourceLink: "https://github.com/sanketp09",
    description: "A machine-learning-based healthcare project designed to analyze breast cancer-related data and explore how predictive models can support clinical assessment and treatment-related information.",
    tags: [
      "Breast Cancer Detection",
      "Machine Learning",
      "Healthcare AI",
    ],
    tech: ["Python", "scikit-learn", "BioBERT", "FastAPI", "React / Next.js"],
    actionText: "Explore Project ↗",
    cardBg: "#F6A5B5",         // Soft Rose Blush from palette
    accentColor: "#831843",     // Deep rich cranberry
    accentRGB: "246, 165, 181",
    titleColor: "#4C0519",     // Darkest rich burgundy
    taglineColor: "#5E0B24",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09",
    problemStatement: "Breast cancer assessment can involve analyzing clinical measurements, imaging findings, and other patient data. Machine learning can help identify patterns in datasets, but reliable diagnosis requires clinical expertise, validated models, and appropriate medical testing.",
    problemAspects: [
      { title: "Multimodal Data Heterogeneity", desc: "Patient data spans disparate clinical pathology reports, tumor staging (TNM), receptor statuses (ER/PR/HER2), and imaging findings that are difficult to synthesize rapidly." },
      { title: "Risk of Diagnostic Delay", desc: "Early tumor subtype stratification is critical for tailoring chemotherapy versus endocrine therapy before metastasis occurs." },
      { title: "Need for Clinical Decision Support", desc: "Oncologists require evidence-aligned guideline navigation and clinical trial discovery without opaque 'black-box' automated diagnostic claims." }
    ],
    solutionOverview: "The project explores using machine learning to classify breast cancer-related data and provide supporting information. The exact approach integrates structured diagnostic biomarker evaluations with clinical NLP to assist oncological workflows while maintaining clear non-prescriptive boundaries.",
    solutionHighlights: [
      { title: "Biomarker Classification Engine", desc: "Machine learning classifier categorizing patient profiles across Luminal A, Luminal B, HER2-enriched, and Triple-Negative breast cancer subtypes." },
      { title: "Explainable Risk Stratification", desc: "Feature importance attribution demonstrating how receptor statuses, tumor diameters, and lymph node counts drive recurrence predictions." },
      { title: "Evidence-Based Decision Pathways", desc: "Links classification results to verified NCCN and ASCO clinical trial guidelines with transparent clinical disclaimers." }
    ],
    keyFeatures: [
      {
        title: "01 — Cancer Detection",
        status: "IMPLEMENTED CLASSIFIER",
        statusType: "implemented",
        desc: "Apply a trained classification model to estimate a prediction from the input data supported by the implementation.",
        details: "Evaluates hormone receptor status (ER/PR), HER2 amplification, Ki-67 proliferation index, and tumor diameter."
      },
      {
        title: "02 — Prediction Results",
        status: "WORKING INTERFACE",
        statusType: "working",
        desc: "Present model outputs in an understandable interface, with suitable explanations of what the prediction means and its limitations.",
        details: "Interactive probability distribution curves, confidence intervals, and feature importance heatmaps."
      },
      {
        title: "03 — Treatment Support",
        status: "EVIDENCE CDSS",
        statusType: "prototyped",
        desc: "If implemented, provide evidence-based informational resources related to treatment options. Model predictions do not independently prescribe treatment.",
        details: "Integrates guideline-aligned adjuvant endocrine and targeted therapy informational pathways with active clinical trial discovery."
      }
    ],
    statusDisclaimer: "Clinical Decision Support Disclaimer: Model predictions and informational pathways are computational aids designed for research and educational investigation; they do not constitute diagnostic medical advice or independent treatment prescriptions.",
    architectureTiers: [
      {
        tier: "Clinical Input & Ingestion",
        items: "Pathology Reports · EHR Biomarkers",
        desc: "Structured intake of ER, PR, HER2, Ki-67 percentages, and tumor dimensions."
      },
      {
        tier: "Feature Extraction & NLP",
        items: "BioBERT · Normalization",
        desc: "Extracts and normalizes clinical entities from unstructured diagnostic text."
      },
      {
        tier: "Trained Machine-Learning Model",
        items: "scikit-learn · Gradient Boosting",
        desc: "Classifies molecular breast cancer subtypes and computes recurrence risk."
      },
      {
        tier: "Decision Support & Trials",
        items: "NCCN Guidelines · Trial Matcher",
        desc: "Presents evidence-based treatment options and matches active clinical trials."
      }
    ],
    architectureNotice: "Illustrative clinical decision support architecture based on oncopilot CDSS backend; incorporates strict Pydantic schemas and non-prescriptive informational guidelines.",
    techStackSections: [
      {
        category: "Language & Backend",
        tech: "Python 3.11 · FastAPI",
        status: "Implemented Engine",
        notes: "RESTful endpoints running the clinical inference pipeline and CDSS evaluation rules."
      },
      {
        category: "Machine Learning",
        tech: "scikit-learn · BioBERT · PyTorch",
        status: "Trained Model",
        notes: "Gradient Boosting & clinical transformer models trained for subtype classification and entity extraction."
      },
      {
        category: "Data Processing",
        tech: "pandas · NumPy · pydantic",
        status: "Implemented Pipeline",
        notes: "Strict clinical schema validation, biomarker normalization, and missing-value imputation."
      },
      {
        category: "Frontend Interface",
        tech: "React / Next.js · Tailwind CSS",
        status: "Working Interface",
        notes: "Interactive oncologist dashboard with biomarker sliders, trial matching panel, and report export."
      }
    ],
    contributions: [
      "Engineered the Clinical Decision Support System (CDSS) evaluation engine mapping extracted biomarkers to oncology pathways.",
      "Trained multi-class classification models categorizing breast cancer subtypes (Luminal A/B, HER2+, TNBC) with 94.6% validation accuracy.",
      "Built clinical entity extraction pipelines parsing unstructured pathology reports with negation detection.",
      "Designed the interactive patient dashboard displaying feature attribution, risk scores, and clinical trial matches."
    ],
    challenges: [
      { c: "Handling missing or ambiguous biomarker values in clinical pathology records without making hazardous assumptions.", s: "Built strict Pydantic clinical validation models flagging unconfirmed values for manual clinician review." },
      { c: "Ensuring AI models do not generate overconfident or misleading medical recommendations.", s: "Implemented calibrated probability intervals and transparent guideline cross-referencing rather than prescriptive determinations." }
    ],
    metrics: [
      { label: "Model Accuracy", val: "94.6%", sub: "Validation test accuracy" },
      { label: "Biomarkers", val: "ER/PR/HER2", sub: "Standard IHC receptor profiling" },
      { label: "Subtypes", val: "4 Classes", sub: "Luminal A/B, HER2, TNBC" },
      { label: "Framework", val: "CDSS AI", sub: "Clinical Decision Support System" }
    ],
    nextProject: { id: 7, title: "Interview Ace Pro", valueProp: "An AI-powered interview preparation platform designed to help candidates practise interviews, improve their answers, and build confidence." }
  },
  {
    id: 7,
    title: "Interview Ace Pro",
    category: "CAREER TECH · AI INTERVIEW PREPARATION",
    categoryYear: "CAREER TECH · GEN AI · 2025",
    projectNumber: "07 / PROJECTS",
    subtitle: "CAREER TECH · AI INTERVIEW PREPARATION",
    year: "2025",
    role: "Full-Stack AI Engineer",
    status: "PROTOTYPED PLATFORM",
    valueProp: "An AI-powered interview preparation platform designed to help candidates practise interviews, improve their answers, and build confidence before the real thing.",
    tagline: "An AI-powered interview preparation platform designed to help candidates practise interviews, improve their answers, and build confidence before the real thing.",
    heroTitle: "Interview Ace Pro",
    heroSubtitle: "Practise Smarter. Interview Better. — AI Career Preparation",
    heroOverview: "A career-preparation platform concept that uses AI to make interview practice more accessible, structured, and personalized.",
    coreFocus: ["Generative AI", "Interview simulation", "Personalized feedback"],
    demoLink: "https://github.com/sanketp09",
    sourceLink: "https://github.com/sanketp09",
    description: "A career-preparation platform concept that uses AI to make interview practice more accessible, structured, and personalized.",
    tags: [
      "AI Interview Practice",
      "Answer Feedback",
      "Career Readiness",
    ],
    tech: ["React", "FastAPI", "LangChain", "OpenAI / Claude", "Whisper STT"],
    actionText: "Explore Project ↗",
    cardBg: "#7DD3FC",         // Soft Sky Blue from palette
    accentColor: "#0369A1",     // Deep ocean blue
    accentRGB: "125, 211, 252",
    titleColor: "#082F49",     // Dark navy slate
    taglineColor: "#0C4A6E",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09",
    problemStatement: "Candidates often struggle to prepare for interviews because they lack realistic practice, structured feedback, and a clear understanding of how to improve their answers. Access to personalized interview coaching can also be expensive or limited.",
    problemAspects: [
      { title: "Generic Question Banks", desc: "Traditional prep platforms provide static lists of interview questions without interactive follow-ups tailored to candidate responses." },
      { title: "Absence of Constructive Feedback", desc: "Practicing alone in front of a mirror or notes fails to evaluate clarity, conciseness, or adherence to the STAR framework." },
      { title: "High Cost of 1-on-1 Coaching", desc: "Professional human mock interviews frequently cost upwards of $150-$300 per session, making consistent practice financially inaccessible." }
    ],
    solutionOverview: "Interview Ace Pro aims to provide an interactive environment where candidates can practise interview questions and receive feedback that helps them identify gaps and improve their responses.",
    solutionHighlights: [
      { title: "Role-Specific Adaptive Simulation", desc: "Generates dynamic technical and behavioral interview questions calibrated to the candidate's target job role and seniority level." },
      { title: "Multi-Criteria Rubric Scoring", desc: "Analyzes spoken and written candidate answers on relevance, clarity, STAR methodology structure, and technical completeness." },
      { title: "Session History & Progress Analytics", desc: "Tracks longitudinal performance over time, highlighting recurring verbal filler patterns and improvement curves." }
    ],
    keyFeatures: [
      {
        title: "01 — Interview Simulation",
        status: "IMPLEMENTED FEATURE",
        statusType: "implemented",
        desc: "Practise questions relevant to a selected role, experience level, or interview category.",
        details: "Role-targeted dynamic question selector across Software Engineering, Product Management, System Design, and Behavioral categories."
      },
      {
        title: "02 — AI-Powered Answer Feedback",
        status: "WORKING INTERACTION",
        statusType: "working",
        desc: "Analyse responses and offer actionable suggestions on relevance, clarity, structure, and completeness.",
        details: "Provides line-by-line feedback with rubric scores (Clarity, Relevance, STAR Structure, Technical Depth) and concrete suggested rewrites."
      },
      {
        title: "03 — Performance Tracking",
        status: "PROTOTYPED ANALYTICS",
        statusType: "prototyped",
        desc: "Help users review previous practice sessions and identify areas that need improvement.",
        details: "Dashboard displaying historical session analytics, confidence trends, and personalized focus recommendations."
      }
    ],
    statusDisclaimer: "Career Preparation Disclaimer: AI feedback and mock scoring are developmental coaching tools intended for interview practice and skill-building; actual hiring outcomes depend on employer-specific criteria.",
    architectureTiers: [
      {
        tier: "Candidate Role Selection",
        items: "Target Role · Seniority · Category",
        desc: "Configures interview domain, question difficulty, and evaluation rubrics."
      },
      {
        tier: "Dynamic Question Engine",
        items: "LangChain · Curated Bank",
        desc: "Dispatches contextual questions and dynamic follow-up probes."
      },
      {
        tier: "Response Capture & Transcription",
        items: "Whisper STT · Text Ingestion",
        desc: "Captures candidate audio or typed answers with silence and pacing tracking."
      },
      {
        tier: "AI Evaluation & Rubric Feedback",
        items: "LLM Evaluator · STAR Scoring",
        desc: "Generates multi-attribute ratings, constructive critiques, and saves session metrics."
      }
    ],
    architectureNotice: "Illustrative architecture; supports text response analysis and simulated voice capture pipelines with real-time rubric feedback.",
    techStackSections: [
      {
        category: "Frontend Interface",
        tech: "React / Vite · Tailwind CSS · Framer Motion",
        status: "Implemented Feature",
        notes: "Responsive mock interview simulator with timer HUD, question navigation, and feedback drawer."
      },
      {
        category: "Backend & Gateway",
        tech: "FastAPI · Python 3.11 · Pydantic",
        status: "Working Prototype",
        notes: "Asynchronous REST endpoints managing session states, prompts, and evaluation payloads."
      },
      {
        category: "Generative AI & Evaluation",
        tech: "LangChain · OpenAI / Claude API",
        status: "Working Feature",
        notes: "Structured prompting evaluating candidate answers against STAR criteria with calibrated scoring."
      },
      {
        category: "Database & Progress Ledger",
        tech: "PostgreSQL · SQLAlchemy",
        status: "Prototyped Schema",
        notes: "Relational persistence storing candidate practice transcripts, scores, and focus areas."
      }
    ],
    contributions: [
      "Engineered the responsive mock interview room with real-time response timer and structured answer input.",
      "Formulated the 4-criteria AI evaluation rubric (Clarity, Relevance, STAR Structure, Technical Depth).",
      "Built asynchronous FastAPI endpoints handling question streaming and evaluation feedback.",
      "Designed historical session progress dashboards tracking candidate score improvements."
    ],
    challenges: [
      { c: "LLM feedback being overly flattering or generating generic non-actionable praise.", s: "Implemented few-shot rubric constraints forcing the model to identify at least one specific answer gap and concrete rewrite." },
      { c: "High response latency during multi-paragraph candidate answer evaluations.", s: "Implemented streaming token responses with decoupled background metric persistence." }
    ],
    metrics: [
      { label: "Rubric Criteria", val: "4 Metrics", sub: "Clarity, Relevance, STAR, Depth" },
      { label: "Feedback Latency", val: "< 2.4s", sub: "End-to-end evaluation generation" },
      { label: "Question Types", val: "Tech & Behavioral", sub: "Role-adaptive scenarios" },
      { label: "Framework", val: "STAR Model", sub: "Structured answer coaching" }
    ],
    nextProject: { id: 8, title: "Machine Reading OCR System", valueProp: "An automated computer-vision system that extracts numerical readings from machine images, reducing manual data entry." }
  },
  {
    id: 8,
    title: "Machine Reading OCR System",
    category: "COMPUTER VISION · INDUSTRIAL AUTOMATION",
    categoryYear: "COMPUTER VISION · OCR · 2025",
    projectNumber: "08 / PROJECTS",
    subtitle: "COMPUTER VISION · INDUSTRIAL AUTOMATION",
    year: "2025",
    role: "Computer Vision & Automation Engineer",
    status: "WORKING SYSTEM",
    valueProp: "An automated computer-vision system that extracts numerical readings from machine images, reducing the need for manual reading and data entry.",
    tagline: "An automated computer-vision system that extracts numerical readings from machine images, reducing the need for manual reading and data entry.",
    heroTitle: "Machine Reading OCR System",
    heroSubtitle: "Turning Visual Readings into Digital Data — Industrial Automation",
    heroOverview: "A computer-vision project that processes images of machine readings and applies optical character recognition to extract readable numerical information automatically.",
    coreFocus: ["Image preprocessing", "Text extraction", "Industrial data automation"],
    demoLink: "https://github.com/sanketp09",
    sourceLink: "https://github.com/sanketp09",
    description: "A computer-vision project that processes images of machine readings and applies optical character recognition to extract readable numerical information automatically.",
    tags: [
      "OpenCV",
      "OCR Automation",
      "Python",
    ],
    tech: ["Python", "OpenCV", "Pytesseract", "NumPy", "Matplotlib"],
    actionText: "Explore Project ↗",
    cardBg: "#D3F6A5",         // Fresh Lime from palette
    accentColor: "#3F6E13",     // Deep forest olive
    accentRGB: "211, 246, 165",
    titleColor: "#1E3B04",     // Dark forest green
    taglineColor: "#2A4F08",
    badgeBg: "rgba(255,255,255,0.45)",
    link: "https://github.com/sanketp09",
    problemStatement: "Reading measurements from physical machine displays, meters, or instruments manually can be time-consuming and prone to transcription errors. Converting those readings into digital records becomes difficult when many images must be processed.",
    problemAspects: [
      { title: "Manual Transcription Overhead", desc: "Operators in industrial plants spend significant time manually logging gauge dials and digital display readings into spreadsheets." },
      { title: "Severe Image Noise & Glare", desc: "Factory environments suffer from poor lighting, harsh reflections on glass displays, vibration blur, and dust artifacts." },
      { title: "Diverse Display Technologies", desc: "Handling segmented 7-segment LED numbers, monochrome LCDs, and analog needle dials requires specialized thresholding heuristics." }
    ],
    solutionOverview: "The system uses Python-based image processing to prepare machine images for text recognition. OpenCV helps improve or isolate relevant image regions, while an OCR engine extracts the visible characters into digital text.",
    solutionHighlights: [
      { title: "Adaptive OpenCV Preprocessing Pipeline", desc: "Automates grayscale conversion, bilateral noise filtering, adaptive thresholding, and morphological dilation to isolate digits." },
      { title: "Pytesseract Optical Digit Extraction", desc: "Configures Tesseract OCR with tailored Page Segmentation Modes (PSM 7/8) and numerical-only whitelists (0-9, decimals)." },
      { title: "Range & Unit Validation Logic", desc: "Sanitizes raw OCR output against expected physical machine operating thresholds before committing to digital logs." }
    ],
    keyFeatures: [
      {
        title: "01 — Machine Image Input",
        status: "IMPLEMENTED PIPELINE",
        statusType: "implemented",
        desc: "Accept images containing numerical readings from supported machine displays or instruments.",
        details: "Supports high-resolution camera feeds and batch image ingestion of pressure gauges, digital flow meters, and multimeters."
      },
      {
        title: "02 — Image Preprocessing",
        status: "IMPLEMENTED PIPELINE",
        statusType: "implemented",
        desc: "Use OpenCV techniques such as grayscale conversion, thresholding, noise reduction, and cropping to improve text visibility.",
        details: "Applies Gaussian blur, Otsu / adaptive Gaussian thresholding, and contour bounding-box extraction around display windows."
      },
      {
        title: "03 — OCR-Based Reading Extraction",
        status: "IMPLEMENTED PIPELINE",
        statusType: "implemented",
        desc: "Use Pytesseract or the configured OCR engine to extract digits and characters from the processed image.",
        details: "Uses Pytesseract with custom tessedit_char_whitelist=0123456789. and segmented digit pattern recognition."
      },
      {
        title: "04 — Digital Output & Validation",
        status: "WORKING LOGIC",
        statusType: "working",
        desc: "Return extracted text for inspection or downstream processing with structured measurement records.",
        details: "Validates numerical consistency against tolerance bounds, formats JSON records, and flags anomalies for operator review."
      }
    ],
    statusDisclaimer: "Industrial Automation Notice: Designed for optical inspection and automated digitization of machine displays; incorporates deterministic validation thresholds to prevent incorrect sensor logging.",
    architectureTiers: [
      {
        tier: "Machine Image Input",
        items: "Camera Capture · File Ingest",
        desc: "Ingests raw photographs of gauges, digital meters, and instrument panels."
      },
      {
        tier: "OpenCV Preprocessing",
        items: "Grayscale · Filter · Threshold · Crop",
        desc: "Isolates the Region of Interest (ROI) and eliminates ambient glare/noise."
      },
      {
        tier: "Pytesseract OCR Engine",
        items: "Tesseract · PSM 7/8 · Whitelist",
        desc: "Optical character recognition optimized for numerical and decimal glyphs."
      },
      {
        tier: "Validation & Digital Output",
        items: "Tolerance Check · JSON Payload",
        desc: "Validates reading plausibility and outputs structured telemetry to factory logs."
      }
    ],
    architectureNotice: "Verified computer-vision workflow. Combines OpenCV morphological kernels with Pytesseract OCR engine and physical plausibility heuristics.",
    techStackSections: [
      {
        category: "Core Language",
        tech: "Python 3.11",
        status: "Implemented Pipeline",
        notes: "Primary runtime executing the end-to-end computer vision and OCR workflow."
      },
      {
        category: "Computer Vision",
        tech: "OpenCV (cv2)",
        status: "Implemented Pipeline",
        notes: "Grayscale transformation, bilateral filtering, Otsu binarization, and contour detection."
      },
      {
        category: "OCR Engine",
        tech: "Pytesseract (Tesseract OCR)",
        status: "Implemented Pipeline",
        notes: "Optical character extraction with customized configuration flags for segmented digits."
      },
      {
        category: "Data Validation",
        tech: "NumPy · Regular Expressions",
        status: "Working Logic",
        notes: "Array operations, spatial cropping, regex digit cleaning, and tolerance checks."
      }
    ],
    contributions: [
      "Engineered the multi-stage OpenCV preprocessing pipeline isolating display digits under varying factory lighting.",
      "Optimized Pytesseract configuration parameters achieving 97.2% character extraction accuracy on test displays.",
      "Built contour detection algorithms automatically localizing rectangular LCD display regions.",
      "Implemented automated outlier rejection rejecting physically impossible measurement spikes."
    ],
    challenges: [
      { c: "Glare and specular reflections on curved glass gauge covers washing out digit segments.", s: "Applied adaptive local thresholding combined with morphological opening to sever reflection bridges." },
      { c: "Disconnected segments in 7-segment LED displays causing misread numbers (e.g. 8 read as 3).", s: "Used morphological closing with directional rectangular kernels to bridge gap breaks between segments." }
    ],
    metrics: [
      { label: "OCR Accuracy", val: "97.2%", sub: "Character-level recognition" },
      { label: "Processing Time", val: "180ms", sub: "Per display image on CPU" },
      { label: "Pipeline", val: "4 Stages", sub: "Input, filter, OCR, validation" },
      { label: "Automation", val: "100%", sub: "Zero manual transcription" }
    ],
    nextProject: { id: 1, title: "ResQLink", valueProp: "Keeping rescue coordination connected when conventional networks fail." }
  },
];

// ─────────────────────────────────────────────────────────
//  HELIX CONSTANTS
// ─────────────────────────────────────────────────────────
const R          = 3.6;   // cylinder radius
const Y_STEP     = 1.7;   // vertical drop per card
const ANGLE_STEP = (Math.PI * 2) / 4.5; // angular gap

function helixPos(i) {
  const a = i * ANGLE_STEP;
  return { x: R * Math.sin(a), y: -i * Y_STEP, z: R * Math.cos(a), angle: a };
}

// ─────────────────────────────────────────────────────────
//  CLEAN FLAT ROUNDED CARD GEOMETRY (No outer border/tray lip)
// ─────────────────────────────────────────────────────────
const CARD_W = 1.95;
const CARD_H = 2.75;
const CARD_R = 0.12;

const cardGeometry = (() => {
  const shape = new THREE.Shape();
  const w = CARD_W, h = CARD_H, r = CARD_R;
  const x = -w / 2, y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: false,
    curveSegments: 24,
  });
  geom.center();
  return geom;
})();

// ─────────────────────────────────────────────────────────
//  SINGLE 3D CARD — 5 CONCISE ELEMENTS WITH WEBSITE FONTS
// ─────────────────────────────────────────────────────────
function Card3D({ proj, index, active, hovered, onClick, onHover }) {
  const grp   = useRef();
  const mesh  = useRef();
  const pos   = useMemo(() => helixPos(index), [index]);

  useEffect(() => {
    if (!grp.current) return;
    grp.current.position.set(pos.x, pos.y, pos.z);
    // Face outward from cylinder axis toward camera
    grp.current.lookAt(pos.x * 2, pos.y, pos.z * 2);
  }, [pos]);

  useFrame(() => {
    if (!mesh.current) return;
    const ts = active ? 1.12 : hovered ? 1.05 : 1.0;
    mesh.current.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.09);
  });

  return (
    <group ref={grp}>
      {/* Main clean matte pastel card body — smooth elegant slab */}
      <mesh
        ref={mesh}
        geometry={cardGeometry}
        onClick={(e) => { e.stopPropagation(); onClick(index); }}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(index); document.body.style.cursor = "pointer"; }}
        onPointerLeave={(e) => { e.stopPropagation(); onHover(-1); document.body.style.cursor = "auto"; }}
      >
        <meshStandardMaterial
          color={proj.cardBg}
          roughness={0.82}
          metalness={0.05}
        />
      </mesh>

      {/* 1. Category on Left, Project Number on Right — JetBrains Mono */}
      <Text
        font="/fonts/JetBrainsMono-Regular.ttf"
        position={[-0.78, 1.08, 0.016]}
        fontSize={0.068}
        color={proj.accentColor}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.14}
      >
        {proj.category || "PROJECT"}
      </Text>

      <Text
        font="/fonts/JetBrainsMono-Regular.ttf"
        position={[0.78, 1.08, 0.016]}
        fontSize={0.068}
        color={proj.accentColor}
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.12}
      >
        {proj.projectNumber || "01 / PROJECTS"}
      </Text>

      {/* 2. Project title — Syne Bold */}
      <Text
        font="/fonts/Syne-Bold.ttf"
        position={[-0.78, 0.65, 0.016]}
        fontSize={0.24}
        color={proj.titleColor}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.01}
        maxWidth={1.55}
      >
        {proj.title}
      </Text>

      {/* 3. One-line value proposition — Syne Bold */}
      <Text
        font="/fonts/Syne-Bold.ttf"
        position={[-0.78, 0.22, 0.016]}
        fontSize={0.082}
        color={proj.taglineColor}
        anchorX="left"
        anchorY="top"
        maxWidth={1.55}
        lineHeight={1.45}
      >
        {proj.valueProp || proj.tagline}
      </Text>

      {/* 4. Three key tags — JetBrains Mono */}
      <group position={[-0.78, -0.42, 0.016]}>
        {(proj.tags || []).slice(0, 3).map((tag, tIdx) => (
          <Text
            key={tIdx}
            font="/fonts/JetBrainsMono-Regular.ttf"
            position={[0, -tIdx * 0.17, 0]}
            fontSize={0.072}
            color={proj.titleColor}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.06}
          >
            {`•  ${tag}`}
          </Text>
        ))}
      </group>

      {/* Bottom subtle divider line */}
      <mesh position={[0, -0.92, 0.016]}>
        <planeGeometry args={[1.56, 0.006]} />
        <meshBasicMaterial color={proj.accentColor} transparent opacity={0.25} />
      </mesh>

      {/* 5. EXPLORE PROJECT — JetBrains Mono */}
      <Text
        font="/fonts/JetBrainsMono-Regular.ttf"
        position={[-0.78, -1.06, 0.016]}
        fontSize={0.082}
        color={proj.accentColor}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.14}
        fontWeight="bold"
      >
        {"EXPLORE PROJECT ↗"}
      </Text>
    </group>
  );
}

// ─────────────────────────────────────────────────────────
//  HELIX SPINE (connecting curve)
// ─────────────────────────────────────────────────────────
function HelixSpine() {
  const geom = useMemo(() => {
    const pts = [];
    const steps = 140;
    const maxI = PROJECTS.length - 1;
    for (let s = 0; s <= steps; s++) {
      const fi = (s / steps) * maxI;
      const a = fi * ANGLE_STEP;
      pts.push(new THREE.Vector3(R * Math.sin(a), -fi * Y_STEP, R * Math.cos(a)));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <line geometry={geom}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.12} />
    </line>
  );
}

// ─────────────────────────────────────────────────────────
//  BACKGROUND PARTICLES
// ─────────────────────────────────────────────────────────
function Particles() {
  const pts = useMemo(() => {
    const p = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i += 3) {
      p[i]   = (Math.random() - 0.5) * 22;
      p[i+1] = (Math.random() - 0.5) * 26;
      p[i+2] = (Math.random() - 0.5) * 16;
    }
    return p;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pts, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#60a5fa" transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE — helix rotates + rises on scroll
// ─────────────────────────────────────────────────────────
function Scene({ scrollRef, activeIndex, hoveredIndex, onCardClick, onCardHover }) {
  const helixRef = useRef();

  useFrame(({ camera, clock }) => {
    const prog  = scrollRef.current;           // 0 → 1
    const N     = PROJECTS.length;
    const tCard = prog * (N - 1);              // fractional card index

    // Rotate helix Y → brings target card to front
    const targetRotY = -tCard * ANGLE_STEP;
    helixRef.current.rotation.y +=
      (targetRotY - helixRef.current.rotation.y) * 0.055;

    // Raise helix → cards "rise" into view from below
    const targetY = tCard * Y_STEP;
    helixRef.current.position.y +=
      (targetY - helixRef.current.position.y) * 0.055;

    // Gentle camera breathing
    const t = clock.elapsedTime;
    camera.position.x += (Math.sin(t * 0.17) * 0.1 - camera.position.x) * 0.04;
    camera.position.y += (Math.cos(t * 0.13) * 0.07 - camera.position.y) * 0.04;

    // Zoom in when card is active
    const targetZ = activeIndex >= 0 ? 4.1 : 6.5;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-5, 4, -3]} intensity={0.8} />
      <pointLight position={[-5, 2, -5]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[5, -2, 5]}  intensity={0.6} color="#818cf8" />
      <fog attach="fog" args={["#030712", 12, 30]} />

      <Particles />

      <group ref={helixRef}>
        <HelixSpine />
        {PROJECTS.map((proj, i) => (
          <Card3D
            key={proj.id}
            proj={proj} index={i}
            active={activeIndex === i}
            hovered={hoveredIndex === i}
            onClick={onCardClick}
            onHover={onCardHover}
          />
        ))}
      </group>
    </>
  );
}



// ─────────────────────────────────────────────────────────
//  HUD OVERLAY
// ─────────────────────────────────────────────────────────
function HUD({ currentIndex, project, onSelectDot }) {
  const N = PROJECTS.length;
  return (
    <>
      {/* Left info */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex}
          initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-10 }} transition={{ duration:0.35 }}
          style={{
            position:"fixed", left:36, top:"50%", transform:"translateY(-50%)",
            zIndex:200, pointerEvents:"none",
          }}
        >
          <div style={{
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",
            color: project.accentColor, marginBottom:7, fontWeight: 600,
          }}>{project.subtitle}</div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(26px,3vw,38px)",color:"#ffffff",
            lineHeight:1,letterSpacing:"0.03em",marginBottom:5,
            textShadow: `0 0 20px rgba(${project.accentRGB}, 0.4)`,
          }}>{project.title}</div>
          <div style={{
            width:38,height:2,marginBottom:7,
            background:`linear-gradient(90deg,${project.accentColor},transparent)`,
          }}/>
          <div style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:12,color:"rgba(255,255,255,0.65)",
          }}>{project.year}</div>
        </motion.div>
      </AnimatePresence>

      {/* Right counter + progress */}
      <div style={{
        position:"fixed", right:36, top:"50%", transform:"translateY(-50%)",
        zIndex:200, pointerEvents:"none",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8,
      }}>
        <div style={{ width:1, height:110, background:"rgba(255,255,255,0.15)", position:"relative" }}>
          <motion.div
            animate={{ height:`${(currentIndex/(N-1))*100}%` }}
            transition={{ duration:0.3 }}
            style={{ width:1, background: project.accentColor, position:"absolute", top:0, left:0 }}
          />
        </div>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:22, color:"#ffffff", letterSpacing:"0.05em",
        }}>{String(currentIndex + 1).padStart(2,"0")}</div>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em",
        }}>/ {String(N).padStart(2,"0")}</div>
        <motion.div
          animate={{ y:[0,7,0] }}
          transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }}
          style={{
            marginTop:18,
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:9, letterSpacing:"0.14em", color: project.accentColor,
            writingMode:"vertical-rl", textTransform:"uppercase", fontWeight: 600,
          }}
        >Scroll ↓</motion.div>
      </div>

      {/* Bottom dots */}
      <div style={{
        position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
        display:"flex", gap:9, zIndex:200, alignItems:"center",
      }}>
        {PROJECTS.map((_, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => onSelectDot && onSelectDot(i)}
            aria-label={`Jump to project ${i + 1}`}
            animate={{
              width: i === currentIndex ? 28 : 8,
              background: i === currentIndex ? project.accentColor : "rgba(255,255,255,0.25)",
            }}
            transition={{ duration: 0.25 }}
            style={{
              height: 8,
              borderRadius: 4,
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
              boxShadow: i === currentIndex ? `0 0 10px ${project.accentColor}` : "none",
            }}
          />
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT COMPONENT
// ─────────────────────────────────────────────────────────
export default function ProjectsGallery({ onBack }) {
  const scrollRef   = useRef(0);  // live 0→1 progress, no re-render
  const wheelBuf    = useRef(0);  // accumulated wheel delta
  const rafRef      = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex,  setActiveIndex]  = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [modalProj,    setModalProj]    = useState(null);
  const modalProjRef = useRef(null);
  modalProjRef.current = modalProj;

  // ── Smooth wheel accumulator → scroll progress ──────────
  useEffect(() => {
    const N = PROJECTS.length;

    const onWheel = (e) => {
      // If project detail modal is open, let the user scroll the detail page naturally!
      if (modalProjRef.current) return;
      e.preventDefault();
      wheelBuf.current += e.deltaY * 0.0008;
      wheelBuf.current = Math.max(0, Math.min(1, wheelBuf.current));
    };

    const tick = () => {
      // Ease scrollRef toward wheelBuf
      scrollRef.current += (wheelBuf.current - scrollRef.current) * 0.08;
      const idx = Math.round(scrollRef.current * (N - 1));
      setCurrentIndex(Math.max(0, Math.min(N - 1, idx)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Touch swipe
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      // If project detail modal is open, let mobile users scroll the detail page naturally!
      if (modalProjRef.current) return;
      const dy = startY - e.touches[0].clientY;
      wheelBuf.current = Math.max(0, Math.min(1,
        wheelBuf.current + dy * 0.004));
      startY = e.touches[0].clientY;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (modalProj) return;
      const step = 1 / (PROJECTS.length - 1);
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        wheelBuf.current = Math.min(1, wheelBuf.current + step);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")
        wheelBuf.current = Math.max(0, wheelBuf.current - step);
      if (e.key === "Escape") { setActiveIndex(-1); setModalProj(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalProj]);

  const handleClick = useCallback((idx) => {
    const same = activeIndex === idx;
    setActiveIndex(same ? -1 : idx);
    if (!same) setModalProj(PROJECTS[idx]);
  }, [activeIndex]);

  const handleHover = useCallback((idx) => { setHoveredIndex(idx); }, []);

  const handleSelectDot = useCallback((idx) => {
    const N = PROJECTS.length;
    wheelBuf.current = Math.max(0, Math.min(1, idx / (N - 1)));
    setCurrentIndex(idx);
  }, []);

  const curProj = PROJECTS[currentIndex];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#030712",
        backgroundImage: `
          radial-gradient(ellipse 65% 55% at 50% 48%, rgba(20, 52, 98, 0.32) 0%, rgba(8, 20, 46, 0.22) 45%, rgba(2, 5, 14, 0.98) 88%),
          radial-gradient(circle at 50% 50%, rgba(12, 25, 54, 0.4) 0%, #030712 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* ── BACK BUTTON ── */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            position: "fixed",
            top: 20,
            left: 24,
            zIndex: 400,
            padding: "10px 22px",
            background: "rgba(10, 16, 28, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            color: "rgba(255, 255, 255, 0.85)",
            borderRadius: 30,
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#38bdf8";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(56,189,248,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>←</span> BACK TO THE NEXUS
        </button>
      )}

      {/* ── WEBGL CANVAS ── */}
      <div style={{ position:"fixed", inset:0, zIndex:1 }}>
        <Canvas
          camera={{ position:[0,0,6.5], fov:58, near:0.1, far:100 }}
          gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}
          style={{ background:"transparent" }}
          onPointerMissed={() => { setActiveIndex(-1); }}
        >
          <Suspense fallback={null}>
            <Scene
              scrollRef={scrollRef}
              activeIndex={activeIndex}
              hoveredIndex={hoveredIndex}
              onCardClick={handleClick}
              onCardHover={handleHover}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── HUD ── */}
      <HUD currentIndex={currentIndex} project={curProj} onSelectDot={handleSelectDot} />

      {/* ── DEDICATED PROJECT DETAIL PAGE (3D MOTION TRANSITION) ── */}
      <AnimatePresence>
        {modalProj && (
          <ProjectDetailPage
            key={modalProj.id}
            project={modalProj}
            onBack={() => { setModalProj(null); setActiveIndex(-1); }}
            onSelectNext={(nextId) => {
              const nextP = PROJECTS.find(p => p.id === nextId);
              if (nextP) {
                setModalProj(nextP);
                const nextIdx = PROJECTS.findIndex(p => p.id === nextId);
                if (nextIdx >= 0) {
                  wheelBuf.current = nextIdx / (PROJECTS.length - 1);
                  setCurrentIndex(nextIdx);
                }
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

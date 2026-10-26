// ─────────────────────────────────────────────────────────
//  RESEARCH DATA — Infographics & Sectional Cards
// ─────────────────────────────────────────────────────────

export const RESEARCH_PROJECTS = [
  {
    id: "breast-cancer",
    number: "01",
    title: "Clinical Decision Support System for Breast Cancer Using NLP",
    subtitle: "Multimodal Capstone Research — 2+ Years Clinical Validation & Multi-Hospital Report Analysis",
    tag: "CAPSTONE RESEARCH · 2+ YEARS · HEALTHCARE AI / CLINICAL NLP · MULTI-HOSPITAL VALIDATION",
    overview: "A multi-year capstone research initiative developed under academic and clinical guidance (Mentored by Dr. Asma Parveen I. Siddavatam, VESIT). The project engineers an NLP-driven Clinical Decision Support System (CDSS) that parses unstructured diagnostic reports, histopathology texts, and diverse hospital templates to classify molecular subtypes (Luminal A/B, HER2+, TNBC) and map staging indicators against standardized clinical oncology protocols.",
    
    // Impact highlights
    hospitalTieUps: "Validated across heterogeneous multi-hospital clinical note formats, diagnostic templates, and oncology terminology variations.",
    researchDuration: "2+ Years Dedicated Research & Clinical Protocol Development",
    academicProgram: "Department of Information Technology, VESIT, Mumbai",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🏥",
        title: "Multi-Hospital Report Formats",
        desc: "Hospitals and pathology labs use varied abbreviations, terminology, and unstructured report templates, creating immense latency in cross-institutional oncology triage."
      },
      {
        icon: "🔬",
        title: "Biomarker Extraction Complexity",
        desc: "Extracting critical IHC receptor statuses (ER, PR, HER2) and molecular subtypes (including aggressive Triple-Negative Breast Cancer / TNBC) requires high-precision clinical NLP."
      },
      {
        icon: "🩺",
        title: "Protocol-Aligned Decision Support",
        desc: "Translating diagnostic findings into actionable, explainable guideline recommendations without treating AI as an uninterpretable black box."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Clinical Document Ingestion",
        desc: "Ingest unstructured pathology records, biopsy notes, and multi-hospital diagnostic reports."
      },
      {
        step: "02",
        name: "Biomarker & Entity Extraction",
        desc: "Extract hormonal receptor markers (ER/PR/HER2 status), histological grades, tumor size, and lymph node involvement using specialized biomedical NLP."
      },
      {
        step: "03",
        name: "Molecular Subtype Classification",
        desc: "Classify tumor biology into Luminal A, Luminal B, HER2-enriched, and Triple-Negative Breast Cancer (TNBC) categories."
      },
      {
        step: "04",
        name: "Oncological Decision Protocol",
        desc: "Cross-reference classified parameters with standard oncological treatment guidelines to deliver structured, physician-auditable decision support."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "RESEARCH LEAD",
        title: "2+ Years Capstone Research",
        desc: "Co-authored and engineered the end-to-end NLP clinical classification pipeline under faculty mentorship (Dr. Asma Parveen I. Siddavatam)."
      },
      {
        tag: "CLINICAL NLP",
        title: "Pathology Entity Extraction",
        desc: "Engineered robust tokenization and rule-augmented language models to handle noisy clinical abbreviations from diverse hospital lab templates."
      },
      {
        tag: "SUBTYPING ENGINE",
        title: "Molecular Subtype Classifier",
        desc: "Implemented automated classification for Luminal A/B, HER2+, and TNBC cohorts with multi-metric sensitivity and specificity validation."
      },
      {
        tag: "CLINICAL INTEGRATION",
        title: "Physician CDSS Interface",
        desc: "Built a transparent decision-support dashboard highlighting extracted evidence snippets alongside guideline-backed clinical pathways."
      }
    ],

    // Categorized Technologies
    techCategories: [
      { category: "Clinical NLP & AI", items: ["Python", "ClinicalBERT", "BioBERT", "scikit-learn"] },
      { category: "Data Ingestion & Extraction", items: ["PyTesseract OCR", "Pandas", "RegEx Biomarker Parsers"] },
      { category: "Clinical Decision Protocols", items: ["NCCN Guideline Mapping", "IHC Staging Logic", "TNBC Profiling"] },
      { category: "Deployment & Interface", items: ["FastAPI", "React / Next.js", "Docker"] }
    ],

    tech: ["Python", "ClinicalBERT", "scikit-learn", "FastAPI", "Clinical Decision Support (CDSS)"],
    accentColor: "#f472b6",     // Soft Rose Pink
    solidColor: "#f472b6",      // Solid Vibrant Rose Pink Card
    accentRGB: "244, 114, 182",
    tintBg: "rgba(253, 242, 248, 0.05)",
    tintBorder: "rgba(251, 207, 232, 0.22)",

    projectMethodology: [
      { step: "01", name: "Hospital Report Ingestion", desc: "Load real-world clinical reports and biopsy sheets across varied hospital formats." },
      { step: "02", name: "Preprocessing & Cleanse", desc: "Normalize clinical jargon, resolve contractions, and clean OCR text noise." },
      { step: "03", name: "Biomarker Feature Extraction", desc: "Extract ER, PR, HER2 receptor states, lymph involvement, and tumor staging." },
      { step: "04", name: "Molecular Subtyping", desc: "Determine exact biological subtype including Triple-Negative Breast Cancer (TNBC)." },
      { step: "05", name: "Clinical Guideline Cross-Check", desc: "Match patient subtype and stage with standard evidence-based oncology pathways." },
      { step: "06", name: "Explainable Output Presentation", desc: "Present predictions with source text highlighting and risk confidence intervals." }
    ],

    paper: {
      title: "Clinical Decision Support System for Breast Cancer Using NLP",
      shortSummary: "A 2+ year Capstone research publication detailing the design, multi-hospital pathology report validation, and clinical decision-support architecture for automated breast cancer classification.",
      pdfUrl: "/papers/breast-cancer-research.pdf",
      fileName: "breast-cancer-research.pdf",
      duration: "2+ Years Capstone Research",
      collaboration: "Hospital clinical template validation · Dept of Information Technology, VESIT",
      mentor: "Dr. Asma Parveen I. Siddavatam"
    }
  },
  {
    id: "helix",
    number: "02",
    title: "Project Helix — Constraint-Aware DNA Archival for Healthcare Data",
    subtitle: "B.E. Honors with Research — Semantic Compression & AI-Driven Reconstruction",
    tag: "B.E. HONORS WITH RESEARCH · SYNTHETIC DNA DATA ARCHIVAL · HEALTHCARE AI",
    overview: "Conducted under the prestigious B.E. Honors with Research program. Project Helix investigates an end-to-end computational framework for representing archival digital healthcare records as synthetic DNA nucleotide sequences. The research addresses biological synthesis constraints through rotational state mapping (preventing homopolymers and balancing GC content) combined with deep neural reconstruction for error-resilient recovery under sequencing noise.",

    researchDuration: "Honors with Research Thesis Project",
    academicProgram: "B.E. Honors with Research — VESIT, University of Mumbai",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🧬",
        title: "Synthesis & Sequencing Constraints",
        desc: "Synthetic DNA synthesis fails if sequences contain long homopolymer repeats (e.g. AAAAA) or extreme GC-skew, necessitating biological constraint-aware encoding."
      },
      {
        icon: "⚡",
        title: "Massive Healthcare Storage Overhead",
        desc: "Retention requirements for patient longitudinal records, genomic profiles, and imaging create unsustainable energy and media costs for magnetic tape and cold silicon."
      },
      {
        icon: "🔄",
        title: "Millennial Longevity Without Obsolescence",
        desc: "While magnetic tape degrades within 10–30 years, synthetic DNA offers information density exceeding 200 Petabytes/gram with thousands of years of biochemical stability."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Semantic Normalization & Compression",
        desc: "Standardize digital healthcare payloads (FHIR/DICOM schemas) and apply semantic-aware compression to maximize raw information density."
      },
      {
        step: "02",
        name: "Rotational Constraint Encoding",
        desc: "Execute a rotational state mapping algorithm translating binary streams into A, C, G, T nucleotides while guaranteeing zero homopolymers and 50% GC equilibrium."
      },
      {
        step: "03",
        name: "Simulated Biochemical Channel Noise",
        desc: "Stress-test encoded sequences through simulated chemical synthesis decay, PCR amplification bias, and Nanopore sequencing read errors."
      },
      {
        step: "04",
        name: "Neural Sequence Error Reconstruction",
        desc: "Deploy neural sequence models to decode noisy reads, correct substitution/insertion/deletion shifts, and verify 100% bitwise data recovery."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "HONORS RESEARCH",
        title: "Honors Research Formulation",
        desc: "Conceived and implemented the full computational pipeline under the B.E. Honors with Research degree curriculum."
      },
      {
        tag: "ALGORITHMS",
        title: "Rotational Nucleotide Mapping",
        desc: "Designed and benchmarked a rotational state-transition encoder guaranteeing strict GC-clamp boundaries and eliminating synthesis-breaking homopolymers."
      },
      {
        tag: "DEEP LEARNING",
        title: "Neural Error Reconstruction",
        desc: "Trained sequence-to-sequence neural models to reconstruct damaged DNA reads under high simulated sequencing error rates."
      },
      {
        tag: "BENCHMARKING",
        title: "Bit Error Rate Verification",
        desc: "Validated compression ratios and zero bit-loss recovery across synthetic patient records and clinical time-series benchmarks."
      }
    ],

    // Categorized Technologies
    techCategories: [
      { category: "DNA Encoding & Constraints", items: ["Python", "Rotational Encoders", "GC-Clamp Algorithms", "Homopolymer Checkers"] },
      { category: "Machine Learning & Reconstruction", items: ["PyTorch", "Sequence-to-Sequence Models", "Error Channel Simulators"] },
      { category: "Data Schemas & Compression", items: ["FHIR Healthcare Schemas", "Huffman / LZMA Compression", "NumPy"] },
      { category: "Benchmarking & Verification", items: ["Bit-Error Rate (BER) Harness", "Information Density Metrics"] }
    ],

    tech: ["Python", "PyTorch", "Rotational DNA Encoding", "Neural Error Correction", "Biomedical Data Archival"],
    accentColor: "#38bdf8",     // Ice Cyan
    solidColor: "#38bdf8",      // Solid Vibrant Ice Cyan Card
    accentRGB: "56, 189, 248",
    tintBg: "rgba(224, 242, 254, 0.05)",
    tintBorder: "rgba(186, 230, 253, 0.22)",

    projectMethodology: [
      { step: "01", name: "Healthcare Data Ingestion", desc: "Load patient record batches and structured clinical time-series." },
      { step: "02", name: "Semantic Compression", desc: "Compress structured clinical data to minimize nucleotide sequence length." },
      { step: "03", name: "Constraint-Aware DNA Mapping", desc: "Encode binary data into synthetic nucleotides enforcing GC content and run-length limits." },
      { step: "04", name: "Sequencing Noise Simulation", desc: "Inject realistic insertion, deletion, and substitution channel errors." },
      { step: "05", name: "Neural Sequence Reconstruction", desc: "Use deep learning to correct sequencing shift errors and restore exact records." },
      { step: "06", name: "Bitwise Integrity Verification", desc: "Confirm 100% loss-free reconstruction and measure effective net information density." }
    ],

    paper: {
      title: "Semantic-Aware Compression and AI-Driven Reconstruction for Constraint-Aware DNA Archival of Healthcare Data",
      shortSummary: "A B.E. Honors with Research publication presenting constraint-aware DNA nucleotide encoding algorithms and neural reconstruction models for ultra-long-term digital healthcare data archival.",
      pdfUrl: "/papers/project-helix.pdf",
      fileName: "project-helix.pdf",
      program: "B.E. Honors with Research Program",
      focus: "Synthetic DNA Archival, Rotational State Encoding, Deep Learning Reconstruction"
    }
  }
];

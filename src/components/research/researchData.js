// ─────────────────────────────────────────────────────────
//  RESEARCH DATA — Infographics & Sectional Cards
// ─────────────────────────────────────────────────────────

export const RESEARCH_PROJECTS = [
  {
    id: "breast-cancer",
    number: "01",
    title: "Breast Cancer Detection & Treatment Support",
    subtitle: "AI-Assisted Breast Cancer Classification and Clinical Decision Support",
    tag: "HEALTHCARE AI / MACHINE LEARNING / CLINICAL DECISION SUPPORT",
    overview: "This project explores the use of machine learning to support breast cancer classification and investigate treatment-related decision support. The system aims to help interpret relevant clinical or diagnostic inputs, with model performance and any treatment-support capabilities requiring validation against appropriate evidence.",
    
    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🔬",
        title: "Early Detection",
        desc: "Accurate classification of suspicious findings is important for supporting timely clinical assessment."
      },
      {
        icon: "📊",
        title: "Diagnostic Complexity",
        desc: "Interpreting diagnostic features consistently can be challenging and motivates computer-assisted analysis."
      },
      {
        icon: "🩺",
        title: "Treatment Decisions",
        desc: "Treatment planning depends on clinical factors that a detection model alone cannot establish."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Data Preparation",
        desc: "Obtain an appropriate dataset and prepare diagnostic features or medical images for analysis."
      },
      {
        step: "02",
        name: "Feature Processing",
        desc: "Clean and transform the inputs into a representation suitable for the selected model."
      },
      {
        step: "03",
        name: "Model Development",
        desc: "Train and evaluate a suitable machine-learning or deep-learning model for the defined classification task."
      },
      {
        step: "04",
        name: "Evaluation & Decision Support",
        desc: "Assess performance using appropriate metrics and present results as research support, not a substitute for clinical judgment."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "DATA",
        title: "Dataset Preparation",
        desc: "Structured data cleaning, normalization, and preparation of diagnostic features for model intake."
      },
      {
        tag: "MODELLING",
        title: "Classification Pipeline",
        desc: "Engineered model training pipeline evaluating decision boundaries across clinical attributes."
      },
      {
        tag: "EVALUATION",
        title: "Model Assessment",
        desc: "Benchmarked performance using sensitivity, specificity, and cross-validated evaluation metrics."
      },
      {
        tag: "APPLICATION",
        title: "Research Interface",
        desc: "Built research prototype displaying explainable classification predictions alongside clinical context."
      }
    ],

    // Categorized Technologies
    techCategories: [
      { category: "Data Processing", items: ["Python", "Pandas", "NumPy"] },
      { category: "Machine Learning", items: ["Scikit-learn", "XGBoost"] },
      { category: "Deep Learning & Imaging", items: ["PyTorch (Exploratory)", "OpenCV"] },
      { category: "Visualization & UI", items: ["Streamlit", "Matplotlib"] }
    ],

    tech: ["Python", "Pandas", "Scikit-learn", "NumPy", "Matplotlib"],
    accentColor: "#f472b6",     // Soft Rose Pink
    solidColor: "#f472b6",      // Solid Vibrant Rose Pink Card
    accentRGB: "244, 114, 182",
    tintBg: "rgba(253, 242, 248, 0.05)",
    tintBorder: "rgba(251, 207, 232, 0.22)",

    projectMethodology: [
      { step: "01", name: "Data Input", desc: "Load the actual diagnostic dataset or supported image input." },
      { step: "02", name: "Preprocessing", desc: "Prepare and validate inputs." },
      { step: "03", name: "Feature Extraction", desc: "Extract or select the features required by the model." },
      { step: "04", name: "Model Inference", desc: "Generate a classification prediction." },
      { step: "05", name: "Performance Evaluation", desc: "Assess predictions against reference labels." },
      { step: "06", name: "Result Presentation", desc: "Display the model output and relevant limitations." },
      { step: "07", name: "Clinical Context", desc: "Present any validated treatment-support information separately from the classification result." }
    ],

    paper: {
      title: "AI-Assisted Breast Cancer Classification and Clinical Decision Support",
      shortSummary: "An exploratory research investigation evaluating machine learning classification pipelines and clinical decision-support pathways for breast cancer diagnostic data.",
      pdfUrl: "/papers/breast-cancer-research.pdf",
      fileName: "breast-cancer-research.pdf",
    }
  },
  {
    id: "helix",
    number: "02",
    title: "Project Helix",
    subtitle: "AI-Assisted Synthetic DNA Archival Framework for Healthcare",
    tag: "HEALTHCARE AI / DNA DATA ARCHIVAL",
    overview: "Project Helix investigates a computational framework for representing digital healthcare records as synthetic DNA nucleotide sequences. It explores data normalization, compression, constraint-aware encoding, security considerations, and reconstruction, with the goal of evaluating whether this approach can support reliable long-term archival.",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "⏳",
        title: "Long-Term Data Integrity",
        desc: "Digital archives require ongoing integrity checks and protection against media failure or data corruption."
      },
      {
        icon: "⚡",
        title: "Storage Overhead",
        desc: "Retaining large healthcare datasets creates storage, maintenance, and energy requirements."
      },
      {
        icon: "🔄",
        title: "Format Obsolescence",
        desc: "Changing storage technologies and formats can complicate long-term access and migration."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Semantic Normalization",
        desc: "Standardize healthcare records into a consistent digital representation."
      },
      {
        step: "02",
        name: "Intelligent Compression",
        desc: "Reduce data redundancy before encoding."
      },
      {
        step: "03",
        name: "Constraint-Aware DNA Encoding",
        desc: "Map digital data to synthetic nucleotide sequences while enforcing the chosen sequence constraints."
      },
      {
        step: "04",
        name: "AI-Assisted Reconstruction",
        desc: "Decode the representation and evaluate recovery accuracy, data integrity, and robustness."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "ARCHITECTURE",
        title: "End-to-End Computational Pipeline",
        desc: "Proposed pipeline connecting preprocessing, compression, encoding, and reconstruction."
      },
      {
        tag: "ALGORITHMS",
        title: "Rotational Nucleotide Mapping",
        desc: "Rotational state mapping avoiding homopolymer runs and maintaining GC equilibrium."
      },
      {
        tag: "MACHINE LEARNING",
        title: "Neural Error Reconstruction Model",
        desc: "Neural sequence model evaluating error recovery under simulated read noise."
      },
      {
        tag: "VERIFICATION",
        title: "Validation & Benchmarking Harness",
        desc: "Systematic verification suite measuring reconstruction accuracy and bit error rates."
      }
    ],

    // Categorized Technologies
    techCategories: [
      { category: "Programming & Data", items: ["Python", "Pandas"] },
      { category: "DNA Encoding", items: ["Custom Nucleotide Mapping", "Sequence Validation"] },
      { category: "Machine Learning", items: ["PyTorch (Exploratory)"] },
      { category: "Testing & Evaluation", items: ["Reconstruction Checks", "Integrity Benchmarks"] }
    ],

    tech: ["Python", "Pandas", "DNA Encoders", "PyTorch", "Integrity Tests"],
    accentColor: "#38bdf8",     // Ice Cyan
    solidColor: "#38bdf8",      // Solid Vibrant Ice Cyan Card
    accentRGB: "56, 189, 248",
    tintBg: "rgba(224, 242, 254, 0.05)",
    tintBorder: "rgba(186, 230, 253, 0.22)",

    projectMethodology: [
      { step: "01", name: "Healthcare Data Input", desc: "Load the permitted healthcare records or synthetic test records." },
      { step: "02", name: "Semantic Normalization", desc: "Convert the input into a consistent representation." },
      { step: "03", name: "Compression", desc: "Reduce redundancy using the selected compression method." },
      { step: "04", name: "DNA Sequence Encoding", desc: "Map the compressed representation to nucleotide sequences." },
      { step: "05", name: "Archival & Security", desc: "Apply the defined storage and security mechanisms." },
      { step: "06", name: "Sequence Decoding", desc: "Convert the encoded representation back into digital data." },
      { step: "07", name: "Integrity & Recovery Validation", desc: "Compare reconstructed output with the original and measure recovery performance." }
    ],

    paper: {
      title: "AI-Assisted Synthetic DNA Archival Framework for Healthcare",
      shortSummary: "A research investigation evaluating computational normalization, rotational encoding constraints, and AI-assisted reconstruction for digital healthcare data preservation in synthetic DNA.",
      pdfUrl: "/papers/project-helix.pdf",
      fileName: "project-helix.pdf",
    }
  }
];

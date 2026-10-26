// ─────────────────────────────────────────────────────────
//  EXPERIENCE DATA — 4 Core Professional & Leadership Sections
// ─────────────────────────────────────────────────────────

export const EXPERIENCES = [
  {
    id: "palcoa",
    number: "01",
    company: "Palcoa Solutions",
    role: "Software Intern — OCR & Image Processing",
    duration: "December 2024 – April 2025",
    tag: "COMPUTER VISION / OCR / AUTOMATION",
    overview: "Engineered automated OCR data pipelines and computer vision filters using Python, OpenCV, and PyTesseract. Reduced manual invoice and document transcription turnaround time by 75% across high-volume scanned batches.",
    
    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🖼️",
        title: "Heterogeneous Scanned Documents",
        desc: "Important enterprise records arrive in scanned, skewed, and noisy images requiring conversion into structured digital text."
      },
      {
        icon: "⌨️",
        title: "Manual Transcription Bottleneck",
        desc: "Manually transcribing multi-page invoices and tabular records is error-prone and creates multi-day operational delays."
      },
      {
        icon: "⚙️",
        title: "High-Volume Throughput",
        desc: "Automated OCR workflows standardize, validate, and accelerate document processing with sub-second per-page extraction."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Image Batch Ingestion",
        desc: "Collect and ingest document scans, invoices, and photos containing raw visual text."
      },
      {
        step: "02",
        name: "Computer Vision Preprocessing",
        desc: "Apply OpenCV noise reduction, adaptive Otsu thresholding, and deskewing to optimize image clarity."
      },
      {
        step: "03",
        name: "OCR Engine Recognition",
        desc: "Run PyTesseract with tuned page segmentation modes (PSM) to extract character streams."
      },
      {
        step: "04",
        name: "Structured Output Extraction",
        desc: "Normalize, regex-validate, and structure extracted fields into clean JSON payloads for database storage."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "OCR PIPELINE",
        title: "Automated Ingestion Pipeline",
        desc: "Architected end-to-end Python batch processing scripts extracting structured text from thousands of raw document scans."
      },
      {
        tag: "COMPUTER VISION",
        title: "Multi-Stage Preprocessing",
        desc: "Implemented adaptive thresholding, Otsu binarization, and deskewing routines, lifting baseline OCR accuracy by 28%."
      },
      {
        tag: "TEXT EXTRACTION",
        title: "Tesseract Custom Heuristics",
        desc: "Tuned PyTesseract page segmentation modes (PSM) and whitelist regexes for invoice tables and noisy font weights."
      },
      {
        tag: "SYSTEM IMPACT",
        title: "75% Latency Reduction",
        desc: "Replaced manual data transcription with automated structured JSON output, slashing operational turnaround time."
      }
    ],

    // Key Technologies (Categorized in 4 Groups)
    techCategories: [
      { category: "Programming", items: ["Python", "Bash Scripts"] },
      { category: "Computer Vision", items: ["OpenCV", "NumPy Image Arrays"] },
      { category: "OCR Engines", items: ["PyTesseract", "Tesseract OCR"] },
      { category: "Automation", items: ["Batch Processing", "Text Normalization"] }
    ],

    tech: ["Python", "OpenCV", "PyTesseract", "Image Processing"],
    accentColor: "#0ea5e9",     // Bright Sky Blue
    accentRGB: "14, 165, 233",
    lightCardBg: "#e0f2fe",     // Light Sky Blue pastel card
    lightBorder: "rgba(14, 165, 233, 0.45)",
    badgeBg: "rgba(14, 165, 233, 0.15)",
    badgeText: "#0369a1",
    tintBg: "rgba(224, 242, 254, 0.05)",
    tintBorder: "rgba(186, 230, 253, 0.22)",

    // Pipeline Stages for Modal
    pipelineStages: [
      { step: "01", name: "Image Input", desc: "Provide an image or scanned document containing text." },
      { step: "02", name: "Image Loading", desc: "Load and decode the image into memory using OpenCV." },
      { step: "03", name: "Preprocessing", desc: "Apply grayscale conversion, thresholding, and noise reduction." },
      { step: "04", name: "Text Recognition", desc: "Extract character glyphs and text using the Tesseract OCR engine." },
      { step: "05", name: "Text Processing", desc: "Clean extraneous whitespace, correct formatting, and organize output." },
      { step: "06", name: "Output Review", desc: "Inspect and validate extracted text for quality and completeness." },
      { step: "07", name: "Workflow Completion", desc: "Deliver structured machine-readable text for database ingestion." }
    ],

    // Evidence & Deliverables
    evidence: {
      primaryDeliverable: "Automated OCR text extraction pipeline.",
      coreTechnologies: "Python, OpenCV, PyTesseract.",
      supportingNotes: "Internship verification and codebase documentation covering image-to-text batch processing."
    }
  },

  {
    id: "zemo",
    number: "02",
    company: "Zemo – Sports Reconnect",
    role: "Software Intern",
    duration: "May 2025 – August 2025",
    tag: "SPORTS TECHNOLOGY / SCHEDULING AUTOMATION",
    overview: "Engineered an automated sports fixture generation engine and schedule optimizer using constraint satisfaction algorithms. Automated complex bracket generation across 30+ simultaneous team leagues.",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "📅",
        title: "Multi-Team Scheduling Complexity",
        desc: "Creating balanced tournament fixtures across dozens of teams requires managing venue constraints, referee allocations, and team rest intervals."
      },
      {
        icon: "🔀",
        title: "Dynamic Tournament Brackets",
        desc: "Different formats (round-robin, knockout brackets, tiered divisions) demand custom constraint-satisfaction heuristics."
      },
      {
        icon: "⏱️",
        title: "Zero-Collision Guarantee",
        desc: "Automating match allocations eliminates double-booked courts and prevents unfair rest discrepancies between competing squads."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "League & Venue Parameters",
        desc: "Ingest participating team rosters, available pitches/courts, and operating time windows."
      },
      {
        step: "02",
        name: "Constraint Rules Engine",
        desc: "Apply mathematical constraint satisfaction rules (backtracking, round-robin rotation matrices)."
      },
      {
        step: "03",
        name: "Collision-Free Generation",
        desc: "Compute optimized match schedules in milliseconds with balanced home/away distribution."
      },
      {
        step: "04",
        name: "Interactive Schedule Views",
        desc: "Present computed match matrices in interactive calendar and table views for coaches and league officials."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "ALGORITHMIC SCHEDULING",
        title: "Constraint Scheduling Engine",
        desc: "Designed round-robin and knockout fixture generation algorithms resolving court availability and fair rest intervals."
      },
      {
        tag: "ZERO CONFLICTS",
        title: "Collision-Free Allocations",
        desc: "Implemented constraint checks eliminating double-booking across venues and referee rosters."
      },
      {
        tag: "TOURNAMENTS",
        title: "Multi-Format Bracket Engine",
        desc: "Supported round-robin, single/double knockout, and multi-tier group stage formats with instant re-seeding."
      },
      {
        tag: "PRODUCTION IMPACT",
        title: "Sub-Second Computation",
        desc: "Reduced league coordination overhead from days of spreadsheet adjustments to sub-second automated schedule computation."
      }
    ],

    // Key Technologies (Categorized in 4 Groups)
    techCategories: [
      { category: "Scheduling", items: ["Round-Robin Algorithms", "Knockout Brackets"] },
      { category: "Application Stack", items: ["JavaScript / TypeScript", "Node.js"] },
      { category: "Data Processing", items: ["Team & Player State", "JSON Schemas"] },
      { category: "Automation", items: ["Automated Fixture Engine", "Validation Rules"] }
    ],

    tech: ["Algorithms", "JavaScript", "Scheduling Automation", "Sports Tech"],
    accentColor: "#f59e0b",     // Bright Amber Gold
    accentRGB: "245, 158, 11",
    lightCardBg: "#fef3c7",     // Light Warm Gold pastel card
    lightBorder: "rgba(245, 158, 11, 0.45)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "#b45309",
    tintBg: "rgba(254, 243, 199, 0.05)",
    tintBorder: "rgba(252, 211, 77, 0.22)",

    // Pipeline Stages for Modal
    pipelineStages: [
      { step: "01", name: "Tournament Setup", desc: "Define tournament requirements, dates, and venue capacity." },
      { step: "02", name: "Participant Input", desc: "Provide registered team, player, and seeding information." },
      { step: "03", name: "Format Selection", desc: "Select supported tournament format (round-robin, knockout, league)." },
      { step: "04", name: "Schedule Generation", desc: "Apply algorithmic rules to balance home/away matches and resting intervals." },
      { step: "05", name: "Fixture Organization", desc: "Arrange the generated match fixtures across designated slots and courts." },
      { step: "06", name: "Schedule Review", desc: "Inspect and validate the generated output for rule conflicts." },
      { step: "07", name: "Fixture Delivery", desc: "Export and present the final verified fixtures for official tournament use." }
    ],

    // Evidence & Deliverables
    evidence: {
      primaryDeliverable: "Automated sports fixture generator engine.",
      coreTechnologies: "Scheduling algorithms, Tournament-planning automation.",
      supportingNotes: "Software internship deliverable streamlining sports tournament fixture generation."
    }
  },

  {
    id: "ieee",
    number: "03",
    company: "IEEE-VESIT & NGO Volunteering",
    role: "SE Coordinator & Community Volunteer",
    duration: "August 2023 – Present",
    tag: "LEADERSHIP / EVENT MANAGEMENT / COMMUNITY OUTREACH",
    overview: "Coordinated technical events and hackathons while supporting student engagement and professional networking. Also contributed to community education initiatives through teaching sessions for students and women.",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🤝",
        title: "Student Engagement",
        desc: "Technical collegiate communities require structured, hands-on activities to encourage active participation."
      },
      {
        icon: "🎯",
        title: "Event Execution Logistics",
        desc: "Large-scale hackathons and technical seminars demand rigorous coordination, speaker management, and execution."
      },
      {
        icon: "🌱",
        title: "Community Educational Access",
        desc: "Underrepresented community groups benefit significantly from accessible STEM teaching and digital literacy initiatives."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Planning",
        desc: "Coordinate event scopes, scheduling, activity roadmaps, and administrative requirements."
      },
      {
        step: "02",
        name: "Team Coordination",
        desc: "Collaborate with student participants, faculty mentors, and technical organizers."
      },
      {
        step: "03",
        name: "Engagement",
        desc: "Facilitate hackathons, technical workshops, and peer-to-peer professional networking."
      },
      {
        step: "04",
        name: "Outreach",
        desc: "Conduct community education sessions and digital empowerment workshops for students and women."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "LEADERSHIP",
        title: "Student Coordination & Leadership",
        desc: "Supported departmental student engagement and technical activity coordination."
      },
      {
        tag: "EVENTS",
        title: "Technical Events & Hackathons",
        desc: "Helped organize inter-college technical events, hackathons, and speaker symposiums."
      },
      {
        tag: "NETWORKING",
        title: "Professional Engagement",
        desc: "Fostered professional networking, mentoring channels, and community participation."
      },
      {
        tag: "OUTREACH",
        title: "Community Education & Teaching",
        desc: "Conducted hands-on teaching sessions for school students and women in NGO literacy programs."
      }
    ],

    // Key Skills (Categorized in 4 Groups)
    techCategories: [
      { category: "Leadership", items: ["Team Coordination", "Student Engagement"] },
      { category: "Event Management", items: ["Hackathon Logistics", "Schedule Planning"] },
      { category: "Communication", items: ["Professional Networking", "Cross-Team Alignment"] },
      { category: "Community Outreach", items: ["STEM Teaching", "Digital Literacy"] }
    ],

    tech: ["Leadership", "Hackathon Organization", "Public Speaking", "Community Outreach"],
    accentColor: "#10b981",     // Bright Emerald Green
    accentRGB: "16, 185, 129",
    lightCardBg: "#d1fae5",     // Light Mint Green pastel card
    lightBorder: "rgba(16, 185, 129, 0.45)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#047857",
    tintBg: "rgba(209, 250, 229, 0.05)",
    tintBorder: "rgba(167, 243, 208, 0.22)",

    // Activity Stages for Modal
    pipelineStages: [
      { step: "01", name: "Activity Planning", desc: "Identify event milestones, outreach objectives, and workshop curriculum." },
      { step: "02", name: "Coordination", desc: "Align volunteer teams, participants, speakers, and venue resources." },
      { step: "03", name: "Logistics", desc: "Oversee operational setup, technical infrastructure, and materials." },
      { step: "04", name: "Engagement", desc: "Facilitate participant interaction, mentoring, and collaborative problem-solving." },
      { step: "05", name: "Delivery", desc: "Execute planned hackathon rounds and interactive teaching sessions." },
      { step: "06", name: "Feedback", desc: "Collect participant feedback to identify lessons and opportunities for improvement." },
      { step: "07", name: "Community Impact", desc: "Sustain ongoing engagement, mentorship follow-ups, and community outreach." }
    ],

    // Evidence & Deliverables
    evidence: {
      primaryDeliverable: "Technical event leadership and community educational outreach.",
      coreTechnologies: "Event logistics, Student mentoring, NGO literacy curriculum.",
      supportingNotes: "IEEE-VESIT collegiate coordinator role records and community education volunteering initiatives."
    }
  },

  {
    id: "freelance",
    number: "04",
    company: "Freelance & Independent Solutions",
    role: "Freelance Web Developer & Automation Solutions",
    duration: "2024 – Present",
    tag: "WEB DEVELOPMENT / BUSINESS AUTOMATION / CLIENT SOLUTIONS",
    overview: "Delivered freelance digital solutions for clients across real estate, beauty, automation, and hospitality. The work includes website development for Dreams Home and Arudhya Reality, a website for Sadhna Beauty, automation solutions for ISR Thane, and a digital solution for SSR Cafe.",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🌐",
        title: "Digital Presence Gap",
        desc: "Local businesses require modern, credible online storefronts that clearly communicate services to prospective clients."
      },
      {
        icon: "⚙️",
        title: "Repetitive Manual Workflows",
        desc: "Operational workflows often rely on manual data entry that can be streamlined through custom automation."
      },
      {
        icon: "📱",
        title: "Customer Discovery & UX",
        desc: "Responsive digital experiences help customers easily browse offerings, menus, and contact businesses directly."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Client Discovery",
        desc: "Understand each client's specific business model, target audience, and functional requirements."
      },
      {
        step: "02",
        name: "Solution Design",
        desc: "Plan the responsive UI architecture, content hierarchy, and necessary automation integrations."
      },
      {
        step: "03",
        name: "Development & Integration",
        desc: "Build the production web applications and integrate workflow automation mechanisms."
      },
      {
        step: "04",
        name: "Testing & Delivery",
        desc: "Conduct cross-browser and mobile testing, deploy the solution, and train client stakeholders."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "WEB DEV",
        title: "Real Estate Portals",
        desc: "Built modern responsive property websites for Dreams Home and Arudhya Reality."
      },
      {
        tag: "WEB DEV",
        title: "Beauty & Wellness Platform",
        desc: "Developed a branded digital presence and service catalog website for Sadhna Beauty."
      },
      {
        tag: "AUTOMATION",
        title: "Business Workflow Automation",
        desc: "Engineered customized workflow automation tools to reduce manual operational overhead for ISR Thane."
      },
      {
        tag: "HOSPITALITY",
        title: "Cafe Digital Experience",
        desc: "Delivered digital menu and customer engagement solutions for SSR Cafe."
      }
    ],

    // Key Technologies (Categorized in 4 Groups)
    techCategories: [
      { category: "Frontend Dev", items: ["React", "HTML5 / CSS3", "Tailwind CSS"] },
      { category: "Backend & Logic", items: ["Node.js", "REST APIs"] },
      { category: "Workflow Automation", items: ["Python Scripts", "Process Automation"] },
      { category: "Deployment", items: ["Vercel", "Domain & DNS Setup"] }
    ],

    tech: ["Web Development", "Client Automation", "React", "Node.js", "UI/UX"],
    accentColor: "#a855f7",     // Bright Violet Purple
    accentRGB: "168, 85, 247",
    lightCardBg: "#f3e8ff",     // Light Lavender Purple pastel card
    lightBorder: "rgba(168, 85, 247, 0.45)",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    badgeText: "#7e22ce",
    tintBg: "rgba(243, 232, 255, 0.05)",
    tintBorder: "rgba(233, 213, 255, 0.22)",

    // Pipeline Stages for Modal
    pipelineStages: [
      { step: "01", name: "Requirements Gathering", desc: "Meet with business owners to establish branding, scope, and technical deliverables." },
      { step: "02", name: "Architecture & Planning", desc: "Map user journeys, sitemaps, and data submission flows." },
      { step: "03", name: "Interface Design", desc: "Establish mobile-responsive design systems with modern typography and fast layouts." },
      { step: "04", name: "Implementation", desc: "Develop the frontend web application and integrate custom automation scripts." },
      { step: "05", name: "Integration", desc: "Connect contact forms, social APIs, domain records, and analytics tracking." },
      { step: "06", name: "Testing & QA", desc: "Verify performance, responsive rendering across viewports, and usability." },
      { step: "07", name: "Deployment & Delivery", desc: "Launch the production application and hand over operational access to the client." }
    ],

    // Evidence & Deliverables
    evidence: {
      primaryDeliverable: "Full-stack client websites and business workflow automations.",
      coreTechnologies: "React, Node.js, Custom Automation Scripts, Responsive Design.",
      supportingNotes: "Delivered solutions for Dreams Home, Arudhya Reality, Sadhna Beauty, ISR Thane, and SSR Cafe."
    }
  }
];

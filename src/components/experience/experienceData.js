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
    overview: "Developed OCR automation workflows using Python, OpenCV, and PyTesseract to extract text from images. Worked on streamlining image-to-text processing to reduce manual data extraction effort.",
    
    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "🖼️",
        title: "Image-Based Data",
        desc: "Important information stored in scanned documents and images requires conversion into machine-readable text."
      },
      {
        icon: "⌨️",
        title: "Manual Extraction",
        desc: "Manually transcribing image content and tabular invoices is repetitive, error-prone, and time-consuming."
      },
      {
        icon: "⚙️",
        title: "Processing Efficiency",
        desc: "Automated OCR workflows can help standardize and accelerate high-volume text extraction pipelines."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Image Input",
        desc: "Collect and ingest document and photo images containing raw visual text."
      },
      {
        step: "02",
        name: "Image Preprocessing",
        desc: "Use OpenCV filtering, adaptive thresholding, and deskewing to prepare images for OCR."
      },
      {
        step: "03",
        name: "Text Recognition",
        desc: "Apply PyTesseract OCR engine to extract machine-readable text buffers."
      },
      {
        step: "04",
        name: "Output Processing",
        desc: "Clean, parse, and organize extracted text for structured downstream consumption."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "AUTOMATION",
        title: "OCR Automation Workflow",
        desc: "Developed end-to-end OCR automation scripts using Python and OpenCV."
      },
      {
        tag: "COMPUTER VISION",
        title: "Image Preprocessing Pipeline",
        desc: "Engineered image contrast enhancement, binarization, and noise filtering for text extraction."
      },
      {
        tag: "TEXT EXTRACTION",
        title: "OCR Engine Integration",
        desc: "Integrated PyTesseract with custom configuration flags to recognize text from variable images."
      },
      {
        tag: "EFFICIENCY",
        title: "Workflow Streamlining",
        desc: "Helped streamline image-to-text data extraction, significantly reducing manual data entry."
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
    overview: "Built an automated sports fixture generator to support tournament planning. The system incorporated scheduling logic to generate fixtures and reduce the manual effort involved in organizing tournaments.",

    // Infographic: 3 Core Problem Points
    problemPoints: [
      {
        icon: "📅",
        title: "Manual Scheduling Overhead",
        desc: "Creating tournament fixtures manually requires substantial time, spreadsheet coordination, and conflict resolution."
      },
      {
        icon: "🔀",
        title: "Fixture Rule Complexity",
        desc: "Different tournament formats (round-robin, knockout, multi-stage) require varying scheduling constraints."
      },
      {
        icon: "⏱️",
        title: "Operational Inefficiency",
        desc: "Automating fixture generation can simplify repetitive tournament-planning tasks and avoid match overlap."
      }
    ],

    // Infographic: 4-Step Technical Approach Flow
    approachFlow: [
      {
        step: "01",
        name: "Tournament Input",
        desc: "Define the tournament format, venue allocations, and participating teams or players."
      },
      {
        step: "02",
        name: "Scheduling Logic",
        desc: "Apply the scheduling algorithms and constraint rules required by the selected tournament format."
      },
      {
        step: "03",
        name: "Fixture Generation",
        desc: "Generate the corresponding balanced match schedule automatically without court collisions."
      },
      {
        step: "04",
        name: "Schedule Output",
        desc: "Present the generated fixtures in interactive calendar and table views for tournament planning."
      }
    ],

    // Infographic: My Contribution Deliverables
    contributionPoints: [
      {
        tag: "ALGORITHMS",
        title: "Scheduling Logic Engine",
        desc: "Built algorithmic scheduling logic for automated sports fixture generation."
      },
      {
        tag: "AUTOMATION",
        title: "Automated Fixture Generator",
        desc: "Developed core service to generate multi-team tournament fixtures automatically."
      },
      {
        tag: "TOURNAMENTS",
        title: "Tournament Format Support",
        desc: "Engineered schedule generation across multiple tournament structures and brackets."
      },
      {
        tag: "EFFICIENCY",
        title: "Operational Workflow Improvement",
        desc: "Helped reduce the manual effort and coordination time required for tournament scheduling."
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

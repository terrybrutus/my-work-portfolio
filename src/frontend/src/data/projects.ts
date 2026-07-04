export type Lane =
  | "Enablement"
  | "AI Operations"
  | "Learning Experience"
  | "Technical Product"
  | "Sales Enablement"
  | "Compliance";

export type ProofPoint = {
  id: string;
  label: string;
  value: string;
  detail: string;
  lanes: Lane[];
};

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  actions: string[];
  outcomes: string[];
  tags: string[];
  lanes: Lane[];
  proofIds: string[];
  artifactHighlights: string[];
  mediaNeeds: string[];
  sourceNote: string;
  repo?: string;
};

export type LaneProfile = {
  lane: Lane;
  headline: string;
  reviewerTakeaway: string;
  proofNarrative: string;
  evidenceFocus: string[];
  keywords: string[];
};

export type HumanHighlight = {
  label: string;
  detail: string;
};

export type BrainSource = {
  id: string;
  title: string;
  type: string;
  status: "ready" | "needs cleanup" | "private source" | "needs artifact";
  linkedProjectIds: string[];
  note: string;
};

export type AcceptedEvidenceType = {
  extension: string;
  use: string;
};

export const profile = {
  name: "Terry Brutus",
  title: "Enablement Systems and Learning Experience Builder",
  location: "Leland, NC",
  email: "terrbrutus@gmail.com",
  linkedIn: "https://www.linkedin.com/in/terrybrutus",
  github: "https://github.com/terrybrutus",
  headline:
    "I build practical enablement systems for teams that need clearer execution.",
  shortSummary:
    "I connect instructional systems design, AI workflow design, and product-minded execution so complex work becomes easier to learn, run, and measure.",
};

export const laneProfiles: LaneProfile[] = [
  {
    lane: "Enablement",
    headline: "Enablement systems for clearer execution.",
    reviewerTakeaway:
      "Strong fit for onboarding, manager support, stakeholder alignment, role readiness, and practical performance support.",
    proofNarrative:
      "The emphasis here is operating clarity: how Terry turns messy role expectations, stakeholder needs, and learning moments into systems people can actually use.",
    evidenceFocus: ["Role readiness", "Manager support", "Adoption signals"],
    keywords: [
      "enablement",
      "onboarding",
      "readiness",
      "adoption",
      "stakeholder",
      "manager",
      "talent",
      "performance",
      "change",
    ],
  },
  {
    lane: "AI Operations",
    headline: "AI-assisted workflows with human quality gates.",
    reviewerTakeaway:
      "Strong fit for AI adoption, content operations, process automation, QA, and repeatable production systems.",
    proofNarrative:
      "The emphasis here is practical AI adoption: faster workflows, clear quality gates, and human review where judgment still matters.",
    evidenceFocus: [
      "Workflow acceleration",
      "Quality control",
      "Human-in-the-loop review",
    ],
    keywords: [
      "ai",
      "automation",
      "llm",
      "workflow",
      "operations",
      "rag",
      "prompt",
      "qa",
      "process",
    ],
  },
  {
    lane: "Learning Experience",
    headline: "Learning products that turn complexity into practice.",
    reviewerTakeaway:
      "Strong fit for instructional design, simulations, curriculum, course design, facilitation, and learner-centered systems.",
    proofNarrative:
      "The emphasis here is learning that moves past content delivery and into practice, feedback, and real workplace decision-making.",
    evidenceFocus: [
      "Scenario design",
      "Instructional systems",
      "Practice-centered learning",
    ],
    keywords: [
      "learning",
      "instructional",
      "training",
      "curriculum",
      "course",
      "facilitation",
      "lxd",
      "elearning",
      "storyboard",
    ],
  },
  {
    lane: "Technical Product",
    headline: "Workflow tools built around evidence and adoption.",
    reviewerTakeaway:
      "Strong fit for prototypes, workflow platforms, dashboards, technical translation, user flows, and product-adjacent systems work.",
    proofNarrative:
      "The emphasis here is product-minded execution: turning ambiguous workflow problems into usable tools, clear states, and inspectable evidence.",
    evidenceFocus: [
      "Working prototypes",
      "Workflow states",
      "Evidence-backed iteration",
    ],
    keywords: [
      "product",
      "platform",
      "dashboard",
      "prototype",
      "technical",
      "systems",
      "tool",
      "ux",
      "data",
    ],
  },
  {
    lane: "Sales Enablement",
    headline: "Sales readiness tied to field execution.",
    reviewerTakeaway:
      "Strong fit for GTM readiness, seller onboarding, field messaging, manager coaching, and adoption support.",
    proofNarrative:
      "The emphasis here is field readiness: translating operating expectations into seller support, manager touchpoints, and repeatable adoption paths.",
    evidenceFocus: ["Seller readiness", "Field messaging", "Manager coaching"],
    keywords: [
      "sales",
      "seller",
      "revenue",
      "gtm",
      "field",
      "crm",
      "customer",
      "messaging",
      "coaching",
    ],
  },
  {
    lane: "Compliance",
    headline: "Learning systems that are easier to complete and defend.",
    reviewerTakeaway:
      "Strong fit for regulated training, accessibility, governance, audit evidence, required learning, and documentation-heavy environments.",
    proofNarrative:
      "The emphasis here is defensible learning infrastructure: required training that is easier to complete, track, explain, and improve.",
    evidenceFocus: [
      "Audit evidence",
      "Access constraints",
      "Governance support",
    ],
    keywords: [
      "compliance",
      "audit",
      "accessibility",
      "508",
      "wcag",
      "governance",
      "policy",
      "regulated",
      "security",
    ],
  },
];

export const proofPoints: ProofPoint[] = [
  {
    id: "defense-workforce",
    label: "Defense workforce supported",
    value: "158,000",
    detail:
      "Supported learning and talent-development systems for a large defense acquisition audience.",
    lanes: ["Enablement", "Compliance"],
  },
  {
    id: "army-lms",
    label: "Army LMS platform scale",
    value: "1.2M+ users",
    detail:
      "Worked in a technical simulation and LMS environment with enterprise-scale deployment expectations.",
    lanes: ["Learning Experience", "Compliance", "Technical Product"],
  },
  {
    id: "asset-cycle",
    label: "Asset cycle improvement",
    value: "1.5 hrs to 9.5 min",
    detail:
      "Reduced repeated talent-content processing with AI-assisted analysis, scripting, and QA standards.",
    lanes: ["AI Operations", "Enablement"],
  },
  {
    id: "audit-cost",
    label: "Audit cost reduction",
    value: "90%",
    detail:
      "Used structured review logic to reduce manual audit burden while keeping human review in the loop.",
    lanes: ["AI Operations", "Compliance"],
  },
  {
    id: "market-lots",
    label: "Market lots standardized",
    value: "76,000",
    detail:
      "Designed scalable enablement touchpoints for a distributed selling-community environment.",
    lanes: ["Sales Enablement", "Enablement"],
  },
  {
    id: "municipal-coverage",
    label: "Municipal coverage",
    value: "1,750+ employees",
    detail:
      "Built mobile-first compliance support for a workforce without formal LMS infrastructure.",
    lanes: ["Compliance", "Learning Experience"],
  },
  {
    id: "release-depth",
    label: "Product iteration depth",
    value: "77+ releases",
    detail:
      "Used rapid AI-assisted build cycles and GitHub-connected workflows to move ideas into working tools.",
    lanes: ["Technical Product", "AI Operations"],
  },
  {
    id: "feature-set",
    label: "Workflow feature set",
    value: "50+ features",
    detail:
      "Built workflow features around visibility, handoffs, readiness, and delivery governance.",
    lanes: ["Technical Product", "Enablement"],
  },
];

export const projects: Project[] = [
  {
    id: "ai-talent-content-pipeline",
    title: "AI Talent Content Pipeline",
    category: "AI Operations",
    year: "2026",
    thumbnail: "/assets/portfolio/ai-content-pipeline.png",
    image: "/assets/portfolio/ai-content-pipeline.png",
    shortDescription:
      "A repeatable AI-assisted content operations system with source review, scripting, QA, and human approval.",
    fullDescription:
      "A practical production system for high-volume talent-development assets. The work combined source analysis, NotebookLM-style review, scripting, and quality gates so AI accelerated repeated work without removing expert judgment.",
    problem:
      "High-volume learning assets needed faster review, cleaner metadata, and repeatable compliance alignment.",
    actions: [
      "Converted repeated review steps into a structured AI-assisted workflow.",
      "Documented quality standards so outputs could be checked consistently.",
      "Kept human review gates in place for decisions that required judgment.",
    ],
    outcomes: [
      "Reduced per-deliverable processing from 1.5 hours to 9.5 minutes.",
      "Created a repeatable foundation for future talent-content production.",
      "Balanced speed with traceable QA instead of treating AI as a black box.",
    ],
    tags: ["AI Workflow", "Talent Enablement", "QA"],
    lanes: ["AI Operations", "Enablement", "Compliance"],
    proofIds: ["asset-cycle", "audit-cost"],
    artifactHighlights: [
      "Workflow map for source review, scripting, QA, and approval",
      "Before/after timing proof for repeated content processing",
      "Quality checklist showing where human review stays in the loop",
    ],
    mediaNeeds: [
      "Redacted workflow screenshot",
      "Before/after timing visual",
      "Sample QA checklist",
    ],
    sourceNote: "Current resume, internal workflow notes, and project records.",
  },
  {
    id: "workflow-management-platform",
    title: "Workflow Management Platform",
    category: "Technical Product",
    year: "2026",
    thumbnail: "/assets/portfolio/workflow-platform.png",
    image: "/assets/portfolio/workflow-platform.png",
    shortDescription:
      "A custom workflow layer for status visibility, stakeholder handoffs, content readiness, and delivery governance.",
    fullDescription:
      "A product-minded operating layer for content and enablement work. The platform organizes intake, build, review, readiness, and delivery signals so stakeholders can see what is moving, blocked, or ready to ship.",
    problem:
      "Manual tracking made it hard to see ownership, review status, handoffs, and readiness.",
    actions: [
      "Mapped production states around intake, build, review, ready, and measure.",
      "Designed views for ownership, blockers, and delivery readiness.",
      "Used AI-assisted prototyping to move faster from need to usable release.",
    ],
    outcomes: [
      "Improved visibility across a multi-project operating model.",
      "Reduced tracking friction by making status and ownership explicit.",
      "Demonstrated product thinking through working software, not just slides.",
    ],
    tags: ["Workflow Design", "React", "Delivery Systems"],
    lanes: ["Technical Product", "Enablement", "AI Operations"],
    proofIds: ["release-depth", "feature-set"],
    artifactHighlights: [
      "Working app view showing intake, status, ownership, and delivery signals",
      "Release history proving iterative build depth",
      "Workflow model connecting stakeholder handoffs to readiness",
    ],
    mediaNeeds: [
      "Actual app screenshot",
      "Redacted status board",
      "Before/after tracking diagram",
    ],
    sourceNote: "GitHub repositories and shipped workflow experiments.",
  },
  {
    id: "enterprise-onboarding-journey",
    title: "Enterprise Onboarding and Readiness Journey",
    category: "Enablement",
    year: "2025",
    thumbnail: "/assets/portfolio/readiness-journey.png",
    image: "/assets/portfolio/readiness-journey.png",
    shortDescription:
      "A distributed enablement architecture for role readiness, onboarding, and field execution.",
    fullDescription:
      "A scalable readiness model for a distributed selling-community environment. The work connected lifecycle moments, role expectations, manager support, and field execution into a clearer path for enablement delivery.",
    problem:
      "A distributed sales ecosystem needed clearer readiness paths across roles, communities, and employee lifecycle moments.",
    actions: [
      "Mapped employee lifecycle moments into a practical enablement journey.",
      "Aligned learning touchpoints to role expectations and operating rhythm.",
      "Created a more scalable foundation for field-facing support.",
    ],
    outcomes: [
      "Standardized enablement delivery across 76,000 market lots.",
      "Supported clearer learning paths for 400+ selling communities.",
    ],
    tags: ["Onboarding", "Sales Readiness", "Journey Mapping"],
    lanes: ["Sales Enablement", "Enablement", "Learning Experience"],
    proofIds: ["market-lots"],
    artifactHighlights: [
      "Readiness journey organized around lifecycle moments and role expectations",
      "Manager-support sample for field execution",
      "Scale note connecting the model to market lots and selling communities",
    ],
    mediaNeeds: [
      "Redacted journey map",
      "Onboarding architecture artifact",
      "Manager-support sample",
    ],
    sourceNote: "Resume, LinkedIn history, and enterprise enablement notes.",
  },
  {
    id: "compliance-enablement-ecosystem",
    title: "Mobile-First Compliance Enablement Ecosystem",
    category: "Compliance",
    year: "2024",
    thumbnail: "/assets/portfolio/compliance-ecosystem.png",
    image: "/assets/portfolio/compliance-ecosystem.png",
    shortDescription:
      "A low-code, mobile-first learning system for required training in a workforce without formal LMS infrastructure.",
    fullDescription:
      "A constraints-based compliance learning ecosystem designed for practical access, evidence, and completion. The work focused on making required learning easier to reach, complete, and defend for a distributed workforce.",
    problem:
      "A municipal workforce needed audit-ready training coverage without traditional LMS infrastructure.",
    actions: [
      "Designed mobile-first access patterns for required learning.",
      "Balanced audit evidence, usability, and low-code deployment constraints.",
      "Organized content around completion, tracking, and practical support.",
    ],
    outcomes: [
      "Supported audit-ready coverage for 1,750+ employees.",
      "Demonstrated practical learning design under real infrastructure limits.",
    ],
    tags: ["Compliance", "Mobile-First", "Audit Evidence"],
    lanes: ["Compliance", "Learning Experience", "Enablement"],
    proofIds: ["municipal-coverage"],
    artifactHighlights: [
      "Mobile-first access pattern for required training",
      "Tracking approach for completion and audit evidence",
      "Low-code delivery model built around workforce constraints",
    ],
    mediaNeeds: [
      "Mobile screen preview",
      "Tracking artifact",
      "Redacted audit evidence",
    ],
    sourceNote: "Legacy instructional design site and project notes.",
  },
  {
    id: "phishing-red-flags",
    title: "Spot the Red Flags Interaction",
    category: "Learning Experience",
    year: "2024",
    thumbnail: "/assets/portfolio/ai-content-pipeline.png",
    image: "/assets/portfolio/ai-content-pipeline.png",
    shortDescription:
      "A compact security-awareness interaction built around active judgment instead of passive compliance reading.",
    fullDescription:
      "A scenario-based learning interaction that asks learners to identify suspicious sender, link, attachment, and urgency cues. The point is simple: practice the decision, do not just read the policy.",
    problem:
      "Security topics can become passive compliance content when learners do not practice realistic judgment.",
    actions: [
      "Turned phishing recognition into a short visual decision activity.",
      "Focused feedback around realistic red-flag categories.",
      "Kept the experience small enough for workplace performance support.",
    ],
    outcomes: [
      "Converted a compliance topic into active judgment practice.",
      "Created a reusable pattern for short scenario-based security learning.",
    ],
    tags: ["Scenario Design", "Security Awareness", "eLearning"],
    lanes: ["Learning Experience", "Compliance", "Technical Product"],
    proofIds: ["municipal-coverage", "army-lms"],
    artifactHighlights: [
      "Scenario screen where learners identify suspicious cues",
      "Feedback model organized around sender, link, attachment, and urgency signals",
      "Reusable pattern for short active-judgment compliance practice",
    ],
    mediaNeeds: [
      "Direct interaction screenshot",
      "Short click-through GIF",
      "Clean exported course screen",
    ],
    sourceNote: "Legacy TerryLXD and instructional design portfolio artifacts.",
  },
  {
    id: "career-city",
    title: "Career City",
    category: "Learning Product",
    year: "2026",
    thumbnail: "/assets/portfolio/workflow-platform.png",
    image: "/assets/portfolio/workflow-platform.png",
    shortDescription:
      "A gameful career-development prototype that turns growth paths into an explorable learning product.",
    fullDescription:
      "An interactive career-development concept that frames career growth as a navigable city. It shows how learning strategy, product thinking, and AI-assisted build workflows can come together in a usable prototype.",
    problem:
      "Career growth can feel abstract when people need to compare paths, practice choices, and decide what to do next.",
    actions: [
      "Designed a gameful flow around exploration and decision-making.",
      "Used AI-assisted build workflows to move from idea to prototype.",
      "Framed learning strategy as an interactive product instead of a static course.",
    ],
    outcomes: [
      "Shows product thinking, learning strategy, and AI-enabled build capability together.",
      "Demonstrates how career navigation can become a practical learning product.",
    ],
    tags: ["Gameful Learning", "React", "Career Development"],
    lanes: ["Learning Experience", "Technical Product", "AI Operations"],
    proofIds: ["release-depth"],
    artifactHighlights: [
      "Interactive career map showing paths as navigable choices",
      "Prototype flow connecting learning strategy to product behavior",
      "Repo-backed proof of AI-assisted concept-to-build execution",
    ],
    mediaNeeds: ["Actual app screenshot", "Gameplay GIF", "Demo link"],
    sourceNote: "GitHub repo and app prototype.",
    repo: "https://github.com/terrybrutus/career-city",
  },
];

export const skills = [
  "Enablement Strategy",
  "Learning Experience Design",
  "Instructional Systems Design",
  "AI Workflow Design",
  "Sales Readiness",
  "Compliance Learning",
  "Workflow Prototyping",
  "Stakeholder Alignment",
  "Manager Support",
  "Measurement Planning",
];

export const humanHighlights: HumanHighlight[] = [
  {
    label: "Former Division I athlete",
    detail:
      "Played basketball at Ole Miss, which still shapes how I think about preparation, feedback, standards, and team execution.",
  },
  {
    label: "Maker mindset",
    detail:
      "Sewing and making clothes sharpen the same instincts I use in systems work: fit, iteration, detail, and craft.",
  },
  {
    label: "Competitive outlet",
    detail:
      "Pickleball keeps the quick-read, adjust-fast part of my brain active without turning every problem into a playbook.",
  },
];

export const brainSources: BrainSource[] = [
  {
    id: "latest-resume",
    title: "Current resume",
    type: "Resume",
    status: "needs cleanup",
    linkedProjectIds: [
      "ai-talent-content-pipeline",
      "workflow-management-platform",
      "enterprise-onboarding-journey",
    ],
    note: "Best source for current positioning, scale, and metrics. Copy should stay concise.",
  },
  {
    id: "linkedin-profile",
    title: "LinkedIn profile export",
    type: "LinkedIn",
    status: "needs cleanup",
    linkedProjectIds: [
      "enterprise-onboarding-journey",
      "phishing-red-flags",
      "compliance-enablement-ecosystem",
    ],
    note: "Useful background, but public copy should be slimmer and less verbose.",
  },
  {
    id: "legacy-isd-site",
    title: "Instructional Design by Terry",
    type: "Old website",
    status: "needs artifact",
    linkedProjectIds: ["phishing-red-flags", "compliance-enablement-ecosystem"],
    note: "Good older ISD proof. Needs cleaner media crops and updated framing.",
  },
  {
    id: "github-repos",
    title: "GitHub projects",
    type: "Repository evidence",
    status: "ready",
    linkedProjectIds: ["workflow-management-platform", "career-city"],
    note: "Useful proof of shipped prototypes, AI-assisted build workflows, and technical credibility.",
  },
];

export const acceptedEvidenceTypes: AcceptedEvidenceType[] = [
  {
    extension: ".png / .jpg / .webp",
    use: "Project screenshots, artifact previews, diagram exports, UI states",
  },
  {
    extension: ".gif / .mp4 / .webm",
    use: "Short demos, click-throughs, workflow walkthroughs",
  },
  {
    extension: ".pdf / .docx / .pptx",
    use: "Resume versions, case-study artifacts, job aids, decks, storyboards",
  },
  {
    extension: ".txt / .md / .csv / .json",
    use: "Raw notes, transcripts, metrics, project logs, structured source text",
  },
  {
    extension: "GitHub / site links",
    use: "Repo proof, deployed app evidence, legacy portfolio references",
  },
];

export const socialLinks = [
  { label: "LinkedIn", href: profile.linkedIn },
  { label: "GitHub", href: profile.github },
  { label: "Email", href: `mailto:${profile.email}` },
];

export const navLinks = [
  { label: "Home", id: "hero", route: "/" },
  { label: "Work", id: "projects", route: "/work" },
  { label: "About", id: "about", route: "/" },
  { label: "Contact", id: "contact", route: "/" },
];

export function getProofPoints(ids: string[]) {
  return ids
    .map((id) => proofPoints.find((proofPoint) => proofPoint.id === id))
    .filter((proofPoint): proofPoint is ProofPoint => Boolean(proofPoint));
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getLaneProfile(lane: Lane) {
  return (
    laneProfiles.find((laneProfile) => laneProfile.lane === lane) ??
    laneProfiles[0]
  );
}

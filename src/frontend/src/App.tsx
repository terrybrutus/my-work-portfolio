import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Boxes,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Download,
  Eye,
  ImagePlus,
  LayoutTemplate,
  Lock,
  Save,
  Wand2,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCallerUserRole } from "./hooks/useQueries";
import savedPortfolio from "./content/portfolio.json";
import { projectSamples } from "./content/project-samples";
import { ProjectDocumentViewer } from "./components/ProjectDocumentViewer";
import { ImageUpload, type ImageTarget } from "./components/ImageUpload";

type Project = {
  title: string;
  summary: string;
  result: string;
  tags: string[];
  image?: string;
  carouselImage?: string;
  url?: string;
  slug?: string;
  contextUrl?: string;
  contextLabel?: string;
  detailIntro?: string;
  detailSections?: ProjectDetailSection[];
  detailLinks?: ProjectDetailLink[];
};

type ProjectDetailSection = {
  title: string;
  body: string;
};

type ProjectDetailLink = {
  label: string;
  href: string;
};

type PortfolioSection = {
  id: string;
  label: string;
  visible: boolean;
};

type PortfolioContent = {
  brandLabel: string;
  brandLogoText: string;
  brandLogoImage: string;
  navWorkLabel: string;
  navApproachLabel: string;
  navContactLabel: string;
  navAdminLabel: string;
  navPreviewLabel: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  contactHeading: string;
  contactText: string;
  name: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  location: string;
  email: string;
  profileImage: string;
  profileImagePosition: string;
  heroCardEyebrow: string;
  heroCardFocusText: string;
  workSectionHeading: string;
  proofSectionHeading: string;
  capabilitiesSectionHeading: string;
  templateSectionHeading: string;
  aboutWorkKicker: string;
  aboutWorkTitle: string;
  aboutPersonalKicker: string;
  aboutPersonalTitle: string;
  proofPoints: string[];
  about: string[];
  aboutImages: string[];
  capabilities: string[];
  projects: Project[];
  sections: PortfolioSection[];
  selectedTemplate: string;
};

type Template = {
  id: string;
  name: string;
  description: string;
  className: string;
  accent: string;
};

const STORAGE_KEY = "terry-lxd-portfolio-draft-v4";
const SAVED_REVISION_KEY = `${STORAGE_KEY}-written-revision`;
const writtenPortfolio = savedPortfolio as {
  savedAt?: string;
  content?: PortfolioContent;
};

function saveLocalDraft(content: PortfolioContent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

const legacyAboutCopy = [
  "My work lives between learning strategy, customer adoption, technical enablement, and operational workflow design. I help teams move from scattered stakeholder requests to structured learning systems that can be delivered, measured, maintained, and trusted.",
  "Across federal, enterprise, municipal, SaaS, healthcare, sales, and technical environments, I focus on the part that matters most: making complex work easier for real people to perform without burying them in generic training.",
];
const previousPersonalAboutCopy =
  "Outside the work, I am drawn to systems, stories, games, music, visual design, and the way people learn when something finally clicks. That curiosity is a big part of my portfolio: I like building experiences that feel useful, human, and a little more alive than a standard resume.";

const legacyProjectTitles = [
  "Defense Workforce Learning Architecture",
  "AI-Assisted Production Workflow",
  "Distributed Onboarding & Compliance Systems",
];

const importedTerryLxdProjectTitles = [
  "AI & The Future of Work",
  "Don't Get Hooked: A Course on Phishing",
  "Why Blockchain Actually Matters",
];

const legacyHeroEyebrow =
  "Learning & Enablement Architect | AI Workflow Automation";
const legacyHeroEyebrowV2 =
  "Learning Systems | Enablement Strategy | Performance Support";
const legacyHeroCardEyebrow = "Selected impact";
const legacyHeroCardEyebrowV2 = "Practice snapshot";
const legacyHeroFocusText =
  "Current focus: technical enablement, customer adoption, accessible learning systems, and AI-assisted production workflows.";
const legacyHeroFocusTextV2 =
  "I work across the messy middle between business goals, learner needs, technical constraints, and adoption. The throughline is simple: make complex work easier to understand, practice, and sustain.";
const legacyHeroFocusTextV3 =
  "My work sits at the intersection of learning design, performance consulting, content systems, and practical adoption. The goal is not just to publish training. It is to help people do the work better.";
const legacyHeadlineV2 =
  "I build scalable learning systems that make complex work easier to adopt.";
const legacyHeadlineV3 =
  "Building scalable learning systems that make complex work easier to adopt.";
const legacySubheadlineV2 =
  "I translate stakeholder goals, skill gaps, and adoption blockers into practical enablement workflows, compliance-ready learning assets, and AI-assisted operations for federal, enterprise, SaaS, healthcare, sales, and technical teams.";
const legacyContactTextV2 =
  "If you are looking for someone who can connect learning strategy, technical enablement, AI-assisted workflows, and practical adoption systems, I would be glad to talk.";
const legacyAddieProjectTitle = "ADDIE in Action: CON 7020";

const firstPartyProjectPages: Record<string, Partial<Project>> = {
  "https://sites.google.com/view/instructionaldesignbyterry/projects/addie-in-action":
    {
      title: "ADDIE Model From Start to Finish",
      summary:
        "A full instructional design process example for CON 7020, a Defense Acquisition University course on Overhead Should Cost Review, translating technical contracting documentation into a structured online learning experience.",
      result:
        "Shows analysis, learning-objective mapping, storyboard design, interactive scenario planning, development, and implementation thinking across the full ADDIE process.",
      image: "/assets/con-7020-thumbnail.png",
      slug: "addie-model-from-start-to-finish",
      url: "/work/addie-model-from-start-to-finish",
      contextUrl: "https://icatalog.waru.edu/CourseDetail/12795",
      contextLabel: "View CON 7020 course context",
    },
  "https://sites.google.com/view/instructionaldesignbyterry/projects/conducting-qa":
    {
      slug: "quality-assurance-review-system",
      url: "/work/quality-assurance-review-system",
      image: "/assets/projects/qa-review-system.png",
    },
  "https://sites.google.com/view/instructionaldesignbyterry/projects/job-aid-template":
    {
      slug: "job-aid-template-system",
      url: "/work/job-aid-template-system",
      image: "/assets/projects/job-aid-template-system.png",
    },
  "https://sites.google.com/view/instructionaldesignbyterry/projects/facilitator-guide":
    {
      slug: "facilitator-guide-adaptation",
      url: "/work/facilitator-guide-adaptation",
      image: "/assets/projects/facilitator-guide-adaptation.png",
    },
};

const templates: Template[] = [
  {
    id: "systems-lab",
    name: "Systems Lab",
    description: "Dark, polished, product-strategy dashboard energy.",
    className: "theme-systems-lab",
    accent: "from-cyan-300 to-blue-500",
  },
  {
    id: "executive-brief",
    name: "Executive Brief",
    description: "Clean, credible, boardroom-ready consulting portfolio.",
    className: "theme-executive-brief",
    accent: "from-amber-300 to-orange-500",
  },
  {
    id: "field-notes",
    name: "Field Notes",
    description: "Human, editorial, reflective learning strategist.",
    className: "theme-field-notes",
    accent: "from-emerald-300 to-teal-500",
  },
  {
    id: "neon-console",
    name: "Neon Console",
    description: "Animated technical showcase with game-like polish.",
    className: "theme-neon-console",
    accent: "from-fuchsia-400 to-cyan-400",
  },
  {
    id: "product-studio",
    name: "Product Studio",
    description: "Modern SaaS portfolio for enablement products.",
    className: "theme-product-studio",
    accent: "from-violet-300 to-indigo-500",
  },
  {
    id: "case-library",
    name: "Case Library",
    description: "Evidence-first case study wall.",
    className: "theme-case-library",
    accent: "from-lime-300 to-green-500",
  },
  {
    id: "learning-city",
    name: "Learning City",
    description: "Playful but professional nod to interactive learning.",
    className: "theme-learning-city",
    accent: "from-sky-300 to-emerald-400",
  },
  {
    id: "signal-room",
    name: "Signal Room",
    description: "Sharp, minimal, high-contrast operator console.",
    className: "theme-signal-room",
    accent: "from-red-400 to-yellow-300",
  },
];

const defaultContent: PortfolioContent = {
  brandLabel: "TerryLXD",
  brandLogoText: "TB",
  brandLogoImage: "",
  navWorkLabel: "Work",
  navApproachLabel: "About",
  navContactLabel: "Contact",
  navAdminLabel: "Admin",
  navPreviewLabel: "Preview",
  primaryCtaLabel: "About me",
  primaryCtaHref: "#about",
  secondaryCtaLabel: "Start a conversation",
  secondaryCtaHref: "mailto:terrbrutus@gmail.com",
  contactHeading: "Let's connect",
  contactText:
    "If you are looking for someone who can translate complex work into clear learning, enablement, or performance-support systems, I would be glad to talk.",
  name: "Terry Brutus",
  eyebrow:
    "Learning Experience Design | Enablement Systems | Performance Support",
  headline:
    "I turn complex work into learning experiences people can actually use.",
  subheadline:
    "I connect instructional design, enablement strategy, accessibility, and workflow thinking to help teams learn faster, adopt tools with less friction, and perform with more confidence.",
  location: "Leland, North Carolina",
  email: "terrbrutus@gmail.com",
  profileImage: "/assets/legacy/legacy-profile.png",
  profileImagePosition: "50% 42%",
  heroCardEyebrow: "Portfolio snapshot",
  heroCardFocusText:
    "My work sits at the intersection of learning design, performance consulting, content systems, and practical adoption. I care about whether people can use what I build when the work gets messy.",
  workSectionHeading:
    "Selected work across learning, enablement, and systems design",
  proofSectionHeading: "Proof points from the work",
  capabilitiesSectionHeading:
    "Core strengths pulled from the work, not buzzwords",
  templateSectionHeading: "A living portfolio that can keep evolving",
  aboutWorkKicker: "Work snapshot",
  aboutWorkTitle: "How I Got Here",
  aboutPersonalKicker: "Personal snapshot",
  aboutPersonalTitle: "Beyond The Work",
  proofPoints: [
    "Learning experiences built for federal, enterprise, SaaS, healthcare, sales, and technical audiences",
    "Scenario-based courses, job aids, QA systems, and enablement workflows",
    "Accessibility-aware design across Section 508/WCAG learning assets",
    "AI-assisted review and production workflows used to reduce manual rework",
  ],
  about: [
    "I got here through sport, teaching, technical problem-solving, and production work. Basketball taught me preparation, feedback, and team accountability; instructional design gave me a way to turn that discipline into practical systems.",
    "I was a student-athlete at Ole Miss, and that still shapes how I work: study the film, understand the assignment, adjust fast, and keep moving when the play changes.",
    "I am curious about games, music, visual design, technology, and how hard ideas finally click. I like building work that feels useful, clear, and more alive than a standard document.",
  ],
  aboutImages: ["", "/assets/ole-miss-basketball.png", ""],
  capabilities: [
    "Translate stakeholder goals and operational priorities into scalable learning strategies",
    "Design role-based onboarding, compliance, and customer enablement journeys",
    "Build AI-assisted QA, content analysis, and skills-alignment workflows",
    "Govern accessible learning assets using Section 508 and WCAG standards",
    "Create scenario-based, simulation-based, and self-paced technical training",
    "Use analytics and support data to identify adoption blockers and reduce escalations",
  ],
  projects: [
    {
      title: "Enablement Quest: The Learning Systems Lab",
      summary:
        "A browser-based RPG-style learning simulation where players investigate workplace performance problems, inspect evidence, talk to stakeholders, and decide whether training is really the right answer.",
      result:
        "Demonstrates performance consulting judgment through two playable cases: new-hire ramp and stalled sales demo conversion, with earned business-impact canvases and reviewer-facing evidence boundaries.",
      tags: [
        "Performance consulting",
        "Sales enablement",
        "RPG learning simulation",
      ],
      image: "/assets/projects/enablement-quest.gif",
      url: "",
    },
    {
      title: "AI & The Future of Work",
      summary:
        "A RISE 360 microlearning course about how AI is changing work, framed for learners who may be curious, skeptical, or worried about what the technology means for their role.",
      result:
        "Turns a broad technology topic into a short, approachable learning experience that helps people understand the shift without fear-first messaging.",
      tags: ["RISE 360", "AI literacy", "Microlearning"],
      image: "/assets/projects/ai-future-of-work.gif",
      url: "https://terrybrutus-aiandthefuture-sample.netlify.app/",
    },
    {
      title: "Don't Get Hooked: A Course on Phishing",
      summary:
        "A Storyline 360 microlearning course created from a real phishing attempt, designed to make cybersecurity awareness feel immediate and practical.",
      result:
        "Uses a real-world trigger to help learners recognize phishing behavior and connect security guidance to decisions they actually make.",
      tags: ["Storyline 360", "Cybersecurity", "Scenario learning"],
      image: "/assets/projects/phishing-course.png",
      url: "https://phishingcourse-by-terrybrutus.netlify.app/story.html",
    },
    {
      title: "Why Blockchain Actually Matters",
      summary:
        "A RISE 360 microlearning course that explains blockchain basics and why the technology matters beyond hype or legacy-banking arguments.",
      result:
        "Makes a complex technical topic easier to understand by connecting blockchain to practical uses, transaction speed, security, and operational efficiency.",
      tags: ["RISE 360", "Blockchain", "Technical explainer"],
      image: "/assets/projects/blockchain-matters.gif",
      url: "https://whyblockchainmatters-by-terrybrutus.netlify.app/",
    },
    {
      title: "ADDIE Model From Start to Finish",
      summary:
        "A full instructional design process example for CON 7020, a Defense Acquisition University course on Overhead Should Cost Review, translating technical contracting documentation into a structured online learning experience.",
      result:
        "Shows analysis, learning-objective mapping, storyboard design, interactive scenario planning, development, and implementation thinking across the full ADDIE process.",
      tags: ["ADDIE", "Government training", "Course architecture"],
      image: "/assets/con-7020-thumbnail.png",
      slug: "addie-model-from-start-to-finish",
      url: "/work/addie-model-from-start-to-finish",
      contextUrl: "https://icatalog.waru.edu/CourseDetail/12795",
      contextLabel: "View CON 7020 course context",
      detailIntro:
        "CON 7020 is a Defense Acquisition University course focused on Overhead Should Cost Review. The portfolio value here is not the old course link itself; it is the instructional design trail: how dense contracting material became objectives, structure, screens, interactions, checks, and implementation decisions.",
      detailSections: [
        {
          title: "What This Project Shows",
          body: "A complete ADDIE workflow: analysis of source content, audience needs, learning-objective mapping, storyboard planning, interaction design, development thinking, review cycles, and implementation considerations.",
        },
        {
          title: "Why It Matters",
          body: "A recruiter who is not familiar with government contracting can still see the core skill: taking complex technical material and turning it into a learnable experience with structure, sequencing, practice, and clear learner support.",
        },
        {
          title: "Artifact Note",
          body: "The previously implemented public course link is no longer available, but the course context remains available through the course catalog link.",
        },
      ],
    },
    {
      title: "Quality Assurance Review System",
      summary:
        "A two-page sample of my course review notes, showing the issue, the requested change, and directions for the production team.",
      result:
        "Highlights a systematic review practice across instructional quality, user experience, Section 508/WCAG expectations, and contractual standards.",
      tags: ["QA", "Accessibility", "Learning operations"],
      image: "/assets/projects/qa-review-system.png",
      slug: "quality-assurance-review-system",
      url: "/work/quality-assurance-review-system",
      detailIntro:
        "This project shows quality assurance as a learning-operations practice, not a last-minute spelling check. The work involved reviewing a large eLearning lesson and documenting issues in a way the production team could act on.",
      detailSections: [
        {
          title: "What Was Reviewed",
          body: "Course structure, slide flow, learner instructions, interface consistency, visual formatting, feedback clarity, accessibility considerations, and alignment with the expected review standards.",
        },
        {
          title: "What It Demonstrates",
          body: "The ability to inspect learning assets like a system: find friction, explain the impact, preserve the instructional intent, and give production-ready notes that make revision easier.",
        },
        {
          title: "Why It Belongs Here",
          body: "QA work is often invisible, but it is one of the places where polished learning experiences are made. This artifact makes that review judgment visible.",
        },
      ],
    },
    {
      title: "Job Aid Template System",
      summary:
        "Quick-reference templates that organize technical software-purchasing guidance into definitions, requirements, and useful reference links.",
      result:
        "Demonstrates information architecture, visual hierarchy, essential-resource curation, and reusable template thinking for on-the-job support.",
      tags: ["Job aids", "Performance support", "Template design"],
      image: "/assets/projects/job-aid-template-system.png",
      slug: "job-aid-template-system",
      url: "/work/job-aid-template-system",
      detailIntro:
        "This project focuses on the part of learning that happens after a course: quick-reference support people can use while doing the job.",
      detailSections: [
        {
          title: "Design Problem",
          body: "Dense acquisition and regulatory content needed to become a reusable support format that helped people find the right information faster without reopening an entire course.",
        },
        {
          title: "What It Demonstrates",
          body: "Information architecture, template design, visual hierarchy, plain-language reduction, and performance-support thinking for technical audiences.",
        },
        {
          title: "Portfolio Signal",
          body: "It shows that the work is not limited to courses. It also includes tools, references, and systems that support performance in the flow of work.",
        },
      ],
    },
    {
      title: "Facilitator Guide Adaptation",
      summary:
        "A five-page instructor guide showing how I planned a live training session, with preparation steps, timed activities, teaching prompts, and learner practice.",
      result:
        "Shows how the same content can be redesigned across modalities while preserving instructional intent, timing, materials, and facilitation strategy.",
      tags: ["Facilitator guide", "ILT", "Modality conversion"],
      image: "/assets/projects/facilitator-guide-adaptation.png",
      slug: "facilitator-guide-adaptation",
      url: "/work/facilitator-guide-adaptation",
      detailIntro:
        "This project shows a modality shift: taking training content built for one delivery format and adapting it into an instructor-led facilitation plan.",
      detailSections: [
        {
          title: "What Changed",
          body: "The experience needed timing, materials, facilitator notes, learner activities, room/setup considerations, and a sequence an instructor could actually run.",
        },
        {
          title: "Instructional Lens",
          body: "The guide uses Gagne's Nine Events as a planning structure while keeping the facilitator focused on pacing, learner attention, practice, and transition points.",
        },
        {
          title: "Why It Matters",
          body: "It demonstrates that the same learning goal can be rebuilt for a different environment without losing instructional logic.",
        },
      ],
    },
  ],
  sections: [
    { id: "about", label: "Approach", visible: true },
    { id: "projects", label: "Selected Work", visible: true },
    { id: "contact", label: "Contact", visible: true },
    { id: "proof", label: "Proof Points", visible: false },
    { id: "capabilities", label: "Capabilities", visible: false },
    { id: "templates", label: "Template System", visible: false },
  ],
  selectedTemplate: "systems-lab",
};

function normalizeProject(project: Project): Project {
  const legacyProjectPage = project.url
    ? firstPartyProjectPages[project.url]
    : undefined;
  const legacyTitleUpgrade =
    project.title === legacyAddieProjectTitle
      ? firstPartyProjectPages[
          "https://sites.google.com/view/instructionaldesignbyterry/projects/addie-in-action"
        ]
      : undefined;
  const nextProject = {
    ...project,
    ...legacyProjectPage,
    ...legacyTitleUpgrade,
  };
  const defaultProject = defaultContent.projects.find(
    (defaultItem) => defaultItem.title === nextProject.title,
  );
  const upgradedProject = defaultProject
    ? {
        ...nextProject,
        image: nextProject.image ?? defaultProject.image,
        slug: nextProject.slug ?? defaultProject.slug,
        url: nextProject.url ?? defaultProject.url,
        contextUrl: nextProject.contextUrl ?? defaultProject.contextUrl,
        contextLabel: nextProject.contextLabel ?? defaultProject.contextLabel,
        detailIntro: nextProject.detailIntro ?? defaultProject.detailIntro,
        detailSections:
          nextProject.detailSections ?? defaultProject.detailSections,
        detailLinks: nextProject.detailLinks ?? defaultProject.detailLinks,
      }
    : nextProject;

  return upgradedProject;
}

function normalizeProjects(projects: Project[]) {
  return projects.map(normalizeProject);
}

function normalizeAbout(about: string[]) {
  const nextAbout = [...about];
  if (nextAbout[1] === previousPersonalAboutCopy) {
    nextAbout[1] = defaultContent.about[1];
  }
  if (!nextAbout[2]) {
    nextAbout[2] = defaultContent.about[2];
  }

  return nextAbout;
}

function normalizeAboutImages(aboutImages: string[]) {
  return defaultContent.about.map((_, index) => aboutImages[index] ?? "");
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:");
}

function getProjectSlug(project: Project) {
  if (project.slug) return project.slug;
  if (project.url?.startsWith("/work/"))
    return project.url.replace("/work/", "");

  return project.title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProjectPage(content: PortfolioContent) {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/work\/([^/?#]+)/);
  if (!match) return null;
  const slug = decodeURIComponent(match[1]);
  const index = content.projects.findIndex(
    (project) => getProjectSlug(project) === slug,
  );

  if (index < 0) return null;
  return { index, project: content.projects[index] };
}

function ProjectLink({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className: string;
  href: string;
}) {
  const external = isExternalHref(href);

  return (
    <a
      className={className}
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

function getInitialContent(): PortfolioContent {
  if (typeof window === "undefined") return defaultContent;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const sourceIsNewer = writtenPortfolio.content &&
      window.localStorage.getItem(SAVED_REVISION_KEY) !== writtenPortfolio.savedAt;
    const parsed = (sourceIsNewer ? writtenPortfolio.content : saved ? JSON.parse(saved) : writtenPortfolio.content) as Partial<PortfolioContent> | undefined;
    if (!parsed) return defaultContent;
    const shouldUpgradeAbout =
      parsed.about?.[0] === legacyAboutCopy[0] &&
      parsed.about?.[1] === legacyAboutCopy[1];
    const shouldUpgradeProjects =
      (parsed.projects?.length === legacyProjectTitles.length &&
        parsed.projects.every(
          (project, index) => project.title === legacyProjectTitles[index],
        )) ||
      (parsed.projects?.length === importedTerryLxdProjectTitles.length &&
        parsed.projects.every(
          (project, index) =>
            project.title === importedTerryLxdProjectTitles[index],
        ));
    return {
      ...defaultContent,
      ...parsed,
      eyebrow:
        parsed.eyebrow === legacyHeroEyebrow ||
        parsed.eyebrow === legacyHeroEyebrowV2
          ? defaultContent.eyebrow
          : (parsed.eyebrow ?? defaultContent.eyebrow),
      headline:
        parsed.headline === legacyHeadlineV2 ||
        parsed.headline === legacyHeadlineV3
          ? defaultContent.headline
          : (parsed.headline ?? defaultContent.headline),
      subheadline:
        parsed.subheadline === legacySubheadlineV2
          ? defaultContent.subheadline
          : (parsed.subheadline ?? defaultContent.subheadline),
      contactText:
        parsed.contactText === legacyContactTextV2
          ? defaultContent.contactText
          : (parsed.contactText ?? defaultContent.contactText),
      heroCardEyebrow:
        parsed.heroCardEyebrow === legacyHeroCardEyebrow ||
        parsed.heroCardEyebrow === legacyHeroCardEyebrowV2
          ? defaultContent.heroCardEyebrow
          : (parsed.heroCardEyebrow ?? defaultContent.heroCardEyebrow),
      heroCardFocusText:
        parsed.heroCardFocusText === legacyHeroFocusText ||
        parsed.heroCardFocusText === legacyHeroFocusTextV2 ||
        parsed.heroCardFocusText === legacyHeroFocusTextV3
          ? defaultContent.heroCardFocusText
          : (parsed.heroCardFocusText ?? defaultContent.heroCardFocusText),
      workSectionHeading:
        parsed.workSectionHeading ===
        "Evidence of scale, access, automation, and adoption"
          ? defaultContent.workSectionHeading
          : (parsed.workSectionHeading ?? defaultContent.workSectionHeading),
      aboutWorkKicker:
        parsed.aboutWorkKicker === "Work channel"
          ? defaultContent.aboutWorkKicker
          : (parsed.aboutWorkKicker ?? defaultContent.aboutWorkKicker),
      aboutPersonalKicker:
        parsed.aboutPersonalKicker === "Personal channel"
          ? defaultContent.aboutPersonalKicker
          : (parsed.aboutPersonalKicker ?? defaultContent.aboutPersonalKicker),
      about: shouldUpgradeAbout
        ? defaultContent.about
        : normalizeAbout(parsed.about ?? defaultContent.about),
      aboutImages: normalizeAboutImages(
        parsed.aboutImages ?? defaultContent.aboutImages,
      ),
      projects: shouldUpgradeProjects
        ? normalizeProjects(defaultContent.projects)
        : normalizeProjects(parsed.projects ?? defaultContent.projects),
    };
  } catch {
    return writtenPortfolio.content ?? defaultContent;
  }
}

function getSectionLabel(content: PortfolioContent, sectionId: string) {
  return (
    content.sections.find((section) => section.id === sectionId)?.label ??
    defaultContent.sections.find((section) => section.id === sectionId)
      ?.label ??
    sectionId
  );
}

export default function App() {
  useCallerUserRole();
  const [content, setContent] = useState<PortfolioContent>(getInitialContent);
  const initialContentRef = useRef(content);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) return;
    try {
      if (writtenPortfolio.savedAt) window.localStorage.setItem(SAVED_REVISION_KEY, writtenPortfolio.savedAt);
    } catch {
      // Written portfolio content remains available without browser storage.
    }
  }, [writtenPortfolio.savedAt, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    try {
      saveLocalDraft(content);
    } catch (error) {
      console.warn("Unable to save portfolio draft locally.", error);
    }
  }, [content, isAdmin]);

  useEffect(() => {
    const syncDraft = (event: StorageEvent) => {
      if (isAdmin) return;
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const next = JSON.parse(event.newValue) as PortfolioContent;
        if (Array.isArray(next.projects) && Array.isArray(next.aboutImages)) setContent(next);
      } catch {
        // Ignore incomplete drafts from another tab.
      }
    };
    window.addEventListener("storage", syncDraft);
    return () => window.removeEventListener("storage", syncDraft);
  }, [isAdmin]);

  useEffect(() => {
    let active = true;
    const refreshWrittenContent = async () => {
      try {
        const response = await fetch("/__portfolio/content", {cache: "no-store"});
        if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) return;
        const saved = await response.json();
        if (!active || !saved.content?.projects || !saved.savedAt) return;
        // Public previews read the actual file, even before Vite refreshes its JSON import.
        if (!isAdmin) setContent(saved.content);
        else if (saved.savedAt !== writtenPortfolio.savedAt) {
          setContent((current) => current === initialContentRef.current ? saved.content : current);
        }
        window.dispatchEvent(new CustomEvent("portfolio:revision", {detail: saved}));
      } catch {
        // A static deployment continues to use its bundled portfolio content.
      }
    };
    void refreshWrittenContent();
    if (!isAdmin) window.addEventListener("focus", refreshWrittenContent);
    return () => { active = false; window.removeEventListener("focus", refreshWrittenContent); };
  }, [isAdmin]);

  const template = useMemo(
    () =>
      templates.find((item) => item.id === content.selectedTemplate) ??
      templates[0],
    [content.selectedTemplate],
  );
  const activeProjectPage = useMemo(() => getProjectPage(content), [content]);

  const updateContent = <K extends keyof PortfolioContent>(
    key: K,
    value: PortfolioContent[K],
  ) => {
    setContent((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className={`portfolio-shell min-h-screen ${template.className}`}>
      <AmbientBackdrop />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <TopNav content={content} onOpenAbout={() => setIsAboutOpen(true)} />
        {isAdmin ? (
          <AdminStudio
            content={content}
            updateContent={updateContent}
            setContent={setContent}
          />
        ) : activeProjectPage ? (
          <ProjectDetailPage
            content={content}
            project={activeProjectPage.project}
            projectIndex={activeProjectPage.index}
          />
        ) : (
          <PublicPortfolio
            content={content}
            onOpenAbout={() => setIsAboutOpen(true)}
            template={template}
            updateContent={updateContent}
          />
        )}
        <AboutTvModal
          content={content}
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
      </div>
    </main>
  );
}

function TopNav({
  content,
  onOpenAbout,
}: {
  content: PortfolioContent;
  onOpenAbout: () => void;
}) {
  const hasLogo = Boolean(content.brandLogoImage || content.brandLogoText);
  const navItems = [
    { href: "#about", label: content.navApproachLabel, onClick: onOpenAbout },
    { href: "/#work", label: content.navWorkLabel },
    { href: "/#contact", label: content.navContactLabel },
  ]
    .map((item) => ({ ...item, label: item.label.trim() }))
    .filter((item) => item.label.length > 0);

  return (
    <nav className="site-nav flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/[0.80] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <a href="/" className="flex items-center gap-2 font-semibold text-white">
        {hasLogo ? (
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white text-slate-950">
            {content.brandLogoImage ? (
              <img
                alt=""
                className="h-full w-full object-cover"
                src={content.brandLogoImage}
              />
            ) : (
              content.brandLogoText
            )}
          </span>
        ) : null}
        {content.brandLabel}
      </a>
      <div className="flex items-center gap-2">
        {navItems.map((item) =>
          item.onClick ? (
            <button
              className="nav-pill"
              key={item.href}
              onClick={item.onClick}
              type="button"
            >
              {item.label}
            </button>
          ) : (
            <a className="nav-pill" href={item.href} key={item.href}>
              {item.label}
            </a>
          ),
        )}
      </div>
    </nav>
  );
}

function PublicPortfolio({
  content,
  onOpenAbout,
  template,
  updateContent,
}: {
  content: PortfolioContent;
  onOpenAbout: () => void;
  template: Template;
  updateContent: <K extends keyof PortfolioContent>(
    key: K,
    value: PortfolioContent[K],
  ) => void;
}) {
  const visibleSections = content.sections.filter((section) => section.visible);

  return (
    <>
      <section className="hero-section">
        <div>
          <div className="hero-eyebrow">{content.eyebrow}</div>
          <h1 className="hero-title">{content.headline}</h1>
          <p className="hero-subheadline">{content.subheadline}</p>
          {content.primaryCtaLabel || content.secondaryCtaLabel ? (
            <div className="hero-actions">
              {content.primaryCtaLabel ? (
                <a
                  className="primary-cta"
                  href={content.primaryCtaHref}
                  onClick={(event) => {
                    if (content.primaryCtaHref === "#about") {
                      event.preventDefault();
                      onOpenAbout();
                    }
                  }}
                >
                  {content.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              {content.secondaryCtaLabel ? (
                <a className="secondary-cta" href={content.secondaryCtaHref}>
                  {content.secondaryCtaLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
        <HeroCard content={content} template={template} />
      </section>

      <div className="space-y-8 pb-20">
        {visibleSections.map((section) => {
          switch (section.id) {
            case "proof":
              return <ProofStrip key={section.id} content={content} />;
            case "about":
              return null;
            case "capabilities":
              return <CapabilitiesSection key={section.id} content={content} />;
            case "projects":
              return <ProjectSection key={section.id} content={content} />;
            case "contact":
              return <ContactSection key={section.id} content={content} />;
            case "templates":
              return (
                <TemplateSection
                  key={section.id}
                  content={content}
                  template={template}
                  updateContent={updateContent}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </>
  );
}

function ProjectDetailPage({
  content,
  project,
  projectIndex,
}: {
  content: PortfolioContent;
  project: Project;
  projectIndex: number;
}) {
  const sample = projectSamples[getProjectSlug(project)];
  const detailSections =
    sample?.sections ?? (project.detailSections?.length
      ? project.detailSections
      : [
          { title: "Project Overview", body: project.summary },
          { title: "Portfolio Signal", body: project.result },
        ]);

  return (
    <section className="glass-panel project-detail-page">
      <div className="project-detail-hero-grid">
        <div className="project-detail-media">
          {project.image ? (
            <img alt="" src={project.image} />
          ) : (
            <div className="project-modal-placeholder">{project.title}</div>
          )}
        </div>
        <div className="project-detail-copy">
          <p className="retro-tv-kicker">
            Work {String(projectIndex + 1).padStart(2, "0")} /{" "}
            {String(content.projects.length).padStart(2, "0")}
          </p>
          <h1>{project.title}</h1>
          <p className="project-detail-summary">{project.summary}</p>
          {sample?.introduction || project.detailIntro ? (
            <div className="project-detail-result">{sample?.introduction ?? project.detailIntro}</div>
          ) : (
            <div className="project-detail-result">{project.result}</div>
          )}
          <div className="project-detail-actions">
            <a className="secondary-cta" href={`/?work=${encodeURIComponent(getProjectSlug(project))}#work`}>
              Back to selected work
            </a>
            {project.contextUrl ? (
              <ProjectLink
                className="project-live-link"
                href={project.contextUrl}
              >
                {project.contextLabel ?? "View context"}
              </ProjectLink>
            ) : null}
          </div>
        </div>
      </div>
      {sample ? <ProjectDocumentViewer key={getProjectSlug(project)} sample={sample} /> : null}
      <div className="project-detail-section-grid">
        {detailSections.map((section) => (
          <article className="project-detail-section-card" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>
      {project.detailLinks?.length ? (
        <div className="project-detail-resource-row">
          {project.detailLinks.map((link) => (
            <ProjectLink
              className="project-live-link"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </ProjectLink>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HeroCard({
  content,
  template,
}: { content: PortfolioContent; template: Template }) {
  const impactStats = [
    ["Learning architecture", "Turn complex content into clear learner paths"],
    ["Enablement strategy", "Connect business goals to behavior change"],
    ["Performance support", "Create tools people can use in the flow of work"],
    ["Accessible delivery", "Design cleaner assets with QA and access in mind"],
  ];

  return (
    <div className="hero-orb hero-card-shell">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
        <div className={`h-2 bg-gradient-to-r ${template.accent}`} />
        <div className="grid gap-6 p-6">
          <div className="flex items-center gap-4">
            <div
              className="h-24 w-24 rounded-3xl border border-white/[0.15] bg-cover bg-center shadow-xl"
              style={{
                backgroundImage: `url(${content.profileImage})`,
                backgroundPosition: content.profileImagePosition,
              }}
            />
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-white/[0.45]">
                {content.heroCardEyebrow}
              </p>
              <h2 className="text-2xl font-black text-white">{content.name}</h2>
              <p className="text-sm text-white/[0.55]">{content.location}</p>
            </div>
          </div>
          <div className="hero-stat-grid">
            {impactStats.map(([label, value]) => (
              <div className="hero-stat-card" key={label}>
                <span className="hero-stat-label">{label}</span>
                <span className="hero-stat-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.08] p-4 text-sm leading-6 text-white/[0.72]">
            {content.heroCardFocusText}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProofStrip({ content }: { content: PortfolioContent }) {
  return (
    <section className="glass-panel p-7">
      <SectionHeader
        icon={<BadgeCheck className="h-5 w-5" />}
        eyebrow={getSectionLabel(content, "proof")}
        title={content.proofSectionHeading}
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {content.proofPoints.map((point) => (
          <div
            className="rounded-3xl border border-white/10 bg-black/20 p-5"
            key={point}
          >
            <BadgeCheck className="mb-4 h-6 w-6 text-cyan-200" />
            <p className="font-bold text-white">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutTvModal({
  content,
  isOpen,
  onClose,
}: {
  content: PortfolioContent;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const workStory = content.about[0] ?? "";
  const personalStory = content.about[1] ?? content.about[0] ?? "";
  const curiosityStory = content.about[2] ?? "";
  const slides = [
    {
      kicker: content.aboutWorkKicker,
      title: content.aboutWorkTitle,
      copy: workStory,
      image: content.aboutImages[0],
      imageAlt: "About Terry Brutus work story",
    },
    {
      kicker: content.aboutPersonalKicker,
      title: content.aboutPersonalTitle,
      copy: personalStory,
      image: content.aboutImages[1],
      imageAlt: "Terry Brutus playing basketball for Ole Miss",
    },
    {
      kicker: "Outside the title",
      title: "What I Pay Attention To",
      copy: curiosityStory,
      image: content.aboutImages[2],
      imageAlt: "About Terry Brutus personal interests",
    },
  ];
  const activeTvSlide = slides[activeSlide] ?? slides[0];
  const goToSlide = useCallback(
    (direction: -1 | 1) => {
      setActiveSlide(
        (current) => (current + direction + slides.length) % slides.length,
      );
    },
    [slides.length],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goToSlide(-1);
      if (event.key === "ArrowRight") goToSlide(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToSlide, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setActiveSlide(0);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      aria-labelledby="about-modal-title"
      className="about-modal-backdrop"
      open
    >
      <button
        aria-label="Close about modal"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="retro-tv-photo-shell">
        <img
          alt="Vintage television used as an interactive portfolio screen"
          className="retro-tv-photo"
          src="/assets/legacy/single-retro-tv.jpg"
        />
        <button className="retro-tv-close" onClick={onClose} type="button">
          Close
        </button>

        <div className="retro-tv-screen" aria-live="polite">
          <span
            className={`retro-tv-screen-inner ${
              activeTvSlide.image ? "has-slide-image" : ""
            }`}
          >
            <span className="retro-tv-kicker">{activeTvSlide.kicker}</span>
            <span className="retro-tv-title" id="about-modal-title">
              {activeTvSlide.title}
            </span>
            {activeTvSlide.image ? (
              <span className="retro-tv-slide-image-frame">
                <img
                  alt={activeTvSlide.imageAlt}
                  src={activeTvSlide.image}
                />
              </span>
            ) : null}
            <span className="retro-tv-copy">{activeTvSlide.copy}</span>
            <span className="retro-tv-hint">
              {activeSlide + 1} / {slides.length}
            </span>
          </span>
        </div>

        <button
          className="retro-tv-nav retro-tv-nav-prev"
          onClick={() => goToSlide(-1)}
          type="button"
        >
          Prev
        </button>
        <button
          className="retro-tv-nav retro-tv-nav-next"
          onClick={() => goToSlide(1)}
          type="button"
        >
          Next
        </button>
        <div className="retro-tv-dots" aria-label="TV carousel sections">
          {slides.map((slide, index) => (
            <button
              aria-label={`Show ${slide.title}`}
              aria-pressed={activeSlide === index}
              className={activeSlide === index ? "is-active" : ""}
              key={slide.title}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>

        <div className="sr-only">
          <h2>{activeTvSlide.title}</h2>
          <p>{activeTvSlide.copy}</p>
        </div>
      </div>
    </dialog>
  );
}
function CapabilitiesSection({ content }: { content: PortfolioContent }) {
  return (
    <section className="glass-panel p-7">
      <SectionHeader
        icon={<Boxes className="h-5 w-5" />}
        eyebrow={getSectionLabel(content, "capabilities")}
        title={content.capabilitiesSectionHeading}
      />
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {content.capabilities.map((capability) => (
          <div
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
            key={capability}
          >
            <ClipboardCheck className="mt-1 h-5 w-5 shrink-0 text-cyan-200" />
            <p className="text-white/[0.78]">{capability}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectSection({ content }: { content: PortfolioContent }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(
    () => {
      const returnProject = new URLSearchParams(window.location.search).get("work");
      const index = content.projects.findIndex(
        (project) => getProjectSlug(project) === returnProject,
      );
      return index < 0 ? null : index;
    },
  );
  const closeCarousel = () => {
    setActiveProjectIndex(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has("work")) {
      url.searchParams.delete("work");
      window.history.replaceState(window.history.state, "", url);
    }
  };
  const featuredProjects = content.projects.slice(0, 3);
  const activeProject =
    activeProjectIndex === null ? null : content.projects[activeProjectIndex];

  return (
    <section id="work" className="glass-panel p-7">
      <SectionHeader
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        eyebrow={getSectionLabel(content, "projects")}
        title={content.workSectionHeading}
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <article className="project-card group" key={project.title}>
            {project.image ? (
              <div className="project-card-media">
                <img
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  src={project.image}
                />
              </div>
            ) : null}
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">
                0{index + 1}
              </span>
              <BarChart3 className="h-5 w-5 text-white/[0.45] transition group-hover:text-white" />
            </div>
            <h3 className="project-card-title">{project.title}</h3>
            <p className="project-card-summary">{project.summary}</p>
            <p className="project-card-result">{project.result}</p>
            <div className="project-card-actions">
              <button
                className="project-detail-button"
                onClick={() => setActiveProjectIndex(index)}
                type="button"
              >
                View details
              </button>
              {project.url ? (
                <ProjectLink className="project-live-link" href={project.url}>
                  Open project
                </ProjectLink>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {content.projects.length > 3 ? (
        <div className="mt-8 flex justify-center">
          <button
            className="secondary-cta"
            onClick={() => setActiveProjectIndex(0)}
            type="button"
          >
            See more work <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <ProjectShowcaseModal
        activeIndex={activeProjectIndex ?? 0}
        isOpen={Boolean(activeProject)}
        onClose={closeCarousel}
        onSelect={setActiveProjectIndex}
        projects={content.projects}
      />
    </section>
  );
}

function ProjectShowcaseModal({
  activeIndex,
  isOpen,
  onClose,
  onSelect,
  projects,
}: {
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
  projects: Project[];
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const activeProject = projects[activeIndex] ?? projects[0];
  const carouselImage = activeProject?.carouselImage ?? activeProject?.image;
  const goToProject = useCallback(
    (direction: -1 | 1) => {
      onSelect((activeIndex + direction + projects.length) % projects.length);
    },
    [activeIndex, onSelect, projects.length],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goToProject(-1);
      if (event.key === "ArrowRight") goToProject(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToProject, isOpen, onClose]);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!isOpen || !title) return;

    // Fit the complete title inside the shared row without moving other regions.
    const fitTitle = () => {
      title.style.fontSize = "";
      let size = Number.parseFloat(window.getComputedStyle(title).fontSize);
      while (title.scrollHeight > title.clientHeight + 1 && size > 16) {
        size = Math.max(16, size - 0.5);
        title.style.fontSize = `${size}px`;
      }
    };
    fitTitle();
    const observer = new ResizeObserver(fitTitle);
    observer.observe(title);
    let disposed = false;
    void document.fonts?.ready.then(() => {
      if (!disposed) fitTitle();
    });
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [isOpen, activeIndex, activeProject?.title]);

  if (!isOpen || !activeProject) return null;

  return createPortal(
    <dialog
      aria-labelledby="project-modal-title"
      className="project-modal-backdrop"
      open
    >
      <button
        aria-label="Close project carousel"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="project-modal-shell">
        <button className="retro-tv-close" onClick={onClose} type="button">
          Close
        </button>
        <div className="project-modal-media">
          {carouselImage ? (
            <img alt="" src={carouselImage} />
          ) : (
            <div className="project-modal-placeholder">
              {activeProject.title}
            </div>
          )}
        </div>
        <div className="project-modal-content" key={activeIndex}>
          <p className="retro-tv-kicker">
            Work {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>
          <h2 id="project-modal-title" ref={titleRef} tabIndex={0}>
            {activeProject.title}
          </h2>
          <p className="project-modal-summary" tabIndex={0} aria-label="Project summary">
            {activeProject.summary}
          </p>
          <div className="project-modal-result" tabIndex={0} aria-label="Project outcome">
            {activeProject.result}
          </div>
          <div className="project-modal-actions">
            {activeProject.url ? (
              <ProjectLink className="primary-cta" href={activeProject.url}>
                Open project <ArrowRight className="h-4 w-4" />
              </ProjectLink>
            ) : null}
          </div>
        </div>
        <button
          className="retro-tv-nav retro-tv-nav-prev"
          onClick={() => goToProject(-1)}
          type="button"
        >
          Prev
        </button>
        <button
          className="retro-tv-nav retro-tv-nav-next"
          onClick={() => goToProject(1)}
          type="button"
        >
          Next
        </button>
        <div
          className="project-carousel-dots"
          aria-label="Project carousel sections"
        >
          {projects.map((project, index) => (
            <button
              aria-label={`Show ${project.title}`}
              aria-pressed={activeIndex === index}
              className={activeIndex === index ? "is-active" : ""}
              key={project.title}
              onClick={() => onSelect(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

function ContactSection({ content }: { content: PortfolioContent }) {
  return (
    <section id="contact" className="glass-panel p-7">
      <SectionHeader
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        eyebrow={getSectionLabel(content, "contact")}
        title={content.contactHeading}
      />
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <p className="max-w-3xl text-lg leading-8 text-white/[0.72]">
          {content.contactText}
        </p>
        <a className="primary-cta" href={`mailto:${content.email}`}>
          Email Terry <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function TemplateSection({
  content,
  template,
  updateContent,
}: {
  content: PortfolioContent;
  template: Template;
  updateContent: <K extends keyof PortfolioContent>(
    key: K,
    value: PortfolioContent[K],
  ) => void;
}) {
  return (
    <section className="glass-panel p-7">
      <SectionHeader
        icon={<LayoutTemplate className="h-5 w-5" />}
        eyebrow={getSectionLabel(content, "templates")}
        title={content.templateSectionHeading}
      />
      <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {templates.map((item) => (
          <button
            type="button"
            className={`template-card text-left ${item.id === template.id ? "is-active" : ""}`}
            key={item.id}
            onClick={() => updateContent("selectedTemplate", item.id)}
          >
            <span
              className={`mb-4 block h-2 rounded-full bg-gradient-to-r ${item.accent}`}
            />
            <span className="block font-black text-white">{item.name}</span>
            <span className="mt-2 block text-sm leading-5 text-white/[0.58]">
              {item.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-sm font-semibold text-white/[0.70]">
        {icon}
        {eyebrow}
      </div>
      <h2 className="max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function AdminStudio({
  content,
  updateContent,
  setContent,
}: {
  content: PortfolioContent;
  updateContent: <K extends keyof PortfolioContent>(
    key: K,
    value: PortfolioContent[K],
  ) => void;
  setContent: React.Dispatch<React.SetStateAction<PortfolioContent>>;
}) {
  const [exported, setExported] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);
  const contentRef = useRef(content);
  contentRef.current = content;
  const revisionRef = useRef(writtenPortfolio.savedAt ?? "");
  const baselineRef = useRef(writtenPortfolio.content);
  useEffect(() => {
    const updateRevision = (event: Event) => {
      const saved = (event as CustomEvent<{savedAt: string; content: PortfolioContent}>).detail;
      if (saved.savedAt >= revisionRef.current) {
        revisionRef.current = saved.savedAt;
        baselineRef.current = saved.content;
      }
    };
    window.addEventListener("portfolio:revision", updateRevision);
    return () => window.removeEventListener("portfolio:revision", updateRevision);
  }, []);
  const [saveStatus, setSaveStatus] = useState(
    "Use Save to project to write your changes and images to the portfolio files.",
  );

  const persistToProject = async (snapshot: PortfolioContent) => {
    setIsSavingProject(true);
    setSaveStatus("Writing your changes and images...");
    try {
      const response = await fetch("/__portfolio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Portfolio-Revision": revisionRef.current },
        body: JSON.stringify(snapshot),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Saving to project files is available in the local portfolio at http://127.0.0.1:44120/admin.");
      }
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.error ?? "Could not save the portfolio files.");
      revisionRef.current = saved.savedAt;
      baselineRef.current = saved.content;
      // Keep edits made while the request was running; replace only submitted images.
      const current = contentRef.current;
      const next = current === snapshot ? saved.content : {
        ...current,
        projects: current.projects.map((project) => {
          const index = snapshot.projects.findIndex((item) => getProjectSlug(item) === getProjectSlug(project));
          if (index < 0) return project;
          const result = { ...project };
          for (const field of ["image", "carouselImage"] as const) {
            if (project[field] === snapshot.projects[index][field]) result[field] = saved.content.projects[index][field];
          }
          return result;
        }),
      };
      contentRef.current = next;
      setContent(next);
      try {
        window.localStorage.setItem(SAVED_REVISION_KEY, saved.savedAt);
        saveLocalDraft(next);
      } catch {
        // The confirmed disk save remains valid when browser storage is unavailable.
      }
      setSaveStatus(`Saved to project files at ${new Date(saved.savedAt).toLocaleTimeString()}. Images and content are ready in your portfolio. Publishing is a separate step.`);
    } catch (error) {
      setSaveStatus(`Save failed: ${error instanceof Error ? error.message : "Could not write the portfolio files."} Your current edits are still in this editor. Retry with Save to project.`);
    } finally {
      setIsSavingProject(false);
    }
  };

  const saveToProject = () => {
    if (pendingUploads) {
      setSaveStatus("Please wait for the image to finish loading, then save.");
      return;
    }
    return persistToProject(contentRef.current);
  };

  const updateProject = (index: number, project: Project) => {
    const projects = [...content.projects];
    projects[index] = project;
    updateContent("projects", projects);
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= content.projects.length) return;

    const projects = [...content.projects];
    [projects[index], projects[target]] = [projects[target], projects[index]];
    updateContent("projects", projects);
  };

  const updateAbout = (index: number, value: string) => {
    const about = [...content.about];
    about[index] = value;
    updateContent("about", about);
  };

  const updateAboutImage = (index: number, value: string) => {
    const aboutImages = [...content.aboutImages];
    aboutImages[index] = value;
    updateContent("aboutImages", aboutImages);
  };

  const uploadControl = (label: string, target: ImageTarget) => <ImageUpload
    label={label}
    target={target}
    currentImage={target.kind === "project" ? content.projects.find(project => getProjectSlug(project) === target.project)?.[target.field] : target.kind === "about" ? content.aboutImages[target.index] : content[target.kind === "profile" ? "profileImage" : "brandLogoImage"]}
    onPendingChange={(change) => setPendingUploads((count) => count + change)}
    onSaved={(image, savedAt, diskContent) => {
      const disk = diskContent as PortfolioContent | undefined;
      const baseline = baselineRef.current;
      const isLatest = savedAt >= revisionRef.current;
      if (isLatest) {
        revisionRef.current = savedAt;
        if (disk) baselineRef.current = disk;
      }
      setContent((current) => {
        const merged = disk && isLatest ? {
          ...current,
          profileImage: current.profileImage === baseline?.profileImage ? disk.profileImage : current.profileImage,
          brandLogoImage: current.brandLogoImage === baseline?.brandLogoImage ? disk.brandLogoImage : current.brandLogoImage,
          aboutImages: current.aboutImages.map((value, index) => value === baseline?.aboutImages[index] ? disk.aboutImages[index] : value),
          projects: current.projects.map((project) => {
            const before = baseline?.projects.find(item => getProjectSlug(item) === getProjectSlug(project));
            const after = disk.projects.find(item => getProjectSlug(item) === getProjectSlug(project));
            return after ? {...project, ...Object.fromEntries((["image", "carouselImage"] as const).filter(field => project[field] === before?.[field]).map(field => [field, after[field]]))} : project;
          }),
        } : current;
        const next = target.kind === "project"
          ? {...merged, projects: merged.projects.map((project) => getProjectSlug(project) === target.project ? {...project, [target.field]: image} : project)}
          : target.kind === "about"
            ? {...merged, aboutImages: merged.aboutImages.map((value, index) => index === target.index ? image : value)}
            : {...merged, [target.kind === "profile" ? "profileImage" : "brandLogoImage"]: image};
        contentRef.current = next;
        return next;
      });
      try { window.localStorage.setItem(SAVED_REVISION_KEY, revisionRef.current); } catch { /* The image is already on disk. */ }
      setSaveStatus("Image saved to project files. Other text edits still use Save to project.");
    }}
  />;

  const saveDraft = () => {
    try {
      saveLocalDraft(content);
      setSaveStatus(
        `Saved to this browser at ${new Date().toLocaleTimeString()}. Public site still requires committed source changes.`,
      );
    } catch {
      setSaveStatus(
        "Could not save locally. The uploaded image may be too large for browser storage. Use Download backup before leaving this page.",
      );
    }
  };

  const downloadBackup = () => {
    const backup = JSON.stringify(content, null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `terrylxd-portfolio-draft-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(backup);
    setSaveStatus("Backup JSON downloaded.");
  };

  return (
    <section className="space-y-6 pb-20">
      <AdminPanel
        defaultOpen
        description="Save to project writes your content and uploaded images into the local portfolio files. Your saved changes survive a browser restart and are included in the next build."
        eyebrow="Admin"
        icon={<Lock className="h-5 w-5" />}
        title="Portfolio Admin Studio"
      >
        <div className="grid gap-3">
          <AdminField
            label="Name"
            value={content.name}
            onChange={(value) => updateContent("name", value)}
          />
          <AdminField
            label="Eyebrow"
            value={content.eyebrow}
            onChange={(value) => updateContent("eyebrow", value)}
          />
          <AdminTextArea
            label="Headline"
            value={content.headline}
            onChange={(value) => updateContent("headline", value)}
          />
          <AdminTextArea
            label="Subheadline"
            value={content.subheadline}
            onChange={(value) => updateContent("subheadline", value)}
          />
          <AdminField
            label="Email"
            value={content.email}
            onChange={(value) => updateContent("email", value)}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <ImagePlus className="h-4 w-4" />
            Top navigation pill
          </div>
          <div className="grid gap-3">
            <AdminField
              label="Brand text"
              value={content.brandLabel}
              onChange={(value) => updateContent("brandLabel", value)}
            />
            <AdminField
              label="Logo initials/text (leave blank to remove)"
              value={content.brandLogoText}
              onChange={(value) => updateContent("brandLogoText", value)}
            />
            <AdminField
              label="Projects link text (leave blank to remove)"
              value={content.navWorkLabel}
              onChange={(value) => updateContent("navWorkLabel", value)}
            />
            <AdminField
              label="Approach link text (leave blank to remove)"
              value={content.navApproachLabel}
              onChange={(value) => updateContent("navApproachLabel", value)}
            />
            <AdminField
              label="Contact link text (leave blank to remove)"
              value={content.navContactLabel}
              onChange={(value) => updateContent("navContactLabel", value)}
            />
          </div>
          {uploadControl("Upload logo image", {kind: "logo"})}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="admin-button px-4 py-2"
              type="button"
              onClick={() => updateContent("brandLogoImage", "")}
            >
              Remove uploaded logo
            </button>
            <button
              className="admin-button px-4 py-2"
              type="button"
              onClick={() => {
                updateContent("brandLogoImage", "");
                updateContent("brandLogoText", "");
              }}
            >
              Remove logo entirely
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <ImagePlus className="h-4 w-4" />
            Profile image
          </div>
          <input
            className="admin-input"
            value={content.profileImage}
            onChange={(event) =>
              updateContent("profileImage", event.target.value)
            }
          />
          {uploadControl("Upload profile image", {kind: "profile"})}
          <p className="mt-2 text-xs font-semibold text-white/[0.48]">
            Uploaded images save directly to your portfolio files.
          </p>
          <AdminField
            label="Image position"
            value={content.profileImagePosition}
            onChange={(value) => updateContent("profileImagePosition", value)}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="admin-button" type="button" onClick={saveToProject} disabled={isSavingProject}>
            <Save className="h-4 w-4" /> {isSavingProject ? "Saving..." : "Save to project"}
          </button>
          <button className="admin-button" type="button" onClick={saveDraft}>
            <Save className="h-4 w-4" /> Save browser draft
          </button>
          <button
            className="admin-button"
            type="button"
            onClick={() => setExported(JSON.stringify(content, null, 2))}
          >
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <button
            className="admin-button"
            type="button"
            onClick={downloadBackup}
          >
            <Download className="h-4 w-4" /> Download backup
          </button>
          <button
            className="admin-button"
            type="button"
            onClick={() => setContent(defaultContent)}
          >
            <Wand2 className="h-4 w-4" /> Reset
          </button>
          <a className="admin-button" href="/">
            <Eye className="h-4 w-4" /> Preview local draft
          </a>
        </div>
        <p role="status" className="mt-3 text-sm font-semibold text-white/80">
          {saveStatus}
        </p>
      </AdminPanel>

      <AdminPanel
        icon={<BookOpenCheck className="h-5 w-5" />}
        eyebrow="Homepage copy"
        title="Edit the visible hero and selected work framing"
      >
        <div className="mt-6 grid gap-4">
          <AdminField
            label="Hero card eyebrow"
            value={content.heroCardEyebrow}
            onChange={(value) => updateContent("heroCardEyebrow", value)}
          />
          <AdminTextArea
            label="Hero card focus text"
            value={content.heroCardFocusText}
            onChange={(value) => updateContent("heroCardFocusText", value)}
          />
          <AdminField
            label="Selected work section heading"
            value={content.workSectionHeading}
            onChange={(value) => updateContent("workSectionHeading", value)}
          />
        </div>
      </AdminPanel>

      <AdminPanel
        icon={<ArrowRight className="h-5 w-5" />}
        eyebrow="Calls To Action"
        title="Hero buttons and contact block"
      >
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <AdminField
            label="Primary button text (blank hides it)"
            value={content.primaryCtaLabel}
            onChange={(value) => updateContent("primaryCtaLabel", value)}
          />
          <AdminField
            label="Primary button link"
            value={content.primaryCtaHref}
            onChange={(value) => updateContent("primaryCtaHref", value)}
          />
          <AdminField
            label="Secondary button text (blank hides it)"
            value={content.secondaryCtaLabel}
            onChange={(value) => updateContent("secondaryCtaLabel", value)}
          />
          <AdminField
            label="Secondary button link"
            value={content.secondaryCtaHref}
            onChange={(value) => updateContent("secondaryCtaHref", value)}
          />
        </div>
        <div className="mt-4 grid gap-4">
          <AdminField
            label="Contact heading"
            value={content.contactHeading}
            onChange={(value) => updateContent("contactHeading", value)}
          />
          <AdminTextArea
            label="Contact text"
            value={content.contactText}
            onChange={(value) => updateContent("contactText", value)}
          />
        </div>
      </AdminPanel>

      <AdminPanel
        icon={<BookOpenCheck className="h-5 w-5" />}
        eyebrow="About Modal"
        title="Edit the About Me TV carousel"
      >
        <button className="admin-button" type="button" onClick={saveToProject} disabled={isSavingProject}>
          <Save className="h-4 w-4" /> {isSavingProject ? "Saving..." : "Save About images and text"}
        </button>
        <p role="status" className="mt-3 text-sm text-white/80">{saveStatus}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <AdminField
            label="Work slide kicker"
            value={content.aboutWorkKicker}
            onChange={(value) => updateContent("aboutWorkKicker", value)}
          />
          <AdminField
            label="Work slide title"
            value={content.aboutWorkTitle}
            onChange={(value) => updateContent("aboutWorkTitle", value)}
          />
          <AdminTextArea
            label="Work slide copy"
            value={content.about[0] ?? ""}
            onChange={(value) => updateAbout(0, value)}
          />
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <ImagePlus className="h-4 w-4" />
              Work slide image
            </div>
            <AdminField
              label="Image URL or browser-uploaded image"
              value={content.aboutImages[0] ?? ""}
              onChange={(value) => updateAboutImage(0, value)}
            />
            {uploadControl("Upload About slide 1 image", {kind: "about", index: 0})}
            <button
              className="admin-button mt-3 px-4 py-2"
              type="button"
              onClick={() => updateAboutImage(0, "")}
            >
              Remove slide image
            </button>
          </div>
          <AdminField
            label="Personal slide kicker"
            value={content.aboutPersonalKicker}
            onChange={(value) => updateContent("aboutPersonalKicker", value)}
          />
          <AdminField
            label="Personal slide title"
            value={content.aboutPersonalTitle}
            onChange={(value) => updateContent("aboutPersonalTitle", value)}
          />
          <AdminTextArea
            label="Personal slide copy"
            value={content.about[1] ?? ""}
            onChange={(value) => updateAbout(1, value)}
          />
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <ImagePlus className="h-4 w-4" />
              Personal slide image
            </div>
            <AdminField
              label="Image URL or browser-uploaded image"
              value={content.aboutImages[1] ?? ""}
              onChange={(value) => updateAboutImage(1, value)}
            />
            {uploadControl("Upload About slide 2 image", {kind: "about", index: 1})}
            <button
              className="admin-button mt-3 px-4 py-2"
              type="button"
              onClick={() => updateAboutImage(1, "")}
            >
              Remove slide image
            </button>
          </div>
          <AdminTextArea
            label="Third about slide copy"
            value={content.about[2] ?? ""}
            onChange={(value) => updateAbout(2, value)}
          />
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <ImagePlus className="h-4 w-4" />
              Third slide image
            </div>
            <AdminField
              label="Image URL or browser-uploaded image"
              value={content.aboutImages[2] ?? ""}
              onChange={(value) => updateAboutImage(2, value)}
            />
            {uploadControl("Upload About slide 3 image", {kind: "about", index: 2})}
            <button
              className="admin-button mt-3 px-4 py-2"
              type="button"
              onClick={() => updateAboutImage(2, "")}
            >
              Remove slide image
            </button>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel
        defaultOpen
        icon={<BookOpenCheck className="h-5 w-5" />}
        eyebrow="Content"
        title="Project cards"
      >
        <div className="mt-6 space-y-4">
          {content.projects.map((project, index) => (
            <div
              className="rounded-3xl border border-white/10 bg-black/20 p-4"
              key={project.title}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100/70">
                    Project {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white/70">
                    {project.title}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    aria-label={`Move ${project.title} up`}
                    className="icon-button disabled:cursor-not-allowed disabled:opacity-35"
                    disabled={index === 0}
                    type="button"
                    onClick={() => moveProject(index, -1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Move ${project.title} down`}
                    className="icon-button disabled:cursor-not-allowed disabled:opacity-35"
                    disabled={index === content.projects.length - 1}
                    type="button"
                    onClick={() => moveProject(index, 1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <AdminField
                label="Title"
                value={project.title}
                onChange={(value) =>
                  updateProject(index, { ...project, title: value })
                }
              />
              <AdminTextArea
                label="Summary"
                value={project.summary}
                onChange={(value) =>
                  updateProject(index, { ...project, summary: value })
                }
              />
              <AdminTextArea
                label="Result"
                value={project.result}
                onChange={(value) =>
                  updateProject(index, { ...project, result: value })
                }
              />
              <AdminField
                label="Project link URL"
                value={project.url ?? ""}
                onChange={(value) =>
                  updateProject(index, { ...project, url: value })
                }
              />
              <AdminField
                label="Project page / card image URL"
                value={project.image ?? ""}
                onChange={(value) =>
                  updateProject(index, { ...project, image: value })
                }
              />
              {uploadControl(`Upload project page image for ${project.title}`, {kind: "project", project: getProjectSlug(project), field: "image"})}
              <p className="mt-2 text-xs font-semibold text-white/[0.48]">
                Uploaded project images save to your portfolio files automatically. Wait for the saved confirmation.
              </p>
              <button
                className="admin-button mt-3 px-4 py-2"
                type="button"
                onClick={() => updateProject(index, { ...project, image: "" })}
              >
                Remove project image
              </button>
              <div className="mt-5 rounded-2xl border border-white/10 p-4">
                <AdminField
                  label="Carousel image URL (independent of project page)"
                  value={project.carouselImage ?? ""}
                  onChange={(value) =>
                    updateProject(index, { ...project, carouselImage: value })
                  }
                />
                {uploadControl(`Upload carousel image for ${project.title}`, {kind: "project", project: getProjectSlug(project), field: "carouselImage"})}
                {(project.carouselImage ?? project.image) ? (
                  <img
                    alt={`Carousel preview for ${project.title}`}
                    className="mt-3 max-h-40 w-full rounded-xl object-contain"
                    src={project.carouselImage ?? project.image}
                  />
                ) : null}
                <p className="mt-2 text-xs text-white/60">
                  {project.carouselImage === undefined
                    ? "Currently using the project image. Upload a different image to change only the carousel."
                    : "This image setting applies only to the work carousel."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="admin-button px-4 py-2"
                    type="button"
                    disabled={isSavingProject}
                    onClick={saveToProject}
                  >
                    <Save className="h-4 w-4" /> {isSavingProject ? "Saving..." : "Save carousel image"}
                  </button>
                  <button
                    className="admin-button px-4 py-2"
                    type="button"
                    onClick={() => updateProject(index, { ...project, carouselImage: undefined })}
                  >
                    Use project image
                  </button>
                  <button
                    className="admin-button px-4 py-2"
                    type="button"
                    onClick={() => updateProject(index, { ...project, carouselImage: "" })}
                  >
                    Remove carousel image
                  </button>
                </div>
                <p role="status" className="mt-3 text-sm text-white/80">{saveStatus}</p>
                <a className="admin-button mt-3 px-4 py-2" href={`/?work=${encodeURIComponent(getProjectSlug(project))}#work`}>
                  <Eye className="h-4 w-4" /> Preview this modal
                </a>
              </div>
              <AdminField
                label="Internal tags, comma separated (not shown publicly)"
                value={project.tags.join(", ")}
                onChange={(value) =>
                  updateProject(index, {
                    ...project,
                    tags: value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          ))}
        </div>
      </AdminPanel>

      {exported ? (
        <AdminPanel
          defaultOpen
          icon={<Save className="h-5 w-5" />}
          eyebrow="Backup"
          title="Exported draft"
        >
          <div className="mb-3 flex items-center gap-2 font-bold text-white">
            <Save className="h-5 w-5" />
            Exported draft
          </div>
          <textarea
            className="admin-textarea min-h-[18rem] font-mono text-xs"
            value={exported}
            readOnly
          />
        </AdminPanel>
      ) : null}
    </section>
  );
}

function AdminPanel({
  children,
  defaultOpen = false,
  description,
  eyebrow,
  icon,
  title,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  description?: string;
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <details
      className="admin-panel glass-panel group overflow-hidden"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950">
            {icon}
          </div>
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100/70">
              {eyebrow}
            </p>
            <h2 className="text-2xl font-black text-white">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-white/[0.55]">{description}</p>
            ) : null}
          </div>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-white/60 transition group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6">{children}</div>
    </details>
  );
}

function AdminField({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-white/[0.65]">
      {label}
      <input
        className="admin-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AdminTextArea({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-white/[0.65]">
      {label}
      <textarea
        className="admin-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute left-[-10%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/20 blur-[110px]" />
      <div className="absolute right-[-10%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-violet-500/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[20%] h-[38rem] w-[38rem] rounded-full bg-emerald-400/10 blur-[130px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
    </div>
  );
}

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
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCallerUserRole } from "./hooks/useQueries";

type Project = {
  title: string;
  summary: string;
  result: string;
  tags: string[];
  image?: string;
  url?: string;
  slug?: string;
  contextUrl?: string;
  contextLabel?: string;
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
  aboutSelectedWorkKicker: string;
  aboutSelectedWorkTitle: string;
  proofPoints: string[];
  about: string[];
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

function saveLocalDraft(content: PortfolioContent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

const legacyAboutCopy = [
  "My work lives between learning strategy, customer adoption, technical enablement, and operational workflow design. I help teams move from scattered stakeholder requests to structured learning systems that can be delivered, measured, maintained, and trusted.",
  "Across federal, enterprise, municipal, SaaS, healthcare, sales, and technical environments, I focus on the part that matters most: making complex work easier for real people to perform without burying them in generic training.",
];

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
        "A full instructional design process example for CON 7020, translating technical contracting documentation into a structured online learning experience.",
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
    },
  "https://sites.google.com/view/instructionaldesignbyterry/projects/job-aid-template":
    {
      slug: "job-aid-template-system",
      url: "/work/job-aid-template-system",
    },
  "https://sites.google.com/view/instructionaldesignbyterry/projects/facilitator-guide":
    {
      slug: "facilitator-guide-adaptation",
      url: "/work/facilitator-guide-adaptation",
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
  aboutSelectedWorkKicker: "Selected work",
  aboutSelectedWorkTitle: "What I Build",
  proofPoints: [
    "Learning experiences built for federal, enterprise, SaaS, healthcare, sales, and technical audiences",
    "Scenario-based courses, job aids, QA systems, and enablement workflows",
    "Accessibility-aware design across Section 508/WCAG learning assets",
    "AI-assisted review and production workflows used to reduce manual rework",
  ],
  about: [
    "I help teams turn messy adoption, training, and workflow problems into learning systems people can actually use. My path has moved through defense, enterprise, municipal, SaaS, healthcare, sales, and technical environments, which taught me to design for real constraints instead of ideal conditions.",
    "Outside the work, I am drawn to systems, stories, games, music, visual design, and the way people learn when something finally clicks. That curiosity is a big part of my portfolio: I like building experiences that feel useful, human, and a little more alive than a standard resume.",
  ],
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
        "A full instructional design process example for CON 7020, translating technical contracting documentation into a structured online learning experience.",
      result:
        "Shows analysis, learning-objective mapping, storyboard design, interactive scenario planning, development, and implementation thinking across the full ADDIE process.",
      tags: ["ADDIE", "Government training", "Course architecture"],
      image: "/assets/con-7020-thumbnail.png",
      slug: "addie-model-from-start-to-finish",
      url: "/work/addie-model-from-start-to-finish",
      contextUrl: "https://icatalog.waru.edu/CourseDetail/12795",
      contextLabel: "View CON 7020 course context",
    },
    {
      title: "Quality Assurance Review System",
      summary:
        "A QA commentary workflow for a 50+ screen government eLearning course, documenting structural, instructional, formatting, and compliance issues for the production team.",
      result:
        "Highlights a systematic review practice across instructional quality, user experience, Section 508/WCAG expectations, and contractual standards.",
      tags: ["QA", "Accessibility", "Learning operations"],
      image: "",
      slug: "quality-assurance-review-system",
      url: "/work/quality-assurance-review-system",
    },
    {
      title: "Job Aid Template System",
      summary:
        "Performance-support templates created to turn dense regulatory and technical content into clearer job aids for DOD acquisition professionals.",
      result:
        "Demonstrates information architecture, visual hierarchy, essential-resource curation, and reusable template thinking for on-the-job support.",
      tags: ["Job aids", "Performance support", "Template design"],
      image: "",
      slug: "job-aid-template-system",
      url: "/work/job-aid-template-system",
    },
    {
      title: "Facilitator Guide Adaptation",
      summary:
        "A facilitator guide that adapted asynchronous online training into a synchronous instructor-led session using Gagne's Nine Events of Instruction.",
      result:
        "Shows how the same content can be redesigned across modalities while preserving instructional intent, timing, materials, and facilitation strategy.",
      tags: ["Facilitator guide", "ILT", "Modality conversion"],
      image: "",
      slug: "facilitator-guide-adaptation",
      url: "/work/facilitator-guide-adaptation",
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

  if (nextProject.title.toLowerCase().includes("enablement quest")) {
    return { ...nextProject, image: "/assets/projects/enablement-quest.gif" };
  }

  return nextProject;
}

function normalizeProjects(projects: Project[]) {
  return projects.map(normalizeProject);
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
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultContent;
  try {
    const parsed = JSON.parse(saved) as Partial<PortfolioContent>;
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
        : (parsed.about ?? defaultContent.about),
      projects: shouldUpgradeProjects
        ? normalizeProjects(defaultContent.projects)
        : normalizeProjects(parsed.projects ?? defaultContent.projects),
    };
  } catch {
    return defaultContent;
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  useEffect(() => {
    try {
      saveLocalDraft(content);
    } catch (error) {
      console.warn("Unable to save portfolio draft locally.", error);
    }
  }, [content]);

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
  return (
    <section className="glass-panel project-detail-page">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
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
          <div className="project-detail-result">{project.result}</div>
          <div className="project-detail-actions">
            <a className="secondary-cta" href="/#work">
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
  const selectedWork = content.projects
    .slice(0, 3)
    .map((project) => `${project.title}: ${project.result}`)
    .join(" ");
  const slides = [
    {
      kicker: content.aboutWorkKicker,
      title: content.aboutWorkTitle,
      copy: workStory,
    },
    {
      kicker: content.aboutPersonalKicker,
      title: content.aboutPersonalTitle,
      copy: personalStory,
    },
    {
      kicker: content.aboutSelectedWorkKicker,
      title: content.aboutSelectedWorkTitle,
      copy: selectedWork,
    },
    {
      kicker: "Contact",
      title: content.contactHeading,
      copy: content.contactText,
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
          <span className="retro-tv-screen-inner">
            <span className="retro-tv-kicker">{activeTvSlide.kicker}</span>
            <span className="retro-tv-title" id="about-modal-title">
              {activeTvSlide.title}
            </span>
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
    null,
  );
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
        onClose={() => setActiveProjectIndex(null)}
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
  const activeProject = projects[activeIndex] ?? projects[0];
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
          {activeProject.image ? (
            <img alt="" src={activeProject.image} />
          ) : (
            <div className="project-modal-placeholder">
              {activeProject.title}
            </div>
          )}
        </div>
        <div className="project-modal-content">
          <p className="retro-tv-kicker">
            Work {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>
          <h2 id="project-modal-title">{activeProject.title}</h2>
          <p className="project-modal-summary">{activeProject.summary}</p>
          <div className="project-modal-result">{activeProject.result}</div>
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
  const [saveStatus, setSaveStatus] = useState("Autosaves in this browser.");

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

  const handleImageUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateContent("profileImage", String(reader.result));
      setSaveStatus("Profile image added to this browser draft.");
    };
    reader.readAsDataURL(file);
  };

  const handleBrandLogoUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateContent("brandLogoImage", String(reader.result));
      setSaveStatus("Logo image added to this browser draft.");
    };
    reader.readAsDataURL(file);
  };

  const handleProjectImageUpload = (index: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const project = content.projects[index];
      updateProject(index, { ...project, image: String(reader.result) });
      setSaveStatus(
        "Project image added to this browser draft. Download a backup before switching devices.",
      );
    };
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    try {
      saveLocalDraft(content);
      setSaveStatus(`Saved locally at ${new Date().toLocaleTimeString()}.`);
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
        description="Edits save to this browser only. Use Preview local draft to review here; deploying requires committing these changes to the site."
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
          <input
            className="mt-3 block w-full text-sm text-white/[0.70]"
            type="file"
            accept="image/*,.svg"
            onChange={(event) => handleBrandLogoUpload(event.target.files?.[0])}
          />
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
          <input
            className="mt-3 block w-full text-sm text-white/[0.70]"
            type="file"
            accept="image/*"
            onChange={(event) => handleImageUpload(event.target.files?.[0])}
          />
          <p className="mt-2 text-xs font-semibold text-white/[0.48]">
            Uploaded files are stored in this browser draft. They are not
            deployed to the public site until we add them to the project and
            publish.
          </p>
          <AdminField
            label="Image position"
            value={content.profileImagePosition}
            onChange={(value) => updateContent("profileImagePosition", value)}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="admin-button" type="button" onClick={saveDraft}>
            <Save className="h-4 w-4" /> Save draft
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
        <p className="mt-3 text-xs font-semibold text-white/[0.50]">
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
          <div />
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
          <div />
          <AdminField
            label="Selected work slide kicker"
            value={content.aboutSelectedWorkKicker}
            onChange={(value) =>
              updateContent("aboutSelectedWorkKicker", value)
            }
          />
          <AdminField
            label="Selected work slide title"
            value={content.aboutSelectedWorkTitle}
            onChange={(value) => updateContent("aboutSelectedWorkTitle", value)}
          />
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
                label="Preview image/GIF URL"
                value={project.image ?? ""}
                onChange={(value) =>
                  updateProject(index, { ...project, image: value })
                }
              />
              <input
                className="mt-3 block w-full text-sm text-white/[0.70]"
                type="file"
                accept="image/*,.svg"
                onChange={(event) =>
                  handleProjectImageUpload(index, event.target.files?.[0])
                }
              />
              <p className="mt-2 text-xs font-semibold text-white/[0.48]">
                Uploads preview only in this browser draft. For the public
                portfolio, use a committed asset path or a hosted image URL.
              </p>
              <button
                className="admin-button mt-3 px-4 py-2"
                type="button"
                onClick={() => updateProject(index, { ...project, image: "" })}
              >
                Remove project image
              </button>
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

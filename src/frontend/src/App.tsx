import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Download,
  Eye,
  ImagePlus,
  LayoutTemplate,
  Lock,
  MousePointer2,
  Palette,
  Save,
  Wand2,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useCallerUserRole } from "./hooks/useQueries";

type Project = {
  title: string;
  summary: string;
  result: string;
  tags: string[];
  image?: string;
  url?: string;
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

const legacyAboutCopy = [
  "My work lives between learning strategy, customer adoption, technical enablement, and operational workflow design. I help teams move from scattered stakeholder requests to structured learning systems that can be delivered, measured, maintained, and trusted.",
  "Across federal, enterprise, municipal, SaaS, healthcare, sales, and technical environments, I focus on the part that matters most: making complex work easier for real people to perform without burying them in generic training.",
];

const legacyProjectTitles = [
  "Defense Workforce Learning Architecture",
  "AI-Assisted Production Workflow",
  "Distributed Onboarding & Compliance Systems",
];

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
    "If you are looking for someone who can connect learning strategy, technical enablement, AI-assisted workflows, and practical adoption systems, I would be glad to talk.",
  name: "Terry Brutus",
  eyebrow: "Learning & Enablement Architect | AI Workflow Automation",
  headline:
    "I build scalable learning systems that make complex work easier to adopt.",
  subheadline:
    "I translate stakeholder goals, skill gaps, and adoption blockers into practical enablement workflows, compliance-ready learning assets, and AI-assisted operations for federal, enterprise, SaaS, healthcare, sales, and technical teams.",
  location: "Leland, North Carolina",
  email: "terrbrutus@gmail.com",
  profileImage: "/assets/legacy/legacy-profile.png",
  profileImagePosition: "50% 42%",
  heroCardEyebrow: "Selected impact",
  heroCardFocusText:
    "Current focus: technical enablement, customer adoption, accessible learning systems, and AI-assisted production workflows.",
  workSectionHeading: "Evidence of scale, access, automation, and adoption",
  proofSectionHeading: "Proof points from the work",
  capabilitiesSectionHeading:
    "Core strengths pulled from the work, not buzzwords",
  templateSectionHeading: "A living portfolio that can keep evolving",
  aboutWorkKicker: "Work channel",
  aboutWorkTitle: "How I Got Here",
  aboutPersonalKicker: "Personal channel",
  aboutPersonalTitle: "Beyond The Work",
  aboutSelectedWorkKicker: "Selected work",
  aboutSelectedWorkTitle: "What I Build",
  proofPoints: [
    "8+ years in learning architecture and technical enablement",
    "158K+ defense learners supported through scalable training systems",
    "122+ enterprise learning assets governed for Section 508/WCAG",
    "AI-assisted workflows reducing review time by up to 90%",
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
      parsed.projects?.length === legacyProjectTitles.length &&
      parsed.projects.every(
        (project, index) => project.title === legacyProjectTitles[index],
      );
    return {
      ...defaultContent,
      ...parsed,
      about: shouldUpgradeAbout
        ? defaultContent.about
        : (parsed.about ?? defaultContent.about),
      projects: shouldUpgradeProjects
        ? defaultContent.projects
        : (parsed.projects ?? defaultContent.projects),
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const template = useMemo(
    () =>
      templates.find((item) => item.id === content.selectedTemplate) ??
      templates[0],
    [content.selectedTemplate],
  );

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
        <TopNav
          content={content}
          isAdmin={isAdmin}
          onOpenAbout={() => setIsAboutOpen(true)}
        />
        {isAdmin ? (
          <AdminStudio
            content={content}
            template={template}
            updateContent={updateContent}
            setContent={setContent}
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
  isAdmin,
  onOpenAbout,
}: {
  content: PortfolioContent;
  isAdmin: boolean;
  onOpenAbout: () => void;
}) {
  const hasLogo = Boolean(content.brandLogoImage || content.brandLogoText);
  const navItems = [
    { href: "#about", label: content.navApproachLabel, onClick: onOpenAbout },
    { href: "/#work", label: content.navWorkLabel },
    { href: "/#contact", label: content.navContactLabel },
    // Temporary while building: remove this item before public launch.
    {
      href: isAdmin ? "/" : "/admin",
      label: isAdmin ? content.navPreviewLabel : content.navAdminLabel,
    },
  ]
    .map((item) => ({ ...item, label: item.label.trim() }))
    .filter((item) => item.label.length > 0);

  return (
    <nav className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/[0.80] shadow-2xl shadow-black/20 backdrop-blur-xl">
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
      <section className="grid min-h-[72vh] items-start gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-sm font-medium text-white/[0.80] backdrop-blur">
            {content.eyebrow}
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            {content.headline}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/[0.72]">
            {content.subheadline}
          </p>
          {content.primaryCtaLabel || content.secondaryCtaLabel ? (
            <div className="mt-8 flex flex-wrap gap-3">
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

function HeroCard({
  content,
  template,
}: { content: PortfolioContent; template: Template }) {
  const impactStats = [
    ["8+ yrs", "learning architecture"],
    ["158K+", "defense learners"],
    ["122+", "accessible assets"],
    ["90%", "review-time reduction"],
  ];

  return (
    <div className="hero-orb relative mx-auto w-full max-w-[35rem] rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:mt-4">
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
          <div className="grid grid-cols-2 gap-3">
            {impactStats.map(([label, value]) => (
              <div
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4"
                key={label}
              >
                <span className="block text-2xl font-black tracking-tight text-white">
                  {label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-white/[0.62]">
                  {value}
                </span>
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

function ApproachSection({ content }: { content: PortfolioContent }) {
  return (
    <section
      id="about"
      className="glass-panel grid gap-8 p-7 lg:grid-cols-[0.65fr_1fr]"
    >
      <SectionHeader
        icon={<BrainCircuit className="h-5 w-5" />}
        eyebrow="Approach"
        title="I connect business needs to learning systems people can actually use."
      />
      <div className="space-y-5 text-lg leading-8 text-white/[0.72]">
        {content.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
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
  const goToSlide = (direction: -1 | 1) => {
    setActiveSlide(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goToSlide(-1);
      if (event.key === "ArrowRight") goToSlide(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, slides.length]);

  useEffect(() => {
    if (isOpen) setActiveSlide(0);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      aria-labelledby="about-modal-title"
      aria-modal="true"
      className="about-modal-backdrop"
      role="dialog"
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
    </div>
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
  return (
    <section id="work" className="glass-panel p-7">
      <SectionHeader
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        eyebrow={getSectionLabel(content, "projects")}
        title={content.workSectionHeading}
      />
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {content.projects.map((project, index) => (
          <article className="project-card group" key={project.title}>
            {project.image ? (
              <div className="mb-5 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/25">
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
            <h3 className="text-2xl font-black tracking-tight text-white">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/[0.65]">
              {project.summary}
            </p>
            <p className="mt-5 rounded-2xl bg-black/[0.25] p-4 text-sm leading-6 text-white/[0.75]">
              {project.result}
            </p>
            {project.url ? (
              <a
                className="mt-5 inline-flex text-sm font-bold text-cyan-200 transition hover:text-white"
                href={project.url}
                rel="noreferrer"
                target="_blank"
              >
                Open project <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
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
  template,
  updateContent,
  setContent,
}: {
  content: PortfolioContent;
  template: Template;
  updateContent: <K extends keyof PortfolioContent>(
    key: K,
    value: PortfolioContent[K],
  ) => void;
  setContent: React.Dispatch<React.SetStateAction<PortfolioContent>>;
}) {
  const [exported, setExported] = useState("");
  const [saveStatus, setSaveStatus] = useState("Autosaves in this browser.");

  const moveSection = (index: number, direction: -1 | 1) => {
    const next = [...content.sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateContent("sections", next);
  };

  const updateProject = (index: number, project: Project) => {
    const projects = [...content.projects];
    projects[index] = project;
    updateContent("projects", projects);
  };

  const updateSection = (index: number, section: PortfolioSection) => {
    const sections = [...content.sections];
    sections[index] = section;
    updateContent("sections", sections);
  };

  const updateAbout = (index: number, value: string) => {
    const about = [...content.about];
    about[index] = value;
    updateContent("about", about);
  };

  const updateProofPoint = (index: number, value: string) => {
    const proofPoints = [...content.proofPoints];
    proofPoints[index] = value;
    updateContent("proofPoints", proofPoints);
  };

  const updateCapability = (index: number, value: string) => {
    const capabilities = [...content.capabilities];
    capabilities[index] = value;
    updateContent("capabilities", capabilities);
  };

  const handleImageUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateContent("profileImage", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleBrandLogoUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      updateContent("brandLogoImage", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleProjectImageUpload = (index: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const project = content.projects[index];
      updateProject(index, { ...project, image: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setSaveStatus(`Saved locally at ${new Date().toLocaleTimeString()}.`);
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
    <section className="grid gap-6 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel sticky top-6 h-fit p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              Portfolio Admin Studio
            </h1>
            <p className="text-sm text-white/[0.55]">
              Local draft editor now. Auth/publish next.
            </p>
          </div>
        </div>

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
            <AdminField
              label="Preview link text for admin view"
              value={content.navPreviewLabel}
              onChange={(value) => updateContent("navPreviewLabel", value)}
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
            <Eye className="h-4 w-4" /> Preview
          </a>
        </div>
        <p className="mt-3 text-xs font-semibold text-white/[0.50]">
          {saveStatus}
        </p>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6">
          <SectionHeader
            icon={<Palette className="h-5 w-5" />}
            eyebrow="Templates"
            title="Choose a starting direction"
          />
          <div className="mt-6 grid gap-3 md:grid-cols-2">
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
        </div>

        <div className="glass-panel p-6">
          <SectionHeader
            icon={<MousePointer2 className="h-5 w-5" />}
            eyebrow="Pages & Sections"
            title="Edit what appears, what it is called, and where it sits"
          />
          <div className="mt-6 space-y-3">
            {content.sections.map((section, index) => (
              <div
                className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 md:grid-cols-[auto_1fr_auto_auto]"
                key={section.id}
              >
                <input
                  aria-label={`Show ${section.label}`}
                  className="mt-4"
                  checked={section.visible}
                  type="checkbox"
                  onChange={(event) => {
                    updateSection(index, {
                      ...section,
                      visible: event.target.checked,
                    });
                  }}
                />
                <AdminField
                  label={`Section label: ${section.id}`}
                  value={section.label}
                  onChange={(value) =>
                    updateSection(index, { ...section, label: value })
                  }
                />
                <div className="flex gap-2 md:items-end">
                  <button
                    aria-label={`Move ${section.label} up`}
                    className="icon-button"
                    type="button"
                    onClick={() => moveSection(index, -1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Move ${section.label} down`}
                    className="icon-button"
                    type="button"
                    onClick={() => moveSection(index, 1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
            <AdminField
              label="Proof points section heading"
              value={content.proofSectionHeading}
              onChange={(value) => updateContent("proofSectionHeading", value)}
            />
            <AdminField
              label="Capabilities section heading"
              value={content.capabilitiesSectionHeading}
              onChange={(value) =>
                updateContent("capabilitiesSectionHeading", value)
              }
            />
            <AdminField
              label="Template section heading"
              value={content.templateSectionHeading}
              onChange={(value) =>
                updateContent("templateSectionHeading", value)
              }
            />
          </div>
        </div>

        <div className="glass-panel p-6">
          <SectionHeader
            icon={<ArrowRight className="h-5 w-5" />}
            eyebrow="Calls To Action"
            title="Hero buttons and contact block"
          />
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
        </div>

        <div className="glass-panel p-6">
          <SectionHeader
            icon={<BookOpenCheck className="h-5 w-5" />}
            eyebrow="About Modal"
            title="Edit the About Me TV carousel"
          />
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
              onChange={(value) =>
                updateContent("aboutSelectedWorkTitle", value)
              }
            />
          </div>
        </div>

        <div className="glass-panel p-6">
          <SectionHeader
            icon={<BadgeCheck className="h-5 w-5" />}
            eyebrow="Proof & Capabilities"
            title="Edit the supporting evidence blocks"
          />
          <div className="mt-6 grid gap-4">
            {content.proofPoints.map((point, index) => (
              <AdminTextArea
                key={`proof-${index}`}
                label={`Proof point ${index + 1}`}
                value={point}
                onChange={(value) => updateProofPoint(index, value)}
              />
            ))}
            {content.capabilities.map((capability, index) => (
              <AdminTextArea
                key={`capability-${index}`}
                label={`Capability ${index + 1}`}
                value={capability}
                onChange={(value) => updateCapability(index, value)}
              />
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <SectionHeader
            icon={<BookOpenCheck className="h-5 w-5" />}
            eyebrow="Content"
            title="Project cards"
          />
          <div className="mt-6 space-y-4">
            {content.projects.map((project, index) => (
              <div
                className="rounded-3xl border border-white/10 bg-black/20 p-4"
                key={project.title}
              >
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
                <button
                  className="admin-button mt-3 px-4 py-2"
                  type="button"
                  onClick={() =>
                    updateProject(index, { ...project, image: "" })
                  }
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
        </div>

        {exported ? (
          <div className="glass-panel p-6">
            <div className="mb-3 flex items-center gap-2 font-bold text-white">
              <Save className="h-5 w-5" />
              Exported draft
            </div>
            <textarea
              className="admin-textarea min-h-[18rem] font-mono text-xs"
              value={exported}
              readOnly
            />
          </div>
        ) : null}
      </div>
    </section>
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

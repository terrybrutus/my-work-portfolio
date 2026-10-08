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
  proofPoints: [
    "8+ years in learning architecture and technical enablement",
    "158K+ defense learners supported through scalable training systems",
    "122+ enterprise learning assets governed for Section 508/WCAG",
    "AI-assisted workflows reducing review time by up to 90%",
  ],
  about: [
    "My work lives between learning strategy, customer adoption, technical enablement, and operational workflow design. I help teams move from scattered stakeholder requests to structured learning systems that can be delivered, measured, maintained, and trusted.",
    "Across federal, enterprise, municipal, SaaS, healthcare, sales, and technical environments, I focus on the part that matters most: making complex work easier for real people to perform without burying them in generic training.",
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
      title: "Defense Workforce Learning Architecture",
      summary:
        "Learning architecture and technical enablement for a 158,000-person defense acquisition workforce, translating stakeholder needs into scalable readiness solutions.",
      result:
        "Improved delivery quality, governed 122+ accessible assets, and contributed to expanded client confidence and engagement scope.",
      tags: ["Federal learning", "Technical enablement", "Accessibility"],
      image: "/assets/legacy/legacy-motion.gif",
      url: "",
    },
    {
      title: "AI-Assisted Production Workflow",
      summary:
        "A content analysis and skills-alignment workflow that uses AI to accelerate review, QA, and production decisions across large learning asset sets.",
      result:
        "Cut per-deliverable processing from roughly 1.5 hours to 9.5 minutes across 100+ assets and became a documented production standard.",
      tags: ["AI workflow automation", "Learning operations", "QA"],
      image: "",
      url: "",
    },
    {
      title: "Distributed Onboarding & Compliance Systems",
      summary:
        "Consulting work across enterprise and municipal contexts, including onboarding for distributed selling communities and compliance enablement without traditional LMS infrastructure.",
      result:
        "Standardized enablement delivery across 400+ selling communities and created audit-ready compliance coverage for 1,750+ employees.",
      tags: ["Customer adoption", "Compliance", "Program design"],
      image: "",
      url: "",
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
    return { ...defaultContent, ...JSON.parse(saved) };
  } catch {
    return defaultContent;
  }
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
                Selected impact
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
            Current focus: technical enablement, customer adoption, accessible
            learning systems, and AI-assisted production workflows.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProofStrip({ content }: { content: PortfolioContent }) {
  return (
    <section className="glass-panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {content.proofPoints.map((point) => (
        <div
          className="rounded-3xl border border-white/10 bg-black/20 p-5"
          key={point}
        >
          <BadgeCheck className="mb-4 h-6 w-6 text-cyan-200" />
          <p className="font-bold text-white">{point}</p>
        </div>
      ))}
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
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      <div className="about-tv-shell">
        <div className="about-tv-screen">
          <button className="about-tv-close" onClick={onClose} type="button">
            Close
          </button>
          <div className="about-tv-content">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-700/70">
              About broadcast
            </p>
            <h2
              className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl"
              id="about-modal-title"
            >
              {content.name}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-900/80">
              {content.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="about-tv-controls" aria-hidden="true">
          <div className="about-tv-speaker" />
          <div className="about-tv-knob" />
          <div className="about-tv-small-knobs">
            <span />
            <span />
          </div>
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
        eyebrow="Capabilities"
        title="Core strengths pulled from the work, not buzzwords"
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
        eyebrow="Selected Work"
        title="Evidence of scale, access, automation, and adoption"
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
        eyebrow="Contact"
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
        eyebrow="Template System"
        title="A living portfolio that can keep evolving"
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
            eyebrow="Layout"
            title="Reorder and show/hide sections"
          />
          <div className="mt-6 space-y-3">
            {content.sections.map((section, index) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                key={section.id}
              >
                <input
                  checked={section.visible}
                  type="checkbox"
                  onChange={(event) => {
                    const sections = [...content.sections];
                    sections[index] = {
                      ...section,
                      visible: event.target.checked,
                    };
                    updateContent("sections", sections);
                  }}
                />
                <span className="flex-1 font-bold text-white">
                  {section.label}
                </span>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => moveSection(index, -1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => moveSection(index, 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            ))}
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

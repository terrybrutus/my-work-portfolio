import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type Project,
  getProofPoints,
  projects,
  proofPoints,
} from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import {
  getDisplayProject,
  getDisplayProjects,
} from "@/lib/portfolioCustomization";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

type ProjectsProps = {
  activeProject: string | null;
  onSelectProject: (id: string) => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  projectIds?: string[];
  proofIds?: string[];
  skillIds?: string[];
};

export function Projects({
  activeProject,
  onSelectProject,
  eyebrow = "Portfolio evidence",
  title = "Work that connects learning, systems, and execution.",
  description = "A focused collection of enablement systems, learning experiences, AI workflows, and product-minded prototypes.",
  projectIds,
  proofIds,
  skillIds,
}: ProjectsProps) {
  const scrollTo = useSmoothScroll();
  const displayProjects = getDisplayProjects();
  const visibleProjects =
    projectIds && projectIds.length > 0
      ? projectIds
          .map((id) => displayProjects.find((project) => project.id === id))
          .filter((project): project is Project => Boolean(project))
      : displayProjects;
  const visibleProof =
    proofIds && proofIds.length > 0
      ? getProofPoints(proofIds)
      : proofPoints.slice(0, 4);
  const proofGridClass =
    visibleProof.length >= 4
      ? "md:grid-cols-4"
      : visibleProof.length === 3
        ? "md:grid-cols-3"
        : visibleProof.length === 2
          ? "md:grid-cols-2"
          : "md:grid-cols-1";

  return (
    <section id="projects" className="bg-[#f8f5ef] py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 grid gap-5 border-y border-black/15 py-6 lg:grid-cols-[0.32fr_0.68fr]"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/50">
              {eyebrow}
            </p>
          </div>
          <div>
            <h2 className="font-display max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight text-black sm:text-5xl md:text-6xl">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/65">
              {description}
            </p>
            {skillIds && skillIds.length > 0 ? (
              <div className="mt-5 flex max-w-3xl flex-wrap gap-2">
                {skillIds.slice(0, 8).map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </motion.div>

        <div
          className={`mb-8 grid gap-px overflow-hidden border border-black/15 bg-black/15 ${proofGridClass}`}
        >
          {visibleProof.slice(0, 4).map((proofPoint) => (
            <div key={proofPoint.id} className="bg-[#f8f5ef] p-5">
              <p className="font-display text-3xl font-semibold text-black">
                {proofPoint.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-black">
                {proofPoint.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/58">
                {proofPoint.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="border border-black/15 bg-black">
          <div className="grid gap-px bg-black/80 lg:grid-cols-12">
            {visibleProjects.slice(0, 5).map((project, index) => (
              <ProjectTile
                key={project.id}
                project={project}
                index={index}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        </div>

        {visibleProjects.length > 5 ? (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="rounded-none border-black/20 bg-transparent"
              onClick={() => {
                window.history.pushState({}, "", "/work");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
            >
              Open full work view
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : null}

        {activeProject && (
          <ProjectDetail
            projectId={activeProject}
            onClose={() => {
              onSelectProject("");
              scrollTo("projects");
            }}
          />
        )}
      </div>
    </section>
  );
}

function ProjectTile({
  project,
  index,
  onSelectProject,
}: {
  project: Project;
  index: number;
  onSelectProject: (id: string) => void;
}) {
  const isFeature = index < 2;
  const palette = [
    "bg-[#bfe9f8]",
    "bg-[#f09a7c]",
    "bg-[#dbd5ff]",
    "bg-[#0f968f]",
    "bg-[#fb4ed8]",
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={[
        "group min-h-[360px]",
        isFeature ? "lg:col-span-6" : "lg:col-span-4",
        palette[index % palette.length],
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onSelectProject(project.id)}
        data-ocid={`projects.item.${index + 1}`}
        className="flex h-full w-full flex-col justify-between p-4 text-left sm:p-5"
        aria-label={`View ${project.title}`}
      >
        <div className="overflow-hidden border border-black/15 bg-white/45">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              className={[
                "w-full object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-[1.03]",
                isFeature ? "aspect-[16/10]" : "aspect-[4/3]",
              ].join(" ")}
            />
          ) : (
            <div
              className={[
                "flex w-full items-center justify-center bg-white/50 font-display text-5xl font-semibold text-black/35",
                isFeature ? "aspect-[16/10]" : "aspect-[4/3]",
              ].join(" ")}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-black/55">
              {project.category}
            </span>
            <span className="font-mono text-xs text-black/45">
              {project.year}
            </span>
          </div>
          <h3
            className={[
              "font-display mt-3 font-semibold leading-[0.98] text-black",
              isFeature ? "text-4xl sm:text-5xl" : "text-3xl",
            ].join(" ")}
          >
            {project.title}
          </h3>
          <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-black/68">
            {project.shortDescription}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black">
            Inspect work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </button>
    </motion.article>
  );
}

function ProjectDetail({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const baseProject = projects.find((p) => p.id === projectId);
  if (!baseProject) return null;

  const project = getDisplayProject(baseProject);

  return (
    <motion.div
      id="project-detail"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-10 overflow-hidden border border-black/15 bg-white"
    >
      <div className="bg-muted aspect-[16/9] w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{project.category}</Badge>
            <span className="text-muted-foreground text-sm">
              {project.year}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="size-4" />
            Back to projects
          </Button>
        </div>

        <h3 className="font-display text-4xl font-semibold leading-none tracking-tight text-black sm:text-5xl">
          {project.title}
        </h3>

        <p className="max-w-3xl text-base leading-relaxed text-black/66 md:text-lg">
          {project.fullDescription}
        </p>

        <div className="grid gap-px overflow-hidden border border-black/15 bg-black/15 md:grid-cols-3">
          <DetailColumn title="Problem" body={project.problem} />
          <DetailList title="Actions" items={project.actions} />
          <DetailList title="Outcomes" items={project.outcomes} />
        </div>

        <div className="flex flex-wrap gap-2">
          {getProofPoints(project.proofIds).map((proofPoint) => (
            <Badge key={proofPoint.id} variant="outline">
              {proofPoint.value} {proofPoint.label}
            </Badge>
          ))}
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-px overflow-hidden border border-black/15 bg-black/15 md:grid-cols-[1fr_0.8fr]">
          <div className="bg-white p-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
              Evidence packet
            </p>
            <div className="mt-4 grid gap-3">
              {project.artifactHighlights.map((artifact) => (
                <div key={artifact} className="flex gap-3">
                  <span className="mt-2 size-2 bg-black" />
                  <p className="text-sm leading-relaxed text-black/65">
                    {artifact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
              Source signal
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black/65">
              {project.sourceNote}
            </p>
            {project.repo ? (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a href={project.repo} target="_blank" rel="noreferrer">
                  View repo
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailColumn({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white p-5">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
        {title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-black/65">{body}</p>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white p-5">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-black/65">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

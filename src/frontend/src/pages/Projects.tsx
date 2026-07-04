import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type Project,
  getProofPoints,
  projects,
  proofPoints,
} from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
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
  eyebrow = "Proof of work",
  title = "Work",
  description = "A focused collection of enablement systems, learning experiences, AI workflows, and product-minded prototypes.",
  projectIds,
  proofIds,
  skillIds,
}: ProjectsProps) {
  const scrollTo = useSmoothScroll();
  const visibleProjects =
    projectIds && projectIds.length > 0
      ? projectIds
          .map((id) => projects.find((project) => project.id === id))
          .filter((project): project is Project => Boolean(project))
      : projects;
  const visibleProof =
    proofIds && proofIds.length > 0
      ? getProofPoints(proofIds)
      : proofPoints.slice(0, 4);

  return (
    <section
      id="projects"
      className="bg-muted/30 border-border border-y py-20 md:py-28"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 flex flex-col gap-3"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-wider">
            {eyebrow}
          </p>
          <h2 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
            {description}
          </p>
          {skillIds && skillIds.length > 0 ? (
            <div className="mt-2 flex max-w-3xl flex-wrap gap-2">
              {skillIds.slice(0, 8).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </motion.div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProof.map((proofPoint) => (
            <div
              key={proofPoint.id}
              className="bg-card border-border rounded-xl border p-5 shadow-elevated"
            >
              <p className="font-display text-foreground text-2xl font-bold">
                {proofPoint.value}
              </p>
              <p className="text-foreground mt-2 text-sm font-semibold">
                {proofPoint.label}
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {proofPoint.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border-border group flex flex-col overflow-hidden rounded-xl border shadow-elevated transition-smooth hover:-translate-y-1 hover:shadow-elevated-lg"
            >
              <button
                type="button"
                onClick={() => onSelectProject(project.id)}
                data-ocid={`projects.item.${index + 1}`}
                className="block w-full text-left"
                aria-label={`View ${project.title}`}
              >
                <div className="bg-muted aspect-[4/3] overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{project.category}</Badge>
                    <span className="text-muted-foreground text-xs">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="font-display text-foreground text-xl font-semibold leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getProofPoints(project.proofIds)
                      .slice(0, 2)
                      .map((proofPoint) => (
                        <span
                          key={proofPoint.id}
                          className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium"
                        >
                          {proofPoint.value} {proofPoint.label}
                        </span>
                      ))}
                  </div>
                  <span className="text-primary group-hover:text-primary/80 mt-1 inline-flex items-center gap-1.5 text-sm font-medium transition-smooth">
                    View
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            </motion.article>
          ))}
        </div>

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

function ProjectDetail({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  return (
    <motion.div
      id="project-detail"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-background border-border mt-12 overflow-hidden rounded-xl border shadow-elevated-lg"
    >
      <div className="bg-muted aspect-[16/9] w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-6 p-8 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{project.category}</Badge>
            <span className="text-muted-foreground text-sm">
              {project.year}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="project.back_button"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Button>
        </div>

        <h3 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h3>

        <p className="text-muted-foreground max-w-3xl text-base leading-relaxed md:text-lg">
          {project.fullDescription}
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Problem
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {project.problem}
            </p>
          </div>
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Actions
            </p>
            <ul className="text-muted-foreground mt-2 space-y-2 text-sm leading-relaxed">
              {project.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Outcomes
            </p>
            <ul className="text-muted-foreground mt-2 space-y-2 text-sm leading-relaxed">
              {project.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </div>
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

        <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
          <div className="border-border bg-card rounded-xl border p-5 shadow-elevated">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Evidence packet
            </p>
            <div className="mt-4 grid gap-3">
              {project.artifactHighlights.map((artifact) => (
                <div key={artifact} className="flex gap-3">
                  <span className="bg-primary/10 mt-1 size-2 rounded-full" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {artifact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border p-5 shadow-elevated">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Source signal
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
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

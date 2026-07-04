import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

type ProjectsProps = {
  activeProject: string | null;
  onSelectProject: (id: string) => void;
};

export function Projects({ activeProject, onSelectProject }: ProjectsProps) {
  const scrollTo = useSmoothScroll();

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
            Selected work
          </p>
          <h2 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
            A focused collection of recent commissions and personal work. Tap
            any project to read the full case study.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
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

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

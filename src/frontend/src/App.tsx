import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import {
  type LaneProfile,
  type Project,
  getLaneProfile,
  getProjectById,
  getProofPoints,
  projects,
} from "@/data/projects";
import {
  type ReviewerView,
  getReviewerView,
  getRouteState,
} from "@/lib/portfolioStrategy";
import { loadPersistedReviewerView } from "@/lib/reviewerStore";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Hero } from "@/pages/Hero";
import { Projects } from "@/pages/Projects";
import { Studio } from "@/pages/Studio";
import { useEffect, useState } from "react";

const fallbackReviewSkills = [
  "Enablement Strategy",
  "Learning Experience Design",
  "AI Workflow Design",
  "Workflow Prototyping",
  "Measurement Planning",
];

export default function App() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [routeState, setRouteState] = useState(() => getRouteState());
  const [persistedReviewView, setPersistedReviewView] =
    useState<ReviewerView | null>(null);

  useEffect(() => {
    const updateRoute = () => {
      setRouteState(getRouteState());
      setActiveProject(null);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", updateRoute);
    window.addEventListener("hashchange", updateRoute);
    return () => {
      window.removeEventListener("popstate", updateRoute);
      window.removeEventListener("hashchange", updateRoute);
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setPersistedReviewView(null);

    if (routeState.section === "review" && routeState.slug) {
      loadPersistedReviewerView(routeState.slug).then((view) => {
        if (isCurrent) {
          setPersistedReviewView(view);
        }
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [routeState.section, routeState.slug]);

  const handleSelectProject = (id: string) => {
    setActiveProject(id || null);
    if (id) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById("project-detail");
        if (el) {
          const header = document.querySelector("[data-header]");
          const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;
          const top =
            el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    }
  };

  if (routeState.section === "studio") {
    return (
      <Layout>
        <Studio />
      </Layout>
    );
  }

  if (routeState.section === "review") {
    const view = persistedReviewView ?? getReviewerView(routeState.slug);
    const lanes = view?.lanes ?? ["Enablement", "Learning Experience"];
    const laneProfile = getLaneProfile(lanes[0]);
    const projectIds =
      view?.projectIds ?? projects.slice(0, 3).map((project) => project.id);
    const proofIds = view?.proofIds ?? ["defense-workforce", "asset-cycle"];
    const skillIds = view?.skillIds ?? fallbackReviewSkills;

    return (
      <Layout>
        <Projects
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          eyebrow={laneProfile.lane}
          title={view?.headline ?? laneProfile.headline}
          description={view?.summary ?? laneProfile.reviewerTakeaway}
          projectIds={projectIds}
          proofIds={proofIds}
          skillIds={skillIds}
        />
        <ReviewFitNotes
          laneProfile={laneProfile}
          projectIds={projectIds}
          proofIds={proofIds}
          skillIds={skillIds}
        />
        <About />
        <Contact />
      </Layout>
    );
  }

  if (routeState.section === "work") {
    return (
      <Layout>
        <Projects
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          eyebrow="Evidence portfolio"
          title="Work that connects learning, systems, and execution."
        />
        <About />
        <Contact />
      </Layout>
    );
  }

  return (
    <Layout>
      <Hero />
      <Projects
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        projectIds={projects.slice(0, 3).map((project) => project.id)}
        proofIds={["defense-workforce", "asset-cycle", "release-depth"]}
        eyebrow="Preview"
        title="A quick look at the work."
        description="A light preview of the broader portfolio. The full work view keeps the proof organized without overloading the front door."
      />
      <About />
      <Contact />
    </Layout>
  );
}

function ReviewFitNotes({
  laneProfile,
  projectIds,
  proofIds,
  skillIds,
}: {
  laneProfile: LaneProfile;
  projectIds: string[];
  proofIds: string[];
  skillIds: string[];
}) {
  const visibleProjects = projectIds
    .map((projectId) => getProjectById(projectId))
    .filter((project): project is Project => Boolean(project));
  const visibleProof = getProofPoints(proofIds).slice(0, 3);

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Why these examples
            </p>
            <h2 className="font-display text-foreground mt-3 text-3xl font-bold tracking-tight">
              A focused read on {laneProfile.lane.toLowerCase()} work.
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              {laneProfile.proofNarrative}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {laneProfile.evidenceFocus.map((focus) => (
                <Badge key={focus} variant="outline">
                  {focus}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border-border bg-card rounded-xl border p-5 shadow-elevated">
              <p className="text-foreground text-sm font-semibold">
                Work to inspect
              </p>
              <div className="mt-3 space-y-2">
                {visibleProjects.slice(0, 3).map((project) => (
                  <p
                    key={project.id}
                    className="text-muted-foreground text-sm leading-relaxed"
                  >
                    {project.title}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-border bg-card rounded-xl border p-5 shadow-elevated">
              <p className="text-foreground text-sm font-semibold">
                Proof signals
              </p>
              <div className="mt-3 space-y-2">
                {visibleProof.map((proofPoint) => (
                  <p key={proofPoint.id} className="text-sm leading-relaxed">
                    <span className="text-foreground font-semibold">
                      {proofPoint.value}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {proofPoint.label}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            <div className="border-border bg-card rounded-xl border p-5 shadow-elevated">
              <p className="text-foreground text-sm font-semibold">
                Capabilities
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skillIds.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {visibleProjects.slice(0, 3).map((project) => {
            const proofPoint = getProofPoints(project.proofIds)[0];

            return (
              <article
                key={project.id}
                className="border-border bg-card overflow-hidden rounded-xl border shadow-elevated"
              >
                <div className="bg-muted aspect-[16/9] overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-foreground text-sm font-semibold">
                    {project.title}
                  </p>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                    {project.shortDescription}
                  </p>
                  {proofPoint ? (
                    <Badge variant="outline" className="mt-4">
                      {proofPoint.value} {proofPoint.label}
                    </Badge>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

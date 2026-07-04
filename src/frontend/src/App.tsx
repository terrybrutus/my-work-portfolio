import { Layout } from "@/components/Layout";
import { getLaneProfile, projects } from "@/data/projects";
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
    const view = getReviewerView(routeState.slug) ?? persistedReviewView;
    const lanes = view?.lanes ?? ["Enablement", "Learning Experience"];
    const laneProfile = getLaneProfile(lanes[0]);
    const projectIds =
      view?.projectIds ?? projects.slice(0, 3).map((project) => project.id);

    return (
      <Layout>
        <Projects
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          eyebrow={laneProfile.lane}
          title={view?.headline ?? laneProfile.headline}
          description={view?.summary ?? laneProfile.reviewerTakeaway}
          projectIds={projectIds}
          proofIds={view?.proofIds}
          skillIds={view?.skillIds ?? fallbackReviewSkills}
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

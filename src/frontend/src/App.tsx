import { Layout } from "@/components/Layout";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Hero } from "@/pages/Hero";
import { Projects } from "@/pages/Projects";
import { useState } from "react";

export default function App() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const handleSelectProject = (id: string) => {
    setActiveProject(id || null);
    if (id) {
      // Allow the detail panel to mount before scrolling into view.
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

  return (
    <Layout>
      <Hero />
      <Projects
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
      />
      <About />
      <Contact />
    </Layout>
  );
}

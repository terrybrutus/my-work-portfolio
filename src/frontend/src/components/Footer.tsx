import { navLinks, profile } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export function Footer() {
  const scrollTo = useSmoothScroll();
  const year = new Date().getFullYear();

  const handleNav = (route: string, id: string) => {
    if (route === "/work") {
      window.history.pushState({}, "", "/work");
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.requestAnimationFrame(() => scrollTo("projects"));
      return;
    }
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.requestAnimationFrame(() => scrollTo(id));
  };

  return (
    <footer className="bg-muted/50 border-border border-t">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-foreground text-lg font-bold tracking-tight">
            {profile.name}
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Enablement systems, learning experiences, and practical AI workflows
            for teams that need clearer execution.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-foreground text-sm font-semibold">Quick links</p>
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.route, link.id)}
              data-ocid={`footer.link.${link.id}`}
              className="text-muted-foreground hover:text-primary w-fit text-sm transition-smooth"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-border border-t">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            Copyright {year} {profile.name}.
          </p>
          <p className="text-muted-foreground text-xs">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

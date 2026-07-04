import { navLinks } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export function Footer() {
  const scrollTo = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-border border-t">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-foreground text-lg font-bold tracking-tight">
            My Work Portfolio
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            A selection of recent work in product design, brand identity, and
            editorial illustration.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-foreground text-sm font-semibold">Quick links</p>
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
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
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined"
                  ? window.location.hostname
                  : "portfolio",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-muted-foreground text-xs">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

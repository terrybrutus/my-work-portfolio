import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const scrollTo = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    scrollTo(id);
  };

  return (
    <header
      data-header
      className={cn(
        "bg-card/80 border-border sticky top-0 z-40 w-full border-b backdrop-blur-md transition-smooth",
        scrolled ? "shadow-elevated" : "shadow-none",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <button
          type="button"
          onClick={() => handleNav("hero")}
          data-ocid="header.logo"
          className="font-display text-foreground text-lg font-bold tracking-tight transition-smooth hover:text-primary"
        >
          My Work Portfolio
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              data-ocid={`header.nav.${link.id}`}
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-smooth"
            >
              {link.label}
            </button>
          ))}
          <Button
            size="sm"
            className="ml-2"
            onClick={() => handleNav("contact")}
            data-ocid="header.cta_button"
          >
            Get in touch
          </Button>
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
              data-ocid="header.open_modal_button"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card w-72">
            <SheetHeader>
              <SheetTitle className="font-display">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.id)}
                    data-ocid={`header.nav.${link.id}.mobile`}
                    className="text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-3 text-left text-base font-medium transition-smooth"
                  >
                    {link.label}
                  </button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

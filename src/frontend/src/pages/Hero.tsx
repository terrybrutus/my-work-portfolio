import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile, projects, proofPoints } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { ArrowRight, BriefcaseBusiness, Mail } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const scrollTo = useSmoothScroll();
  const previewProof = proofPoints.slice(0, 3);

  return (
    <section
      id="hero"
      className="bg-background relative flex min-h-[88vh] items-center justify-center overflow-hidden"
    >
      {/* Decorative background image + orbs */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/assets/portfolio/hero-bg.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute top-1/4 right-[8%] h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-orb-drift" />
        <div
          className="absolute bottom-1/4 left-[10%] h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-orb-drift"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6">
            {profile.title}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-foreground max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {profile.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          {profile.shortSummary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={() => {
              window.history.pushState({}, "", "/work");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            data-ocid="hero.primary_button"
            className="w-full sm:w-auto"
          >
            View Work
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("contact")}
            data-ocid="hero.secondary_button"
            className="w-full sm:w-auto"
          >
            <Mail className="size-4" />
            Get in Touch
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid w-full max-w-4xl gap-3 sm:grid-cols-3"
        >
          {previewProof.map((proofPoint) => (
            <div
              key={proofPoint.id}
              className="bg-card/85 border-border rounded-xl border p-4 text-left shadow-elevated backdrop-blur"
            >
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-4" />
              </div>
              <p className="font-display text-foreground text-2xl font-bold">
                {proofPoint.value}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {proofPoint.label}
              </p>
            </div>
          ))}
        </motion.div>

        <p className="text-muted-foreground mt-6 text-sm">
          Previewing {projects.length} evidence-backed work examples across
          enablement, learning systems, AI workflows, and technical prototypes.
        </p>
      </div>
    </section>
  );
}

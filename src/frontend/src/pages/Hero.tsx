import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const scrollTo = useSmoothScroll();

  return (
    <section
      id="hero"
      className="bg-background relative flex min-h-[88vh] items-center justify-center overflow-hidden"
    >
      {/* Decorative background image + orbs */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/assets/generated/hero-bg.dim_1600x1000.png"
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
            Product Designer &amp; Visual Storyteller
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-foreground max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Design that speaks for itself.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          I craft calm, considered interfaces and identities for teams who care
          about the details. A selection of recent work across product, brand,
          and editorial.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={() => scrollTo("projects")}
            data-ocid="hero.primary_button"
            className="w-full sm:w-auto"
          >
            View Projects
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
      </div>
    </section>
  );
}

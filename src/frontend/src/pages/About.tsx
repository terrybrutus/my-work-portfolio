import { Badge } from "@/components/ui/badge";
import { skills } from "@/data/projects";
import { motion } from "motion/react";

export function About() {
  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center md:justify-start"
          >
            <div className="bg-muted relative h-64 w-64 overflow-hidden rounded-full shadow-elevated-lg sm:h-80 sm:w-80">
              <img
                src="/assets/generated/profile.dim_800x800.png"
                alt="Portrait of the designer"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              About
            </p>
            <h2 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              A designer who listens first.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              I'm a product designer and visual storyteller with a decade of
              experience turning complex problems into calm, usable interfaces.
              My work spans product design, brand identity, and editorial
              illustration — unified by a belief that good design is mostly
              about subtraction. I work best with small teams who care about
              craft and want a partner, not a vendor.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Currently based in the Pacific Northwest, available for select
              commissions and full-time roles.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

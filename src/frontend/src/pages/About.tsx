import { Badge } from "@/components/ui/badge";
import { humanHighlights, profile, skills } from "@/data/projects";
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
            <div className="border-border bg-card flex aspect-square w-full max-w-80 flex-col justify-between rounded-3xl border p-8 shadow-elevated-lg">
              <div className="text-primary font-display text-7xl font-bold">
                TB
              </div>
              <div>
                <p className="text-foreground font-display text-2xl font-semibold">
                  Builder. Strategist. Maker.
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Former Division I athlete with a hands-on creative streak and
                  a bias for useful systems.
                </p>
              </div>
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
              Systems thinker, learning designer, practical builder.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              {profile.shortSummary} My background sits at the intersection of
              instructional systems design, enablement strategy, AI-assisted
              workflow design, and product-minded prototyping.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              I work best where the challenge is messy: people need to learn
              something, leaders need evidence, and the system needs to become
              easier to run after the project ships.
            </p>

            <div className="grid gap-3 pt-2">
              {humanHighlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="border-border bg-card rounded-lg border p-4 shadow-elevated"
                >
                  <p className="text-foreground text-sm font-semibold">
                    {highlight.label}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {highlight.detail}
                  </p>
                </div>
              ))}
            </div>

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

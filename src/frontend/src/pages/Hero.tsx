import { Button } from "@/components/ui/button";
import { proofPoints } from "@/data/projects";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { getDisplayProfile } from "@/lib/portfolioCustomization";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const scrollTo = useSmoothScroll();
  const displayProfile = getDisplayProfile();
  const previewProof = proofPoints.slice(0, 3);
  const nameParts = displayProfile.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? displayProfile.name;
  const remainingName = nameParts.slice(1).join(" ") || "Portfolio";

  return (
    <section
      id="hero"
      className="bg-background border-border min-h-[86vh] border-b pt-10 md:pt-16"
    >
      <div className="container">
        <div className="grid min-h-[72vh] gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between gap-10 border-black/10 bg-[#f4f1ea] p-5 sm:p-8 lg:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/55">
                Portfolio / Proof System
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/55">
                {displayProfile.location}
              </p>
            </div>

            <div>
              <p className="mb-5 max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-black/50">
                {displayProfile.title}
              </p>
              <h1 className="font-display max-w-5xl text-[clamp(3.3rem,11vw,8.75rem)] font-semibold leading-[0.9] text-black">
                {firstName}
                <br />
                {remainingName}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/70">
                {displayProfile.headline}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => {
                  window.history.pushState({}, "", "/work");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                data-ocid="hero.primary_button"
                className="rounded-none bg-black text-white hover:bg-black/85"
              >
                View Work
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("contact")}
                data-ocid="hero.secondary_button"
                className="rounded-none border-black/25 bg-transparent text-black hover:bg-black hover:text-white"
              >
                <Mail className="size-4" />
                Contact
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
          >
            <div className="relative min-h-[360px] overflow-hidden bg-[#bfe9f8] p-5 sm:min-h-[460px]">
              {displayProfile.profileImage ? (
                <img
                  src={displayProfile.profileImage}
                  alt={displayProfile.name}
                  className="h-full min-h-[320px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[320px] flex-col justify-between border border-black/15 bg-white/45 p-6">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">
                    Profile image
                  </span>
                  <div>
                    <p className="font-display text-7xl font-semibold leading-none text-black">
                      TB
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-black/60">
                      Placeholder. Replace this in Studio with a headshot or
                      visual identity image.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:col-span-2 lg:col-span-1 lg:grid-cols-3">
              {previewProof.map((proofPoint) => (
                <div key={proofPoint.id} className="bg-black p-5 text-white">
                  <p className="font-display text-3xl font-semibold">
                    {proofPoint.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-white/70">
                    {proofPoint.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

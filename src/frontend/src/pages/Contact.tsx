import { Button } from "@/components/ui/button";
import { profile, socialLinks } from "@/data/projects";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "motion/react";

const iconByLabel: Record<string, typeof Mail> = {
  Email: Mail,
  GitHub: Github,
  LinkedIn: Linkedin,
};

export function Contact() {
  return (
    <section
      id="contact"
      className="bg-muted/30 border-border border-y py-20 md:py-28"
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Contact
            </p>
            <h2 className="font-display text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Let us talk when the work needs clarity.
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              I am open to enablement, learning experience, AI workflow, and
              product-adjacent roles where practical systems matter more than
              polished buzzwords.
            </p>
            <Button asChild size="lg" className="w-fit">
              <a href={`mailto:${profile.email}`} data-ocid="contact.email">
                <Mail className="size-4" />
                Email Terry
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card border-border flex flex-col gap-4 rounded-xl border p-6 shadow-elevated md:p-8"
          >
            <p className="text-foreground text-sm font-semibold">
              Direct links
            </p>
            {socialLinks.map((link) => {
              const Icon = iconByLabel[link.label] ?? Mail;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={
                    link.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel={
                    link.href.startsWith("mailto:") ? undefined : "noreferrer"
                  }
                  data-ocid={`contact.social.${link.label.toLowerCase()}`}
                  className="border-border hover:border-primary/40 hover:text-primary flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-smooth"
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="size-4" />
                    {link.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {link.label === "Email" ? profile.email : "Open"}
                  </span>
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

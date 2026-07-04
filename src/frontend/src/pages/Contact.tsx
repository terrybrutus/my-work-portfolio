import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { socialLinks } from "@/data/projects";
import { Mail, Send } from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitting(true);
    // Simulated submit — this is a static showcase portfolio.
    window.setTimeout(() => {
      setSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Thanks for reaching out — I'll be in touch soon.");
    }, 600);
  };

  return (
    <section
      id="contact"
      className="bg-muted/30 border-border border-y py-20 md:py-28"
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
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
              Let's make something good.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Have a project in mind, or just want to say hello? Send a note and
              I'll get back to you within a couple of days.
            </p>

            <div className="flex flex-col gap-4 pt-2">
              <a
                href="mailto:hello@myworkportfolio.com"
                data-ocid="contact.email_link"
                className="text-foreground hover:text-primary inline-flex items-center gap-2 text-base font-medium transition-smooth"
              >
                <Mail className="size-5 text-primary" />
                hello@myworkportfolio.com
              </a>

              <div className="flex flex-col gap-2">
                <p className="text-foreground text-sm font-semibold">
                  Elsewhere
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      data-ocid={`contact.social_link.${link.label.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary border-border bg-card rounded-md border px-3 py-1.5 text-sm font-medium transition-smooth"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onSubmit={onSubmit}
            className="bg-card border-border flex flex-col gap-5 rounded-xl border p-6 shadow-elevated md:p-8"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" data-ocid="contact.name.label">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                data-ocid="contact.name.input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" data-ocid="contact.email.label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                data-ocid="contact.email.input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message" data-ocid="contact.message.label">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me a little about your project..."
                required
                rows={5}
                data-ocid="contact.message.textarea"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              data-ocid="contact.submit_button"
              className="w-full"
            >
              <Send className="size-4" />
              {submitting ? "Sending..." : "Send message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

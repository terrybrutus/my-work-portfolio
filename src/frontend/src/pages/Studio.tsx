import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { brainSources, profile } from "@/data/projects";
import {
  type ReviewerView,
  buildStrategyReport,
  createReviewerView,
  loadReviewerViews,
  saveReviewerView,
} from "@/lib/portfolioStrategy";
import {
  Clipboard,
  Database,
  FileSearch,
  Link2,
  Save,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

const sampleContext =
  "Enablement role focused on onboarding, LMS governance, sales readiness, AI workflow improvement, stakeholder assets, and measurable adoption.";

export function Studio() {
  const [context, setContext] = useState(sampleContext);
  const [label, setLabel] = useState("");
  const [views, setViews] = useState<ReviewerView[]>(() => loadReviewerViews());
  const report = useMemo(() => buildStrategyReport(context), [context]);

  const handleSave = () => {
    const view = createReviewerView(context, label);
    setViews(saveReviewerView(view));
    setLabel("");
  };

  const currentOrigin = window.location.origin;

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            Portfolio Studio
          </Badge>
          <h1 className="font-display text-foreground text-4xl font-bold tracking-tight md:text-5xl">
            Build a focused review path without changing the public front door.
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Paste a role, job description, or target context. The workspace
            recommends lanes, projects, proof points, gaps, and a next artifact
            to strengthen the portfolio.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <FileSearch className="size-4" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">
                  Role context
                </h2>
                <p className="text-muted-foreground text-sm">
                  Keep this practical. The output stays local for now.
                </p>
              </div>
            </div>
            <Textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              rows={11}
              className="resize-none"
              data-ocid="studio.context"
            />
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Optional private label"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-4 flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              data-ocid="studio.label"
            />
            <Button
              className="mt-4 w-full"
              onClick={handleSave}
              data-ocid="studio.save"
            >
              <Save className="size-4" />
              Generate review path
            </Button>
          </div>

          <div className="grid gap-6">
            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wider">
                    JD Strategy Report
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    {report.fitScore}% estimated role fit
                  </h2>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Wand2 className="size-5" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ReportList
                  title="Likely company problems"
                  items={report.likelyProblems}
                />
                <ReportList title="Evidence gaps" items={report.evidenceGaps} />
              </div>

              <div className="mt-6 rounded-xl bg-muted/50 p-5">
                <p className="text-foreground text-sm font-semibold">
                  Suggested artifact
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold">
                  {report.nextArtifact.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {report.nextArtifact.format} · {report.nextArtifact.buildTime}
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {report.nextArtifact.why}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
                <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                  Project matches
                </p>
                <div className="space-y-4">
                  {report.projectMatches.map((match) => (
                    <div key={match.project.id}>
                      <p className="text-foreground text-sm font-semibold">
                        {match.project.title}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {match.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
                <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                  Source pool
                </p>
                <div className="space-y-4">
                  {brainSources.map((source) => (
                    <div key={source.id} className="flex gap-3">
                      <Database className="mt-0.5 size-4 text-primary" />
                      <div>
                        <p className="text-foreground text-sm font-semibold">
                          {source.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {source.type} · {source.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                Saved review paths
              </p>
              {views.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No paths saved yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {views.map((view) => {
                    const link = `${currentOrigin}/work/${view.slug}`;
                    return (
                      <div
                        key={view.slug}
                        className="border-border flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-foreground text-sm font-semibold">
                            {view.label}
                          </p>
                          <p className="text-muted-foreground mt-1 break-all text-xs">
                            {link}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/work/${view.slug}`}>
                              <Link2 className="size-4" />
                              Open
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(link)}
                          >
                            <Clipboard className="size-4" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              Admin note: this first interval is local-first. It proves the
              experience before adding backend persistence or document parsing.
              Accepted evidence inputs next: images, GIF/video, PDF, DOCX, PPTX,
              TXT, MD, CSV, raw notes, transcripts, and repository links.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold">{title}</p>
      <ul className="text-muted-foreground mt-3 space-y-2 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

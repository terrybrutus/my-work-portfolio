import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type Lane,
  type Project,
  acceptedEvidenceTypes,
  brainSources,
  getProjectById,
  getProofPoints,
  laneProfiles,
  projects,
  proofPoints,
} from "@/data/projects";
import {
  type IntakeSource,
  type ReviewerView,
  type SavedTargetProfile,
  analyzeContext,
  buildStrategyReport,
  createIntakeSource,
  createReviewerView,
  createTargetProfile,
  deleteIntakeSource,
  deleteReviewerView,
  deleteTargetProfile,
  getMediaAlignment,
  getRecommendedSkills,
  loadIntakeSources,
  loadReviewerViews,
  loadTargetProfiles,
  saveIntakeSource,
  saveReviewerView,
  saveTargetProfile,
} from "@/lib/portfolioStrategy";
import { savePersistedReviewerView } from "@/lib/reviewerStore";
import {
  Clipboard,
  Database,
  Eye,
  FilePlus2,
  FileSearch,
  Link2,
  RotateCcw,
  Save,
  SearchCheck,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

const sampleContext =
  "Enablement role focused on onboarding, LMS governance, sales readiness, AI workflow improvement, stakeholder assets, and measurable adoption.";

export function Studio() {
  const [context, setContext] = useState(sampleContext);
  const [label, setLabel] = useState("");
  const [views, setViews] = useState<ReviewerView[]>(() => loadReviewerViews());
  const [saveStatus, setSaveStatus] = useState("");
  const [profiles, setProfiles] = useState<SavedTargetProfile[]>(() =>
    loadTargetProfiles(),
  );
  const [intakeSources, setIntakeSources] = useState<IntakeSource[]>(() =>
    loadIntakeSources(),
  );
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceType, setSourceType] = useState("Project note");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceStatus, setSourceStatus] = useState("");
  const analysis = useMemo(() => analyzeContext(context), [context]);
  const report = useMemo(() => buildStrategyReport(context), [context]);
  const recommendedSkills = useMemo(
    () => getRecommendedSkills(analysis.lanes, 6),
    [analysis.lanes],
  );
  const mediaAlignment = useMemo(
    () =>
      getMediaAlignment(
        report.projectMatches.map((match) => match.project),
        intakeSources,
      ),
    [report.projectMatches, intakeSources],
  );
  const relevantIntakeSources = useMemo(
    () =>
      intakeSources.filter((source) =>
        report.projectMatches.some((match) =>
          source.projectIds.includes(match.project.id),
        ),
      ),
    [intakeSources, report.projectMatches],
  );
  const evidenceRequests = useMemo(
    () =>
      mediaAlignment
        .flatMap((item) =>
          item.missing.slice(0, 2).map((need) => ({
            id: `${item.project.id}-${need}`,
            project: item.project,
            need,
            sourceType: inferSourceType(need),
          })),
        )
        .slice(0, 6),
    [mediaAlignment],
  );
  const coverageRows = useMemo(
    () => getCoverageRows(analysis.lanes, intakeSources),
    [analysis.lanes, intakeSources],
  );

  const handleSave = async () => {
    const view = createReviewerView(context, label);
    setViews(saveReviewerView(view));
    setLabel("");
    setSaveStatus("Saving review path...");
    const didPersist = await savePersistedReviewerView(view);
    setSaveStatus(
      didPersist
        ? "Review path saved for external viewing."
        : "Review path saved locally. Caffeine will persist it after backend config is available.",
    );
  };

  const handleSaveProfile = () => {
    const profile = createTargetProfile(context, label);
    setProfiles(saveTargetProfile(profile));
    setLabel("");
  };

  const handleReuseProfile = (profile: SavedTargetProfile) => {
    setContext(profile.context);
    setLabel(profile.name);
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(deleteTargetProfile(profileId));
  };

  const handleDeleteView = (slug: string) => {
    setViews(deleteReviewerView(slug));
    setSaveStatus("Review path removed from local Studio history.");
  };

  const handleAddSource = () => {
    const source = createIntakeSource({
      title: sourceTitle,
      sourceType,
      fileName: sourceFile?.name ?? "",
      fileType: sourceFile?.type ?? "",
      fileSize: sourceFile?.size ?? 0,
      sourceText,
      sourceUrl,
      context,
    });
    setIntakeSources(saveIntakeSource(source));
    setSourceTitle("");
    setSourceType("Project note");
    setSourceUrl("");
    setSourceText("");
    setSourceFile(null);
    setSourceStatus(
      `${source.title} added. Status: ${source.status}. Matched ${source.projectIds.length} project signals.`,
    );
  };

  const handleUseEvidenceRequest = (request: {
    project: Project;
    need: string;
    sourceType: string;
  }) => {
    setSourceTitle(`${request.project.title}: ${request.need}`);
    setSourceType(request.sourceType);
    setSourceText(
      `Needed for ${request.project.title}: ${request.need}. Add context, file notes, link details, or cleanup notes here.`,
    );
    setSourceStatus(
      "Source form prefilled. Add a file, link, or notes, then save it to the workspace.",
    );
  };

  const handleDeleteSource = (sourceId: string) => {
    setIntakeSources(deleteIntakeSource(sourceId));
    setSourceStatus("Source removed from local workspace.");
  };

  const handleSourceFileChange = async (file: File | null) => {
    setSourceFile(file);

    if (!file) {
      return;
    }

    if (!sourceTitle.trim()) {
      setSourceTitle(file.name.replace(/\.[^.]+$/, ""));
    }

    const inferredType = inferFileSourceType(file);
    setSourceType(inferredType);

    if (!isReadableTextFile(file)) {
      setSourceStatus(
        `${file.name} attached. Add notes or a link so the workspace can match it cleanly.`,
      );
      return;
    }

    try {
      const text = await readFileAsText(file);
      const trimmedText = text.trim();
      setSourceText((currentText) =>
        currentText.trim() ? currentText : trimmedText.slice(0, 12_000),
      );
      setSourceStatus(
        `${file.name} read into notes. Review the text, then save it to the workspace.`,
      );
    } catch {
      setSourceStatus(
        `${file.name} attached, but the text could not be read. Paste the important notes manually.`,
      );
    }
  };

  const currentOrigin = window.location.origin;
  const latestView = views[0];
  const latestLink = latestView
    ? `${currentOrigin}/work/${latestView.slug}`
    : "";
  const latestProjects = latestView
    ? latestView.projectIds
        .map((projectId) => getProjectById(projectId))
        .filter((project): project is Project => Boolean(project))
        .slice(0, 3)
    : [];
  const latestProof = latestView
    ? getProofPoints(latestView.proofIds).slice(0, 2)
    : [];

  const handleCopyLatestLink = async () => {
    if (!latestLink) return;
    await navigator.clipboard.writeText(latestLink);
    setSaveStatus("Review path copied.");
  };

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
          <div className="bg-card border-border h-fit rounded-xl border p-6 shadow-elevated">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <FileSearch className="size-4" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">
                  Role context
                </h2>
                <p className="text-muted-foreground text-sm">
                  Keep this practical. The public view stays clean.
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
            {saveStatus ? (
              <p className="text-muted-foreground mt-3 text-sm">{saveStatus}</p>
            ) : null}
            {latestView ? (
              <div className="border-border bg-muted/40 mt-4 rounded-lg border p-4">
                <p className="text-foreground text-sm font-semibold">
                  Latest review path
                </p>
                <p className="text-muted-foreground mt-1 break-all text-xs">
                  {latestLink}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {latestView.lanes.slice(0, 3).map((lane) => (
                    <Badge key={lane} variant="outline">
                      {lane}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 grid gap-2">
                  {latestProjects.map((project) => (
                    <p
                      key={project.id}
                      className="text-muted-foreground text-xs leading-relaxed"
                    >
                      {project.title}
                    </p>
                  ))}
                </div>
                {latestProof.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {latestProof.map((proofPoint) => (
                      <Badge key={proofPoint.id} variant="secondary">
                        {proofPoint.value} {proofPoint.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/work/${latestView.slug}`}>
                      <Link2 className="size-4" />
                      Open
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleCopyLatestLink()}
                  >
                    <Clipboard className="size-4" />
                    Copy
                  </Button>
                </div>
              </div>
            ) : null}
            <Button
              className="mt-3 w-full"
              variant="outline"
              onClick={handleSaveProfile}
              data-ocid="studio.save_profile"
            >
              <SearchCheck className="size-4" />
              Save target profile
            </Button>

            <div className="border-border mt-6 border-t pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <FilePlus2 className="size-4" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    Add source
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Drop in notes, links, resumes, screenshots, or artifacts.
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                <input
                  value={sourceTitle}
                  onChange={(event) => setSourceTitle(event.target.value)}
                  placeholder="Source title"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                <input
                  value={sourceType}
                  onChange={(event) => setSourceType(event.target.value)}
                  placeholder="Source type"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                <input
                  value={sourceUrl}
                  onChange={(event) => setSourceUrl(event.target.value)}
                  placeholder="Link, repo, or reference URL"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                <label className="border-border bg-muted/40 text-muted-foreground flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                  <span className="truncate">
                    {sourceFile?.name ?? "Choose file"}
                  </span>
                  <Upload className="size-4 shrink-0" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      void handleSourceFileChange(
                        event.target.files?.[0] ?? null,
                      )
                    }
                  />
                </label>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Text, Markdown, CSV, and JSON files can auto-fill notes.
                  Documents, decks, screenshots, and videos are tracked for
                  cleanup or media review.
                </p>
                <Textarea
                  value={sourceText}
                  onChange={(event) => setSourceText(event.target.value)}
                  rows={5}
                  placeholder="Paste raw notes, transcript snippets, resume bullets, or artifact context"
                  className="resize-none"
                />
                <Button
                  variant="outline"
                  onClick={handleAddSource}
                  disabled={
                    !sourceTitle.trim() &&
                    !sourceText.trim() &&
                    !sourceUrl.trim() &&
                    !sourceFile
                  }
                >
                  <Database className="size-4" />
                  Add to workspace
                </Button>
                {sourceStatus ? (
                  <p className="text-muted-foreground text-sm">
                    {sourceStatus}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                Recommended focus
              </p>
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">
                    Primary lane
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-semibold">
                    {analysis.primaryLane}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {analysis.reviewerTakeaway}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.lanes.map((lane) => (
                      <Badge key={lane} variant="outline">
                        {lane}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      Skill emphasis
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recommendedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      Proof to lead with
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {report.proofPoints.slice(0, 4).map((proofPoint) => (
                        <div
                          key={proofPoint.id}
                          className="border-border rounded-lg border p-3"
                        >
                          <p className="text-foreground text-sm font-semibold">
                            {proofPoint.value}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {proofPoint.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      Matched language
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {analysis.matchedTerms.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <div className="mb-5">
                <p className="text-primary text-sm font-semibold uppercase tracking-wider">
                  Coverage matrix
                </p>
                <h2 className="font-display mt-1 text-2xl font-semibold">
                  Evidence strength by lane
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Use this to spot where the current role context is already
                  supported and where another artifact would make the portfolio
                  sharper.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {coverageRows.map((row) => (
                  <div
                    key={row.lane}
                    className="border-border rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-foreground text-sm font-semibold">
                          {row.lane}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {row.reason}
                        </p>
                      </div>
                      <Badge
                        variant={
                          row.level === "Strong" ? "default" : "secondary"
                        }
                      >
                        {row.level}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-foreground font-semibold">
                          {row.projectCount}
                        </p>
                        <p>Projects</p>
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">
                          {row.proofCount}
                        </p>
                        <p>Proof</p>
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">
                          {row.sourceCount}
                        </p>
                        <p>Sources</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wider">
                    Review preview
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    {analysis.angle}
                  </h2>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Eye className="size-5" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This is the emphasis a hiring team would see if you create the
                path from the current role context.
              </p>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  {report.projectMatches.map((match, index) => (
                    <div key={match.project.id} className="flex gap-3">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-foreground text-sm font-semibold">
                          {match.project.title}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                          {match.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-muted/45 p-4">
                  <p className="text-foreground text-sm font-semibold">
                    Lead proof
                  </p>
                  <div className="mt-3 space-y-3">
                    {report.proofPoints.slice(0, 3).map((proofPoint) => (
                      <div key={proofPoint.id}>
                        <p className="text-foreground text-sm font-semibold">
                          {proofPoint.value}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {proofPoint.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommendedSkills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
                  {report.nextArtifact.format} / {report.nextArtifact.buildTime}
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
                <div className="mb-4">
                  <p className="text-primary text-sm font-semibold uppercase tracking-wider">
                    Source pool
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Review what each source supports before it becomes public
                    evidence. Keep, clean, or replace anything that does not
                    match the role context.
                  </p>
                </div>
                <div className="space-y-5">
                  {brainSources.map((source) => (
                    <div
                      key={source.id}
                      className="border-border rounded-lg border p-4"
                    >
                      <div className="flex gap-3">
                        <Database className="mt-0.5 size-4 text-primary" />
                        <div>
                          <p className="text-foreground text-sm font-semibold">
                            {source.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {source.type} / {source.status}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                        {source.note}
                      </p>
                      <SourceProjectBadges
                        projectIds={source.linkedProjectIds}
                      />
                    </div>
                  ))}
                  {intakeSources.length === 0 ? (
                    <div className="border-border rounded-lg border border-dashed p-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Added sources will appear here with matched projects,
                        file details, links, and cleanup status.
                      </p>
                    </div>
                  ) : (
                    intakeSources.map((source) => (
                      <div
                        key={source.id}
                        className="border-border rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <Database className="mt-0.5 size-4 text-primary" />
                            <div>
                              <p className="text-foreground text-sm font-semibold">
                                {source.title}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {source.sourceType} / {source.status}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Remove ${source.title}`}
                            onClick={() => handleDeleteSource(source.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <div className="text-muted-foreground mt-3 grid gap-1 text-xs">
                          {source.fileName ? (
                            <p>
                              File: {source.fileName}
                              {source.fileSize
                                ? ` (${formatFileSize(source.fileSize)})`
                                : ""}
                            </p>
                          ) : null}
                          {source.sourceUrl ? (
                            <p className="break-all">
                              Link: {source.sourceUrl}
                            </p>
                          ) : null}
                          {source.sourceText ? (
                            <p>
                              Notes: {source.sourceText.trim().length} chars
                            </p>
                          ) : null}
                          <p>Lanes: {source.lanes.join(", ")}</p>
                        </div>
                        <SourceProjectBadges projectIds={source.projectIds} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                Media and artifact alignment
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {mediaAlignment.map((item) => (
                  <div
                    key={item.project.id}
                    className="border-border rounded-lg border p-4"
                  >
                    <p className="text-foreground text-sm font-semibold">
                      {item.project.title}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {item.recommendation}
                    </p>
                    <p className="text-muted-foreground mt-3 text-xs">
                      Ready source signals: {item.readySources}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wider">
                    Evidence requests
                  </p>
                  <h2 className="font-display text-2xl font-semibold">
                    What to add next
                  </h2>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <FilePlus2 className="size-5" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                These are the highest-value missing artifacts for the current
                role context. Use them to choose screenshots, clips, notes, or
                cleanup work that actually supports the review path.
              </p>

              {evidenceRequests.length === 0 ? (
                <p className="text-muted-foreground mt-4 text-sm">
                  No open artifact requests for the current project set.
                </p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {evidenceRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border-border rounded-lg border p-4"
                    >
                      <p className="text-foreground text-sm font-semibold">
                        {request.project.title}
                      </p>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {request.need}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{request.sourceType}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUseEvidenceRequest(request)}
                        >
                          <FilePlus2 className="size-4" />
                          Prefill source
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
                <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                  Source matches
                </p>
                {relevantIntakeSources.length === 0 ? (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Add a resume, note, screenshot, repo, or artifact to see
                    what supports this role context.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {relevantIntakeSources.map((source) => (
                      <div key={source.id}>
                        <p className="text-foreground text-sm font-semibold">
                          {source.title}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {source.lanes.join(", ")} / {source.status}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {source.projectIds
                            .map((projectId) => getProjectById(projectId))
                            .filter((project): project is Project =>
                              Boolean(project),
                            )
                            .map((project) => (
                              <Badge key={project.id} variant="outline">
                                {project.title}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
                <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                  Accepted source types
                </p>
                <div className="space-y-3">
                  {acceptedEvidenceTypes.map((type) => (
                    <div key={type.extension}>
                      <p className="text-foreground text-sm font-semibold">
                        {type.extension}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {type.use}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border-border rounded-xl border p-6 shadow-elevated">
                <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
                  Saved target profiles
                </p>
                {profiles.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No profiles saved yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="border-border rounded-lg border p-4"
                      >
                        <p className="text-foreground text-sm font-semibold">
                          {profile.name}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {profile.lanes.join(", ")}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {profile.projectIds
                            .map((projectId) => getProjectById(projectId))
                            .filter((project): project is Project =>
                              Boolean(project),
                            )
                            .map((project) => (
                              <Badge key={project.id} variant="outline">
                                {project.title}
                              </Badge>
                            ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReuseProfile(profile)}
                          >
                            <RotateCcw className="size-4" />
                            Reuse
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteView(view.slug)}
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              Admin note: review paths save locally first and use backend
              persistence when Caffeine provides the deployed backend config.
              Source intake is local in this interval; OCR and richer document
              parsing can layer on top without changing the public portfolio.
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

function inferSourceType(need: string) {
  const normalized = need.toLowerCase();

  if (normalized.includes("gif") || normalized.includes("demo")) {
    return "Demo clip";
  }

  if (normalized.includes("screenshot") || normalized.includes("screen")) {
    return "Screenshot";
  }

  if (normalized.includes("checklist") || normalized.includes("sample")) {
    return "Artifact sample";
  }

  if (normalized.includes("diagram") || normalized.includes("map")) {
    return "Diagram";
  }

  return "Project artifact";
}

function SourceProjectBadges({ projectIds }: { projectIds: string[] }) {
  const matchedProjects = projectIds
    .map((projectId) => getProjectById(projectId))
    .filter((project): project is Project => Boolean(project));

  if (matchedProjects.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {matchedProjects.map((project) => (
        <Badge key={project.id} variant="outline">
          {project.title}
        </Badge>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

function getCoverageRows(activeLanes: Lane[], intakeSources: IntakeSource[]) {
  return laneProfiles.map(({ lane }) => {
    const projectCount = projects.filter((project) =>
      project.lanes.includes(lane),
    ).length;
    const proofCount = proofPoints.filter((proofPoint) =>
      proofPoint.lanes.includes(lane),
    ).length;
    const staticSourceCount = brainSources.filter((source) =>
      source.linkedProjectIds.some((projectId) =>
        getProjectById(projectId)?.lanes.includes(lane),
      ),
    ).length;
    const intakeSourceCount = intakeSources.filter((source) =>
      source.lanes.includes(lane),
    ).length;
    const sourceCount = staticSourceCount + intakeSourceCount;
    const score =
      projectCount * 2 +
      proofCount * 2 +
      sourceCount +
      (activeLanes.includes(lane) ? 3 : 0);
    const level = score >= 13 ? "Strong" : score >= 8 ? "Moderate" : "Thin";
    const reason = activeLanes.includes(lane)
      ? "Matched to this role context."
      : "Available for broader portfolio use.";

    return {
      lane,
      level,
      projectCount,
      proofCount,
      sourceCount,
      reason,
    };
  });
}

function isReadableTextFile(file: File) {
  const name = file.name.toLowerCase();
  return (
    file.type.startsWith("text/") ||
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".csv") ||
    name.endsWith(".json")
  );
}

function inferFileSourceType(file: File) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) {
    return "Screenshot";
  }

  if (type.startsWith("video/") || name.endsWith(".gif")) {
    return "Demo clip";
  }

  if (name.endsWith(".pdf") || name.endsWith(".docx")) {
    return "Document";
  }

  if (name.endsWith(".pptx")) {
    return "Deck";
  }

  if (isReadableTextFile(file)) {
    return "Source notes";
  }

  return "Project artifact";
}

function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

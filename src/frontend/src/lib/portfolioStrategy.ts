import {
  type Lane,
  type Project,
  type ProofPoint,
  getLaneProfile,
  getProofPoints,
  laneProfiles,
  projects,
  proofPoints,
  skills,
} from "@/data/projects";

export type RouteState = {
  section: "home" | "work" | "review" | "studio";
  slug: string | null;
};

export type Analysis = {
  primaryLane: Lane;
  lanes: Lane[];
  angle: string;
  reviewerTakeaway: string;
  matchedTerms: string[];
};

export type ReviewerView = {
  slug: string;
  label: string;
  context: string;
  headline: string;
  summary: string;
  lanes: Lane[];
  projectIds: string[];
  proofIds: string[];
  skillIds: string[];
  createdAt: string;
};

export type SavedTargetProfile = {
  id: string;
  name: string;
  context: string;
  lanes: Lane[];
  projectIds: string[];
  proofIds: string[];
  skillIds: string[];
  createdAt: string;
};

export type MediaAlignment = {
  project: Project;
  readySources: number;
  missing: string[];
  recommendation: string;
};

export type IntakeSource = {
  id: string;
  title: string;
  sourceType: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sourceText: string;
  sourceUrl: string;
  lanes: Lane[];
  projectIds: string[];
  status: "ready" | "needs cleanup" | "needs OCR" | "needs media";
  createdAt: string;
};

export type StrategyReport = {
  likelyProblems: string[];
  projectMatches: Array<{
    project: Project;
    reason: string;
  }>;
  proofPoints: ProofPoint[];
  evidenceGaps: string[];
  nextArtifact: {
    title: string;
    format: string;
    buildTime: string;
    why: string;
  };
  fitScore: number;
};

const reviewerViewsKey = "terry-work-reviewer-views";
const targetProfilesKey = "terry-work-target-profiles";
const intakeSourcesKey = "terry-work-intake-sources";
const laneCodes: Record<Lane, string> = {
  Enablement: "q7",
  "AI Operations": "m4",
  "Learning Experience": "r8",
  "Technical Product": "p6",
  "Sales Enablement": "c9",
  Compliance: "v3",
};
const codeLanes = Object.fromEntries(
  Object.entries(laneCodes).map(([lane, code]) => [code, lane as Lane]),
) as Record<string, Lane>;

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, " ");
}

export function getRouteState(): RouteState {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const reviewMatch = path.match(/^\/work\/([a-z0-9-]+)$/i);

  if (path === "/studio" || hash === "#studio" || hash === "#/studio") {
    return { section: "studio", slug: null };
  }

  if (reviewMatch?.[1]) {
    return { section: "review", slug: reviewMatch[1] };
  }

  if (path === "/work") {
    return { section: "work", slug: null };
  }

  return { section: "home", slug: null };
}

export function analyzeContext(context: string): Analysis {
  const normalized = normalizeText(context);
  const matches = laneProfiles
    .map((laneProfile) => {
      const terms = laneProfile.keywords.filter((keyword) =>
        normalized.includes(keyword),
      );
      return {
        lane: laneProfile.lane,
        terms,
        score: terms.length,
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);

  const ranked =
    matches.length > 0
      ? matches
      : [
          { lane: "Enablement" as Lane, terms: ["default"], score: 1 },
          {
            lane: "Learning Experience" as Lane,
            terms: ["default"],
            score: 1,
          },
          { lane: "AI Operations" as Lane, terms: ["default"], score: 1 },
        ];
  const lanes = ranked.slice(0, 3).map((match) => match.lane);
  const primaryLane = lanes[0];
  const profile = getLaneProfile(primaryLane);

  return {
    primaryLane,
    lanes,
    angle: profile.headline,
    reviewerTakeaway: profile.reviewerTakeaway,
    matchedTerms: ranked.flatMap((match) => match.terms).slice(0, 10),
  };
}

function scoreProject(project: Project, lanes: Lane[]) {
  const laneScore = project.lanes.reduce(
    (score, lane) => score + (lanes.includes(lane) ? 5 : 0),
    0,
  );
  const proofScore = getProofPoints(project.proofIds).reduce(
    (score, proofPoint) =>
      score + proofPoint.lanes.filter((lane) => lanes.includes(lane)).length,
    0,
  );
  return laneScore + proofScore;
}

export function getRecommendedProjects(lanes: Lane[], limit = 3) {
  return [...projects]
    .sort((a, b) => scoreProject(b, lanes) - scoreProject(a, lanes))
    .slice(0, limit);
}

export function getRecommendedProofPoints(lanes: Lane[], limit = 4) {
  return proofPoints
    .filter((proofPoint) =>
      proofPoint.lanes.some((lane) => lanes.includes(lane)),
    )
    .slice(0, limit);
}

export function getRecommendedSkills(lanes: Lane[], limit = 8) {
  const keywords = laneProfiles
    .filter((laneProfile) => lanes.includes(laneProfile.lane))
    .flatMap((laneProfile) => laneProfile.keywords);
  const ranked = skills.filter((skill) => {
    const normalized = normalizeText(skill);
    return keywords.some((keyword) => normalized.includes(keyword));
  });

  return (ranked.length > 0 ? ranked : skills).slice(0, limit);
}

export function buildStrategyReport(context: string): StrategyReport {
  const analysis = analyzeContext(context);
  const selectedProjects = getRecommendedProjects(analysis.lanes, 3);
  const selectedProofPoints = getRecommendedProofPoints(analysis.lanes, 4);
  const lowerContext = normalizeText(context);
  const likelyProblems = [
    lowerContext.includes("onboarding")
      ? "Ramp time or onboarding consistency is probably part of the business problem."
      : null,
    lowerContext.includes("dashboard") || lowerContext.includes("analytics")
      ? "Leaders likely need clearer visibility into readiness, adoption, or performance signals."
      : null,
    lowerContext.includes("ai")
      ? "The team may need practical AI workflow standards, not just experimentation."
      : null,
    getLaneProfile(analysis.primaryLane).reviewerTakeaway,
  ].filter((item): item is string => Boolean(item));
  const evidenceGaps = selectedProjects
    .flatMap((project) =>
      project.mediaNeeds.map((need) => `${project.title}: ${need}`),
    )
    .slice(0, 5);

  return {
    likelyProblems,
    projectMatches: selectedProjects.map((project) => ({
      project,
      reason: `Matches ${project.lanes
        .filter((lane) => analysis.lanes.includes(lane))
        .join(", ")} and connects to ${project.proofIds.length} proof signals.`,
    })),
    proofPoints: selectedProofPoints,
    evidenceGaps,
    nextArtifact: getNextArtifact(analysis.lanes, selectedProjects),
    fitScore: Math.min(
      96,
      62 + analysis.lanes.length * 5 + selectedProofPoints.length * 3,
    ),
  };
}

export function getMediaAlignment(
  selectedProjects: Project[],
  intakeSources: IntakeSource[] = [],
): MediaAlignment[] {
  return selectedProjects.map((project) => {
    const missing = project.mediaNeeds;
    const matchedSources = intakeSources.filter((source) =>
      source.projectIds.includes(project.id),
    );
    const readySources =
      (project.sourceNote.toLowerCase().includes("github") ? 1 : 0) +
      matchedSources.length;

    return {
      project,
      readySources,
      missing,
      recommendation:
        missing.length > 0
          ? `Add or clean: ${missing.slice(0, 2).join(", ")}.`
          : "Media looks ready for a reviewer card.",
    };
  });
}

function getNextArtifact(lanes: Lane[], selectedProjects: Project[]) {
  const firstProject = selectedProjects[0]?.title ?? "the strongest project";

  if (lanes.includes("Sales Enablement")) {
    return {
      title: "Sales readiness scorecard",
      format: "One-page dashboard prototype",
      buildTime: "4 hours",
      why: `Pair it with ${firstProject} to show ramp, coaching, and adoption signals clearly.`,
    };
  }

  if (lanes.includes("AI Operations")) {
    return {
      title: "AI workflow QA board",
      format: "Small interactive dashboard",
      buildTime: "6 hours",
      why: `Pair it with ${firstProject} to show speed, review gates, and human approval.`,
    };
  }

  if (lanes.includes("Learning Experience")) {
    return {
      title: "Scenario practice prototype",
      format: "Short interactive decision flow",
      buildTime: "6 hours",
      why: `Pair it with ${firstProject} to show how learning becomes workplace practice.`,
    };
  }

  return {
    title: "Role-fit evidence brief",
    format: "Case-study addendum",
    buildTime: "2 hours",
    why: `Use it to connect ${firstProject} to role problems, proof, and measurable outcomes.`,
  };
}

export function createReviewerView(
  context: string,
  label?: string,
): ReviewerView {
  const analysis = analyzeContext(context);
  const projectIds = getRecommendedProjects(analysis.lanes, 3).map(
    (project) => project.id,
  );
  const proofIds = getRecommendedProofPoints(analysis.lanes, 4).map(
    (proofPoint) => proofPoint.id,
  );
  const skillIds = getRecommendedSkills(analysis.lanes, 8);

  return {
    slug: createReviewSlug(analysis.lanes),
    label: label?.trim() || `${analysis.primaryLane} review path`,
    context,
    headline: getLaneProfile(analysis.primaryLane).headline,
    summary: getLaneProfile(analysis.primaryLane).reviewerTakeaway,
    lanes: analysis.lanes,
    projectIds,
    proofIds,
    skillIds,
    createdAt: new Date().toISOString(),
  };
}

export function createTargetProfile(
  context: string,
  name?: string,
): SavedTargetProfile {
  const analysis = analyzeContext(context);
  const projectIds = getRecommendedProjects(analysis.lanes, 3).map(
    (project) => project.id,
  );
  const proofIds = getRecommendedProofPoints(analysis.lanes, 4).map(
    (proofPoint) => proofPoint.id,
  );
  const skillIds = getRecommendedSkills(analysis.lanes, 8);

  return {
    id: createSlug(),
    name: name?.trim() || `${analysis.primaryLane} profile`,
    context,
    lanes: analysis.lanes,
    projectIds,
    proofIds,
    skillIds,
    createdAt: new Date().toISOString(),
  };
}

export function loadTargetProfiles() {
  try {
    const raw = window.localStorage.getItem(targetProfilesKey);
    if (!raw) return [];
    return JSON.parse(raw) as SavedTargetProfile[];
  } catch {
    return [];
  }
}

export function saveTargetProfile(profile: SavedTargetProfile) {
  const profiles = loadTargetProfiles();
  const nextProfiles = [
    profile,
    ...profiles.filter((item) => item.id !== profile.id),
  ];
  window.localStorage.setItem(targetProfilesKey, JSON.stringify(nextProfiles));
  return nextProfiles;
}

export function deleteTargetProfile(id: string) {
  const nextProfiles = loadTargetProfiles().filter((item) => item.id !== id);
  window.localStorage.setItem(targetProfilesKey, JSON.stringify(nextProfiles));
  return nextProfiles;
}

export function createIntakeSource(input: {
  title: string;
  sourceType: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sourceText: string;
  sourceUrl: string;
  context: string;
}) {
  const combinedText = [
    input.title,
    input.sourceType,
    input.fileName,
    input.sourceText,
    input.sourceUrl,
    input.context,
  ].join(" ");
  const analysis = analyzeContext(combinedText);
  const selectedProjects = getRecommendedProjects(analysis.lanes, 3);
  const lowerFileName = input.fileName.toLowerCase();
  const lowerFileType = input.fileType.toLowerCase();
  const isDocument =
    lowerFileName.endsWith(".pdf") ||
    lowerFileName.endsWith(".docx") ||
    lowerFileName.endsWith(".pptx");
  const isVisual =
    lowerFileType.startsWith("image/") ||
    lowerFileType.startsWith("video/") ||
    lowerFileName.endsWith(".gif") ||
    lowerFileName.endsWith(".mp4") ||
    lowerFileName.endsWith(".webm");
  const hasText = input.sourceText.trim().length > 40;

  const status: IntakeSource["status"] = isDocument
    ? "needs OCR"
    : isVisual
      ? "needs media"
      : hasText || input.sourceUrl.trim()
        ? "ready"
        : "needs cleanup";

  return {
    id: createSlug(),
    title:
      input.title.trim() ||
      input.fileName.trim() ||
      input.sourceUrl.trim() ||
      "Untitled source",
    sourceType: input.sourceType.trim() || "Source",
    fileName: input.fileName,
    fileType: input.fileType,
    fileSize: input.fileSize,
    sourceText: input.sourceText,
    sourceUrl: input.sourceUrl,
    lanes: analysis.lanes,
    projectIds: selectedProjects.map((project) => project.id),
    status,
    createdAt: new Date().toISOString(),
  } satisfies IntakeSource;
}

export function loadIntakeSources() {
  try {
    const raw = window.localStorage.getItem(intakeSourcesKey);
    if (!raw) return [];
    return JSON.parse(raw) as IntakeSource[];
  } catch {
    return [];
  }
}

export function saveIntakeSource(source: IntakeSource) {
  const sources = loadIntakeSources();
  const nextSources = [
    source,
    ...sources.filter((item) => item.id !== source.id),
  ];
  window.localStorage.setItem(intakeSourcesKey, JSON.stringify(nextSources));
  return nextSources;
}

export function deleteIntakeSource(id: string) {
  const nextSources = loadIntakeSources().filter((item) => item.id !== id);
  window.localStorage.setItem(intakeSourcesKey, JSON.stringify(nextSources));
  return nextSources;
}

export function loadReviewerViews() {
  try {
    const raw = window.localStorage.getItem(reviewerViewsKey);
    if (!raw) return [];
    return JSON.parse(raw) as ReviewerView[];
  } catch {
    return [];
  }
}

export function saveReviewerView(view: ReviewerView) {
  const views = loadReviewerViews();
  const nextViews = [view, ...views.filter((item) => item.slug !== view.slug)];
  window.localStorage.setItem(reviewerViewsKey, JSON.stringify(nextViews));
  return nextViews;
}

export function deleteReviewerView(slug: string) {
  const nextViews = loadReviewerViews().filter((item) => item.slug !== slug);
  window.localStorage.setItem(reviewerViewsKey, JSON.stringify(nextViews));
  return nextViews;
}

export function getReviewerView(slug: string | null) {
  if (!slug) return null;
  return (
    loadReviewerViews().find((view) => view.slug === slug) ??
    createReviewerViewFromSlug(slug)
  );
}

function createSlug() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let slug = "";
  for (let index = 0; index < 6; index += 1) {
    slug += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return slug;
}

function createReviewSlug(lanes: Lane[]) {
  const primary = laneCodes[lanes[0]] ?? laneCodes.Enablement;
  const secondary = laneCodes[lanes[1]] ?? "z5";
  return `${primary}${secondary}${createSlug().slice(0, 2)}`;
}

function createReviewerViewFromSlug(slug: string): ReviewerView | null {
  const primary = codeLanes[slug.slice(0, 2)];
  if (!primary) return null;

  const secondary = codeLanes[slug.slice(2, 4)];
  const lanes = [primary, secondary].filter((lane): lane is Lane =>
    Boolean(lane),
  );
  const projectIds = getRecommendedProjects(lanes, 3).map(
    (project) => project.id,
  );
  const proofIds = getRecommendedProofPoints(lanes, 4).map(
    (proofPoint) => proofPoint.id,
  );

  return {
    slug,
    label: "Focused review",
    context: "",
    headline: getLaneProfile(primary).headline,
    summary: getLaneProfile(primary).reviewerTakeaway,
    lanes,
    projectIds,
    proofIds,
    skillIds: getRecommendedSkills(lanes, 8),
    createdAt: "",
  };
}

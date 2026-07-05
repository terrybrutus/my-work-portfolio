import { type Project, profile, projects } from "@/data/projects";

export type ProfileOverrides = {
  name?: string;
  title?: string;
  headline?: string;
  shortSummary?: string;
  profileImage?: string;
};

export type ProjectOverride = {
  title?: string;
  category?: string;
  thumbnail?: string;
  image?: string;
  shortDescription?: string;
  fullDescription?: string;
  sourceNote?: string;
};

export type PortfolioCustomization = {
  profile: ProfileOverrides;
  projects: Record<string, ProjectOverride>;
};

const customizationKey = "terry-work-portfolio-customization";

export function loadPortfolioCustomization(): PortfolioCustomization {
  if (typeof window === "undefined") {
    return createEmptyCustomization();
  }

  try {
    const raw = window.localStorage.getItem(customizationKey);
    if (!raw) {
      return createEmptyCustomization();
    }
    const parsed = JSON.parse(raw) as Partial<PortfolioCustomization>;
    return {
      profile: parsed.profile ?? {},
      projects: parsed.projects ?? {},
    };
  } catch {
    return createEmptyCustomization();
  }
}

export function savePortfolioCustomization(
  customization: PortfolioCustomization,
) {
  window.localStorage.setItem(customizationKey, JSON.stringify(customization));
  window.dispatchEvent(new CustomEvent("portfolio-customization-updated"));
  return customization;
}

export function resetPortfolioCustomization() {
  window.localStorage.removeItem(customizationKey);
  window.dispatchEvent(new CustomEvent("portfolio-customization-updated"));
  return createEmptyCustomization();
}

export function getDisplayProfile(
  customization = loadPortfolioCustomization(),
) {
  return {
    ...profile,
    ...removeEmptyValues(customization.profile),
  };
}

export function getDisplayProjects(
  customization = loadPortfolioCustomization(),
): Project[] {
  return projects.map((project) => getDisplayProject(project, customization));
}

export function getDisplayProject(
  project: Project,
  customization = loadPortfolioCustomization(),
): Project {
  return {
    ...project,
    ...removeEmptyValues(customization.projects[project.id] ?? {}),
  };
}

export function updateProfileOverrides(
  customization: PortfolioCustomization,
  updates: ProfileOverrides,
): PortfolioCustomization {
  return {
    ...customization,
    profile: {
      ...customization.profile,
      ...updates,
    },
  };
}

export function updateProjectOverride(
  customization: PortfolioCustomization,
  projectId: string,
  updates: ProjectOverride,
): PortfolioCustomization {
  return {
    ...customization,
    projects: {
      ...customization.projects,
      [projectId]: {
        ...(customization.projects[projectId] ?? {}),
        ...updates,
      },
    },
  };
}

export async function readImageFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function createEmptyCustomization(): PortfolioCustomization {
  return {
    profile: {},
    projects: {},
  };
}

function removeEmptyValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (typeof entry === "string") {
        return entry.trim().length > 0;
      }
      return entry !== undefined && entry !== null;
    }),
  ) as Partial<T>;
}

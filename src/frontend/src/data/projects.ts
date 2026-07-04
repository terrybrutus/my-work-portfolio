export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "tide-analytics",
    title: "Tide Analytics Dashboard",
    category: "Product Design",
    year: "2024",
    thumbnail: "/assets/generated/project-1.dim_800x600.png",
    image: "/assets/generated/project-1.dim_800x600.png",
    shortDescription:
      "A real-time analytics platform that turns raw event streams into clear, actionable insight for product teams.",
    fullDescription:
      "Tide is a real-time analytics platform built for product teams who need to understand user behavior without waiting on data engineers. I led the end-to-end product design — from the information architecture of the event model to the visual language of the dashboard. The interface prioritizes legibility: large typographic hierarchy, calm color use, and a layout that scales from a single chart to a full grid of metrics. The result is a tool that feels less like a database and more like a conversation with your data.",
    tags: ["UX Research", "Data Viz", "Design System"],
  },
  {
    id: "harbor-mobile",
    title: "Harbor Mobile Banking",
    category: "Mobile App",
    year: "2023",
    thumbnail: "/assets/generated/project-2.dim_800x600.png",
    image: "/assets/generated/project-2.dim_800x600.png",
    shortDescription:
      "A calm, human-centered mobile banking experience designed to reduce financial anxiety for first-time savers.",
    fullDescription:
      "Harbor is a mobile banking app aimed at first-time savers who feel overwhelmed by traditional finance tools. The design language is deliberately quiet — soft motion, generous spacing, and a single confident accent color reserved for the most important actions. I designed the onboarding flow, the savings goal journey, and the recurring transfer experience. Usability testing showed a 40% reduction in task-completion time compared to the previous app, and qualitative feedback centered on the app feeling 'calm' and 'trustworthy'.",
    tags: ["Mobile", "Fintech", "Prototyping"],
  },
  {
    id: "atelier-identity",
    title: "Atelier Brand Identity",
    category: "Brand Design",
    year: "2023",
    thumbnail: "/assets/generated/project-3.dim_800x600.png",
    image: "/assets/generated/project-3.dim_800x600.png",
    shortDescription:
      "A complete visual identity for an independent architecture studio, from wordmark to stationery system.",
    fullDescription:
      "Atelier is an independent architecture studio working on residential and small civic projects. They needed an identity that felt grounded and precise without being cold. I developed the wordmark, a flexible grid system for layouts, and a stationery set that scales from business cards to project proposals. The palette is restrained — a deep ink, a warm paper, and a single accent — letting the studio's own architectural photography carry the visual weight. The system is documented in a brand book that the studio now uses internally.",
    tags: ["Identity", "Typography", "Print"],
  },
  {
    id: "meadow-illustration",
    title: "Meadow Editorial Illustration",
    category: "Illustration",
    year: "2022",
    thumbnail: "/assets/generated/project-4.dim_800x600.png",
    image: "/assets/generated/project-4.dim_800x600.png",
    shortDescription:
      "A series of editorial illustrations exploring the quiet rhythms of rural life across four seasons.",
    fullDescription:
      "Meadow is a personal illustration series commissioned by an independent culture magazine. Across four pieces — one for each season — I explored the quiet rhythms of rural life: the slow thaw of spring, the long light of summer, the harvest gold of autumn, and the still blue of winter. The illustrations use a limited palette of warm cream, peach, gold, and ocean blue, with flowing organic shapes that echo the landscape without depicting it literally. The series ran as the magazine's cover art for a full year.",
    tags: ["Illustration", "Editorial", "Color"],
  },
];

export const skills = [
  "Product Design",
  "Typography",
  "Design Systems",
  "Prototyping",
  "Illustration",
];

export const socialLinks = [
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export const navLinks = [
  { label: "Hero", id: "hero" },
  { label: "Projects", id: "projects" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

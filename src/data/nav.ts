export type SectionId =
  | "ai-slops"
  | "projects"
  | "photos"
  | "resources"
  | "links"
  | "tags"
  | "about"
  | "color-wheel";

export type SectionSignal = "gold" | "ember" | "blue" | "green";

export type Section = {
  id: SectionId;
  label: string;
  href: string;
  code: string;
  signal: SectionSignal;
};

export const sections: Section[] = [
  {
    id: "ai-slops",
    label: "ai slops",
    href: "/ai-slops/",
    code: "SLO_01",
    signal: "gold",
  },
  {
    id: "projects",
    label: "projects",
    href: "/projects/",
    code: "MAP_02",
    signal: "blue",
  },
  {
    id: "photos",
    label: "photos",
    href: "/photos/",
    code: "OPT_03",
    signal: "gold",
  },
  {
    id: "resources",
    label: "resources",
    href: "/resources/",
    code: "DB_04",
    signal: "green",
  },
  {
    id: "links",
    label: "links",
    href: "/links/",
    code: "NET_05",
    signal: "blue",
  },
  {
    id: "tags",
    label: "tags",
    href: "/tags/",
    code: "IDX_06",
    signal: "gold",
  },
  {
    id: "about",
    label: "about",
    href: "/about/",
    code: "ID_07",
    signal: "ember",
  },
];

export const extraSections: Section[] = [
  {
    id: "color-wheel",
    label: "color wheel",
    href: "/color-wheel/",
    code: "LAB_08",
    signal: "gold",
  },
];

export const sectionForPath = (pathname: string): Section | undefined => {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  return [...sections, ...extraSections]
    .filter((section) => section.href !== "/")
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (section) =>
        normalized === section.href.replace(/\/+$/, "") ||
        normalized.startsWith(section.href),
    );
};

export type ProjectStatus = "active" | "wip" | "archived";
export type ProjectGroup = "infra" | "desktop" | "tool";

export type Project = {
  id: string;
  title: string;
  repo: string;
  href: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  year: number;
  status: ProjectStatus;
  group: ProjectGroup;
  tags: string[];
  preview?: string;
  poster?: string;
  demo?: string;
};

export type ProjectLink = {
  id?: string;
  source: string;
  target: string;
  label?: string;
  kind?: "uses" | "related" | "inspired";
  sourceHandle?: string;
  targetHandle?: string;
  mobileHidden?: boolean;
};

export const projects: Project[] = [
  {
    id: "home-sever",
    title: "home-sever",
    repo: "js-bruno/home-sever",
    href: "https://github.com/js-bruno/home-sever",
    description:
      "home lab com NixOS + home-manager, módulos reutilizáveis e deploy remoto.",
    language: "Nix",
    languageColor: "#7e7eff",
    stars: 0,
    forks: 0,
    year: 2026,
    status: "active",
    group: "infra",
    tags: ["nixos", "home-manager", "homelab"],
    preview: "/assets/projects/home-sever.gif",
    poster: "/assets/projects/home-sever.webp",
  },
  {
    id: "cold-breeze",
    title: "Cold-Breeze",
    repo: "js-bruno/Cold-Breeze",
    href: "https://github.com/js-bruno/Cold-Breeze",
    description: "dotfiles do desktop Linux: i3, kitty, zsh, nvim e stow.",
    language: "Shell",
    languageColor: "#89e051",
    stars: 0,
    forks: 0,
    year: 2024,
    status: "active",
    group: "desktop",
    tags: ["dotfiles", "i3", "linux", "stow"],
    preview: "/assets/projects/cold-breeze.gif",
    poster: "/assets/projects/cold-breeze.webp",
  },
  {
    id: "spotify-in-github",
    title: "spotify-in-github",
    repo: "js-bruno/spotify-in-github",
    href: "https://github.com/js-bruno/spotify-in-github",
    description:
      "atualiza a bio do GitHub com a música que você está ouvindo no Spotify.",
    language: "Go",
    languageColor: "#00add8",
    stars: 0,
    forks: 0,
    year: 2026,
    status: "active",
    group: "tool",
    tags: ["go", "spotify", "github-api", "automation"],
    preview: "/assets/projects/spotify-in-github.gif",
    poster: "/assets/projects/spotify-in-github.webp",
  },
];

export const links: ProjectLink[] = [
  {
    source: "cold-breeze",
    target: "home-sever",
    label: "reencarnou em nix",
    kind: "inspired",
    sourceHandle: "source-right",
    targetHandle: "target-left",
  },
  {
    source: "home-sever",
    target: "spotify-in-github",
    label: "roda no server",
    kind: "uses",
    sourceHandle: "source-right",
    targetHandle: "target-left",
  },
  {
    source: "cold-breeze",
    target: "spotify-in-github",
    label: "status no perfil",
    kind: "related",
    sourceHandle: "source-top",
    targetHandle: "target-top",
    mobileHidden: true,
  },
];

export type TickerTone = "gold" | "green" | "ember" | "blue" | "muted";

export type TickerItem = {
  label: string;
  tone?: TickerTone;
};

export const tickerItems: TickerItem[] = [
  { label: "local archive // sem trackers", tone: "muted" },
  { label: "novo sistema // em construção", tone: "gold" },
  { label: "ai slops // lousa aberta", tone: "green" },
  { label: "build 2026.11", tone: "muted" },
];

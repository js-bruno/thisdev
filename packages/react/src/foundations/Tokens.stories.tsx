import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const swatches = [
  "--aui-accent",
  "--aui-accent-2",
  "--aui-ok",
  "--aui-warn",
  "--aui-danger",
  "--aui-info",
  "--aui-bg",
  "--aui-bg-deep",
  "--aui-surface",
  "--aui-surface-2",
  "--aui-ink",
  "--aui-muted",
];

const radii = [
  "--aui-radius-sm",
  "--aui-radius",
  "--aui-radius-lg",
  "--aui-radius-xl",
  "--aui-radius-pill",
];

const shadows = ["--aui-shadow-sm", "--aui-shadow", "--aui-shadow-lg"];

const swatchStyle = (token: string) =>
  ({
    height: "5rem",
    borderRadius: "var(--aui-radius)",
    border: "1px solid var(--aui-border)",
    background: `var(${token})`,
    boxShadow: "var(--aui-edge)",
  }) as const;

export const Colors: Story = {
  render: () => (
    <div className="aui-grid" style={{ "--aui-grid-min": "9rem" } as never}>
      {swatches.map((token) => (
        <div key={token}>
          <div style={swatchStyle(token)} />
          <code style={{ display: "block", marginTop: "0.5rem" }}>{token}</code>
        </div>
      ))}
    </div>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="aui-cluster">
      {radii.map((token) => (
        <div key={token} style={{ textAlign: "center" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              background: "var(--aui-accent)",
              borderRadius: `var(${token})`,
              boxShadow: "var(--aui-shadow-sm)",
            }}
          />
          <code style={{ display: "block", marginTop: "0.5rem" }}>
            {token}
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="aui-cluster">
      {shadows.map((token) => (
        <div key={token} style={{ textAlign: "center" }}>
          <div
            style={{
              width: "7rem",
              height: "5rem",
              background: "var(--aui-surface-solid)",
              borderRadius: "var(--aui-radius-lg)",
              boxShadow: `var(${token})`,
            }}
          />
          <code style={{ display: "block", marginTop: "0.5rem" }}>
            {token}
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Motion: Story = {
  render: () => (
    <div className="aui-cluster">
      {[
        ["--aui-ease-out", "out"],
        ["--aui-ease-bounce", "bounce"],
        ["--aui-ease-spring", "spring"],
      ].map(([token, label]) => (
        <div key={token} style={{ textAlign: "center" }}>
          <div
            className="aui-card"
            style={{
              width: "7rem",
              height: "5rem",
              display: "grid",
              placeItems: "center",
            }}
          >
            {label}
          </div>
          <code style={{ display: "block", marginTop: "0.5rem" }}>
            {token}
          </code>
        </div>
      ))}
    </div>
  ),
};

import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "Ametrine",
    subtitle: "Acrylic surface",
    children:
      "Superfícies de acrílico levemente fosco, cantos arredondados e um fio de luz na borda.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: <Badge tone="accent">new</Badge>,
    children: (
      <div className="aui-stack">
        <p style={{ margin: 0 }}>
          Um card com ações e conteúdo composto para demonstrar o layout.
        </p>
        <div className="aui-cluster">
          <Button size="sm" variant="primary">
            Confirmar
          </Button>
          <Button size="sm" variant="ghost">
            Cancelar
          </Button>
        </div>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: { interactive: true },
};

export const Grid: Story = {
  render: () => (
    <div
      className="aui-grid"
      style={{ "--aui-grid-min": "15rem" } as CSSProperties}
    >
      {["One", "Two", "Three"].map((name) => (
        <Card key={name} title={name} interactive>
          Card interativo para grid responsivo.
        </Card>
      ))}
    </div>
  ),
};

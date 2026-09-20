import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge/Badge";
import { Table } from "./Table";

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    head: ["Token", "Valor", "Tipo"],
    rows: [
      ["--aui-accent", "oklch(0.58 0.18 295)", <Badge tone="accent">cor</Badge>],
      ["--aui-radius", "10px", <Badge>raio</Badge>],
      ["--aui-ease-bounce", "cubic-bezier(…)", <Badge tone="warn">motion</Badge>],
    ],
    caption: "Tokens principais do design system.",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Striped: Story = { args: { striped: true } };

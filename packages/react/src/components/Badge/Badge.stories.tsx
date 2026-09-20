import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge", tone: "default" },
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "accent", "accent2", "ok", "warn", "danger"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="aui-cluster">
      <Badge>Default</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="accent2">Citrine</Badge>
      <Badge tone="ok">Ok</Badge>
      <Badge tone="warn">Warn</Badge>
      <Badge tone="danger">Danger</Badge>
    </div>
  ),
};

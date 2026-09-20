import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";

const meta = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { value: 60, label: "Progresso" },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Steps: Story = {
  render: () => (
    <div className="aui-stack" style={{ maxWidth: "24rem" }}>
      <Progress value={15} label="15%" />
      <Progress value={50} label="50%" />
      <Progress value={90} label="90%" />
    </div>
  ),
};

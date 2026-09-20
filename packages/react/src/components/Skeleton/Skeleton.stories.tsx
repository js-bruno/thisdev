import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: { width: "16rem", height: "1rem" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="aui-card" style={{ width: "18rem" }}>
      <div className="aui-cluster" style={{ marginBottom: "1rem" }}>
        <Skeleton circle width="2.5rem" height="2.5rem" />
        <div className="aui-stack" style={{ gap: "0.4rem", flex: 1 }}>
          <Skeleton height="0.7rem" width="60%" />
          <Skeleton height="0.7rem" width="40%" />
        </div>
      </div>
      <div className="aui-stack" style={{ gap: "0.5rem" }}>
        <Skeleton height="0.8rem" />
        <Skeleton height="0.8rem" />
        <Skeleton height="0.8rem" width="70%" />
      </div>
    </div>
  ),
};

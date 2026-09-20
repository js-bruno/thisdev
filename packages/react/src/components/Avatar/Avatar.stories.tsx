import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { name: "Ada Lovelace" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="aui-cluster">
      <Avatar size="sm" name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar size="lg" name="Alan Turing" />
      <Avatar square name="Z" />
    </div>
  ),
};

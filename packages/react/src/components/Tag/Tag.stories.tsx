import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: { children: "#design-system" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <div className="aui-cluster">
      <Tag>#css</Tag>
      <Tag>#react</Tag>
      <Tag>#astro</Tag>
      <Tag>#ametrine</Tag>
    </div>
  ),
};

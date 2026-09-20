import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton";

const Star = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="currentColor"
      d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z"
    />
  </svg>
);

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    "aria-label": "Favorite",
    children: <Star />,
    variant: "ghost",
    size: "md",
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="aui-cluster">
      <IconButton aria-label="ghost" variant="ghost">
        <Star />
      </IconButton>
      <IconButton aria-label="outline" variant="outline">
        <Star />
      </IconButton>
      <IconButton aria-label="primary" variant="primary">
        <Star />
      </IconButton>
      <IconButton aria-label="accent" variant="accent">
        <Star />
      </IconButton>
    </div>
  ),
};

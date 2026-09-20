import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  args: { children: "Um link de exemplo", href: "#" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
  render: () => (
    <p>
      Texto com <Link subtle>link sutil</Link> e um{" "}
      <Link href="#">link comum</Link>.
    </p>
  ),
};

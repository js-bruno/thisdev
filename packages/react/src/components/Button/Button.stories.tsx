import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Botão acrílico com edge highlight e animação bouncy. Variantes e tamanhos via props.",
      },
    },
  },
  args: { children: "Button", variant: "default", size: "md" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "accent", "outline", "ghost", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="aui-cluster">
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="aui-cluster">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="aui-cluster">
      <Button variant="primary">Enabled</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button round variant="primary">
        Round
      </Button>
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div className="aui-stack" style={{ maxWidth: "20rem" }}>
      <Button block>Full width</Button>
      <Button block variant="primary">
        Full width primary
      </Button>
    </div>
  ),
};

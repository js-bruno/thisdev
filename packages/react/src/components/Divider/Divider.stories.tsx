import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: "24rem" }}>
      <p>Conteúdo acima</p>
      <Divider />
      <p>Conteúdo abaixo</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="aui-cluster" style={{ height: "4rem" }}>
      <span>Esquerda</span>
      <Divider vertical />
      <span>Direita</span>
    </div>
  ),
};

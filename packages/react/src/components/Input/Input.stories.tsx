import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "Digite algo…" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="aui-stack" style={{ maxWidth: "22rem" }}>
      <Input placeholder="Normal" />
      <Input placeholder="Desabilitado" disabled />
      <Input placeholder="Com valor" defaultValue="Ametrine" />
    </div>
  ),
};

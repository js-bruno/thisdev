import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { Input } from "../Input/Input";

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  args: {
    label: "E-mail",
    help: "Nunca compartilharemos seu e-mail.",
    htmlFor: "email",
    children: <Input id="email" type="email" placeholder="voce@exemplo.com" />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  args: { error: "Informe um e-mail válido." },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Navbar } from "./Navbar";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  args: {
    brand: "Ametrine UI",
    links: [
      { label: "Docs", href: "#", current: true },
      { label: "Componentes", href: "#" },
      { label: "Tokens", href: "#" },
    ],
    actions: <Avatar size="sm" name="Z" />,
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: { actions: <Button size="sm" variant="primary">Entrar</Button> },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    items: [
      { value: "overview", label: "Visão geral", content: "Conteúdo da visão geral." },
      { value: "tokens", label: "Tokens", content: "Tokens de cor, sombra e movimento." },
      { value: "api", label: "API", content: "Props e composição." },
      { value: "disabled", label: "Desativada", content: "—", disabled: true },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

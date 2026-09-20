import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: {
    items: [
      { title: "O que é o Ametrine UI?", content: "Um design system acrílico inspirado no tema Ametrine.", open: true },
      { title: "Tem JavaScript essencial?", content: "Não. O CSS funciona sozinho; o React é opcional." },
      { title: "Suporta dark mode?", content: "Sim, via data-theme=dark ou preferência do sistema." },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = { args: { allowMultiple: true } };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "./Callout";

const meta = {
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  args: {
    title: "Nota",
    children: "Conteúdo informativo com fundo tingido e ícone.",
    tone: "info",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "ok", "warn", "danger", "accent"],
    },
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="aui-stack" style={{ maxWidth: "34rem" }}>
      <Callout tone="info" title="Info">
        Texto informativo neutro.
      </Callout>
      <Callout tone="ok" title="Sucesso">
        Tudo certo por aqui.
      </Callout>
      <Callout tone="warn" title="Atenção">
        Confira os detalhes antes de continuar.
      </Callout>
      <Callout tone="danger" title="Erro">
        Algo deu errado.
      </Callout>
      <Callout tone="accent" title="Destaque">
        Um callout com a cor de destaque.
      </Callout>
    </div>
  ),
};

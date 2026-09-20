import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Dialog } from "./Dialog";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  args: { open: false, title: "Confirmar ação" },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Abrir dialog
        </Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirmar
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Este diálogo usa o elemento nativo <code>&lt;dialog&gt;</code> com
            backdrop desfocado e animação de entrada.
          </p>
        </Dialog>
      </>
    );
  },
};

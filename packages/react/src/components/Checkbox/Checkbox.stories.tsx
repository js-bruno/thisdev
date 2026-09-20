import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { Radio } from "../Radio/Radio";

const meta = {
  title: "Components/Checkbox & Radio",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Aceito os termos", defaultChecked: false },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: () => (
    <div className="aui-stack">
      <Checkbox label="CSS" defaultChecked />
      <Checkbox label="React" />
      <Checkbox label="Astro" defaultChecked />
    </div>
  ),
};

export const Radios: Story = {
  render: (args) => (
    <div className="aui-stack">
      <Radio name="tone" label="Amethyst" defaultChecked />
      <Radio name="tone" label="Citrine" />
      <Radio name="tone" {...args} label="Ametrine" />
    </div>
  ),
};

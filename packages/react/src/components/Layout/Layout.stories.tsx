import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../Card/Card";
import { Cluster, Grid, Stack } from "./Layout";

const meta = {
  title: "Layout/Stack, Cluster & Grid",
  component: Stack,
  tags: ["autodocs"],
  args: { gap: "var(--aui-space-4)" },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StackStory: Story = {
  name: "Stack",
  render: (args) => (
    <Stack {...args} style={{ maxWidth: "24rem" }}>
      <Card title="Um">Item</Card>
      <Card title="Dois">Item</Card>
      <Card title="Três">Item</Card>
    </Stack>
  ),
};

export const ClusterStory: Story = {
  name: "Cluster",
  render: () => (
    <Cluster gap="var(--aui-space-3)">
      <span className="aui-badge">alpha</span>
      <span className="aui-badge">beta</span>
      <span className="aui-badge">gamma</span>
    </Cluster>
  ),
};

export const GridStory: Story = {
  name: "Grid",
  render: () => (
    <Grid min="14rem" gap="var(--aui-space-4)">
      {["um", "dois", "três", "quatro"].map((n) => (
        <Card key={n} title={n}>
          Card responsivo.
        </Card>
      ))}
    </Grid>
  ),
};

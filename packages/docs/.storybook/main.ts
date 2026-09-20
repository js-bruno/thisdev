import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../../react/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.server = config.server ?? {};
    config.server.fs = {
      allow: [resolve(here, "../../..")],
    };
    return config;
  },
};

export default config;

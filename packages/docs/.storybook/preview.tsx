import type { Preview } from "@storybook/react-vite";
import "@thisdev/ui/styles.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          "Components",
          "Layout",
          "Feedback",
          "Overlays",
          "*",
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Tema do Ametrine UI",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
  decorators: [
    (Story, context) => (
      <div
        className="aui-root"
        data-theme={context.globals.theme as string}
        style={{
          minHeight: "100vh",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;

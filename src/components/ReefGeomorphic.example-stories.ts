import { defineGpStories } from "@seasketch/geoprocessing/storybook";

// Register to generate stories for each example sketch and its gp function smoke test output
export const storyConfig = defineGpStories({
  componentName: "ReefGeomorphic",
  /** Relative path to React component from this config file */
  componentPath: "./ReefGeomorphic.tsx",
  title: "Project/Components/ReefGeomorphic",
});

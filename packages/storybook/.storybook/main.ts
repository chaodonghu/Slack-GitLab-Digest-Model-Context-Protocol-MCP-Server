import type { StorybookConfig } from "@storybook/nextjs";

import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}

/** Storybook will only look for stories in this packages/* directories.
 * Add more packages here if you want to include their stories in Storybook.
 */
const packagesWithStories: string[] = [
  "service",
];
const stories = packagesWithStories.map(
  (p) => `../../${p}/src/**/*.stories.@(js|jsx|mjs|ts|tsx)`,
);

const config: StorybookConfig = {
  stories,
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_ZAPIER_ORIGIN: "https://zapier-staging.com",
  }),
};
export default config;

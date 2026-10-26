/**
 * @file Storybook configuration.
 *
 * One React + Vite Storybook documents both packages: React components render
 * natively, and Lit web components render as custom elements in JSX. Stories
 * live next to their components in packages/*\/src, plus foundation pages in
 * ./stories.
 */

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: [
    '../stories/**/*.@(mdx|stories.@(js|jsx))',
    '../packages/*/src/**/*.@(mdx|stories.@(js|jsx))',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite');
    const { default: tailwindcss } = await import('@tailwindcss/vite');

    // Compiles @apply in the shared styles source so edits hot-reload.
    return mergeConfig(viteConfig, { plugins: [tailwindcss()] });
  },
};

export default config;

/**
 * @file Project Storybook overrides, loaded by Emulsify Core's shared config.
 *
 * Emulsify discovers Twig stories in src/components. This adds the React and
 * web component stories from the npm workspace packages, so all three
 * implementations appear side by side in one Storybook.
 *
 * Emulsify also injects its manager stylesheet (sidebar blues, brand chrome).
 * Replacing managerHead drops that stylesheet. The theme itself lives in
 * ./theme.js.
 */

import fs from 'node:fs';
import path from 'node:path';

const projectDir = path.resolve(import.meta.dirname, '../../..');
const managerHeadPath = path.join(
  projectDir,
  'config/emulsify-core/storybook/manager-head.html',
);

/**
 * Optional project markup for the Storybook manager document head.
 *
 * @returns {string} HTML fragment, or an empty string when the file is absent.
 */
function projectManagerHead() {
  if (!fs.existsSync(managerHeadPath)) {
    return '';
  }

  return fs.readFileSync(managerHeadPath, 'utf8');
}

export function extendConfig(config) {
  return {
    ...config,
    stories: [
      ...config.stories,
      path.join(projectDir, 'packages/*/src/**/*.stories.@(js|jsx)'),
    ],
    /**
     * Keep Storybook's own manager head and any project fragment.
     * This replaces Emulsify's managerHead, which inlines manager-head.css.
     *
     * @param {string} head Existing manager head markup.
     * @returns {string} Manager head markup without Emulsify styles.
     */
    managerHead: (head) => `${head ?? ''}\n${projectManagerHead()}`,
  };
}

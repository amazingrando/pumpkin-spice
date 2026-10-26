/**
 * @file Entry point for @pumpkin-spice/web-components.
 *
 * Component source lives in the Emulsify system (src/components) so Drupal
 * and npm consumers run the same code. Importing this module registers every
 * <psds-*> element and bundles its CSS into dist/style.css.
 */

import '@pumpkin-spice/tokens/css';
import '../../../src/components/disclosure/disclosure.scss';

export { PsdsDisclosure } from '../../../src/components/disclosure/disclosure.js';

import { renderTwig } from '@emulsify/core/storybook';
import disclosureTwig from './disclosure.twig';
import './disclosure.js';

const context = (args) => ({
  summary: args.summary,
  content: args.content,
  open: args.open,
});

export default {
  title: 'Components/Disclosure/Twig (Drupal)',
  render: renderTwig(disclosureTwig, { context }),
  args: {
    summary: 'What is in pumpkin spice?',
    content: 'Cinnamon, ginger, nutmeg, and cloves, sometimes with allspice.',
    open: false,
  },
};

export const Closed = {};

export const Open = { args: { open: true } };

import { fn } from 'storybook/test';
import { Disclosure } from './Disclosure.jsx';

export default {
  title: 'Components/Disclosure/React',
  component: Disclosure,
  args: {
    summary: 'What is in pumpkin spice?',
    children: 'Cinnamon, ginger, nutmeg, and cloves, sometimes with allspice.',
    open: false,
    onToggle: fn(),
  },
};

export const Closed = {};

export const Open = { args: { open: true } };

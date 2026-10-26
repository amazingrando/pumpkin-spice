import {
  defineCustomElement,
  renderWebComponent,
} from '@emulsify/core/storybook';
import { fn } from 'storybook/test';
import { PsdsDisclosure } from './index.js';

defineCustomElement('psds-disclosure', PsdsDisclosure);

export default {
  title: 'Components/Disclosure/Web Component',
  render: renderWebComponent('psds-disclosure', {
    argsAs: 'properties',
    className: 'psds-disclosure',
    events: { 'psds-toggle': 'onToggle' },
  }),
  argTypes: {
    children: { control: false },
  },
  args: {
    open: false,
    children: (
      <>
        <button type="button" className="psds-disclosure__trigger">
          What is in pumpkin spice?
        </button>
        <div className="psds-disclosure__panel">
          Cinnamon, ginger, nutmeg, and cloves, sometimes with allspice.
        </div>
      </>
    ),
    onToggle: fn(),
  },
};

export const Default = {};

export const Open = { args: { open: true } };

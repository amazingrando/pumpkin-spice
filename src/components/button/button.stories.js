import { renderTwig } from '@emulsify/core/storybook';
import buttonTwig from './button.twig';

const context = (args) => ({
  text: args.text,
  url: args.url,
  variant: args.variant,
  button_type: args.button_type,
});

export default {
  title: 'Components/Button/Twig (Drupal)',
  render: renderTwig(buttonTwig, { context }),
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
  },
  args: {
    text: 'Add to cart',
    variant: 'primary',
  },
};

export const Primary = {};

export const Secondary = { args: { variant: 'secondary' } };

export const Link = { args: { text: 'Read the recipe', url: '#' } };

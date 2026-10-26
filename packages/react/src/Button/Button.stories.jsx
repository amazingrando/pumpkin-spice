import { fn } from 'storybook/test';
import { Button } from './Button.jsx';

export default {
  title: 'Components/Button/React',
  component: Button,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
  },
  args: {
    text: 'Add to cart',
    variant: 'primary',
    onClick: fn(),
  },
};

export const Primary = {};

export const Secondary = { args: { variant: 'secondary' } };

export const Link = { args: { text: 'Read the recipe', url: '#' } };

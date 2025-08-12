import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'CanonCore/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['fullscreen', 'inline', 'small'],
    },
    message: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Fullscreen: Story = {
  args: {
    variant: 'fullscreen',
    message: 'Loading...',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
    message: 'Loading content...',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
    message: 'Loading...',
  },
};

export const CustomMessage: Story = {
  args: {
    variant: 'inline',
    message: 'Fetching your universes...',
  },
};

export const NoMessage: Story = {
  args: {
    variant: 'inline',
    message: '',
  },
};
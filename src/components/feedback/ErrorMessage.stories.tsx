import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorMessage } from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'CanonCore/Feedback/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible error message component with WCAG AA compliant contrast (5.91:1 ratio). Uses `text-error-on-light` styling for optimal readability on light red backgrounds.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['form', 'page', 'inline'],
    },
    message: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {
  args: {
    variant: 'form',
    message: 'Please fill in all required fields.',
  },
};

export const Page: Story = {
  args: {
    variant: 'page',
    message: 'An error occurred while loading the page.',
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
    message: 'This field is required.',
  },
};

export const ValidationError: Story = {
  args: {
    variant: 'form',
    message: 'Name must be at least 3 characters long.',
  },
};

export const ServerError: Story = {
  args: {
    variant: 'form',
    message: 'Unable to save changes. Please try again.',
  },
};

export const NetworkError: Story = {
  args: {
    variant: 'page',
    message: 'Network error. Please check your connection and try again.',
  },
};

export const EmptyMessage: Story = {
  args: {
    variant: 'form',
    message: '',
  },
};
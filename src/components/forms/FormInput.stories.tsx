import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormInput } from './FormInput';

const meta: Meta<typeof FormInput> = {
  title: 'CanonCore/Forms/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'url'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    type: 'text',
    placeholder: 'Enter text...',
    value: 'Invalid input',
  },
};

export const Email: Story = {
  args: {
    variant: 'default',
    type: 'email',
    placeholder: 'Enter your email...',
  },
};

export const Password: Story = {
  args: {
    variant: 'default',
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Required: Story = {
  args: {
    variant: 'default',
    type: 'text',
    placeholder: 'Required field...',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    type: 'text',
    placeholder: 'Disabled input...',
    disabled: true,
    value: 'Cannot edit this',
  },
};
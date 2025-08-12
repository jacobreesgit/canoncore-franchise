import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormTextarea } from './FormTextarea';

const meta: Meta<typeof FormTextarea> = {
  title: 'CanonCore/FormTextarea',
  component: FormTextarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error'],
    },
    rows: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    placeholder: 'Enter description...',
    rows: 4,
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    placeholder: 'Enter description...',
    rows: 4,
    value: 'This description is invalid...',
  },
};

export const Large: Story = {
  args: {
    variant: 'default',
    placeholder: 'Enter long description...',
    rows: 8,
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    placeholder: 'Enter short note...',
    rows: 2,
  },
};

export const Required: Story = {
  args: {
    variant: 'default',
    placeholder: 'Required field...',
    rows: 4,
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    placeholder: 'Disabled textarea...',
    rows: 4,
    disabled: true,
    value: 'Cannot edit this content',
  },
};
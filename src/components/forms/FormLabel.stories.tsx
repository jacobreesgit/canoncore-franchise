import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormLabel } from './FormLabel';

const meta: Meta<typeof FormLabel> = {
  title: 'CanonCore/Forms/FormLabel',
  component: FormLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'required'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    htmlFor: 'example',
    children: 'Label Text',
  },
};

export const Required: Story = {
  args: {
    variant: 'required',
    htmlFor: 'example-required',
    children: 'Required Field *',
  },
};

export const WithForm: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <FormLabel htmlFor="name">Name *</FormLabel>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <FormLabel htmlFor="email">Email</FormLabel>
        <input
          type="email"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>
    </div>
  ),
};
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormActions } from './FormActions';

const meta: Meta<typeof FormActions> = {
  title: 'CanonCore/FormActions',
  component: FormActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['create', 'update', 'add'],
    },
    size: {
      control: { type: 'select' },
      options: ['default'],
    },
    isSubmitting: {
      control: { type: 'boolean' },
    },
    cancelHref: {
      control: { type: 'text' },
    },
    submitLabel: {
      control: { type: 'text' },
    },
    submittingLabel: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    variant: 'create',
    cancelHref: '/',
  },
};

export const Update: Story = {
  args: {
    variant: 'update',
    cancelHref: '/universes/123',
  },
};

export const Add: Story = {
  args: {
    variant: 'add',
    cancelHref: '/universes/123',
  },
};

export const Submitting: Story = {
  args: {
    variant: 'create',
    cancelHref: '/',
    isSubmitting: true,
  },
};

export const CustomLabels: Story = {
  args: {
    variant: 'update',
    cancelHref: '/back',
    submitLabel: 'Publish Changes',
    submittingLabel: 'Publishing...',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Create Variant</h3>
        <FormActions variant="create" cancelHref="/" />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Update Variant</h3>
        <FormActions variant="update" cancelHref="/back" />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Add Variant</h3>
        <FormActions variant="add" cancelHref="/universes/123" />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Submitting State</h3>
        <FormActions variant="create" cancelHref="/" isSubmitting={true} />
      </div>
    </div>
  ),
};
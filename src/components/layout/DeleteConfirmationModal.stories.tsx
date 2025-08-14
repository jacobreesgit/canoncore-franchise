import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

const meta: Meta<typeof DeleteConfirmationModal> = {
  title: 'CanonCore/Layout/DeleteConfirmationModal',
  component: DeleteConfirmationModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default'],
    },
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    title: {
      control: 'text',
      description: 'The modal title',
    },
    itemName: {
      control: 'text',
      description: 'Name of the item being deleted',
    },
    warningMessage: {
      control: 'text',
      description: 'Additional warning message (optional)',
    },
    isDeleting: {
      control: 'boolean',
      description: 'Whether the delete operation is in progress',
    },
    deleteButtonText: {
      control: 'text',
      description: 'Custom text for the delete button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Universe: Story = {
  args: {
    isOpen: true,
    title: 'Delete Universe',
    itemName: 'Marvel Cinematic Universe',
    warningMessage: 'This will also delete all associated content',
    isDeleting: false,
    deleteButtonText: 'Delete Universe',
    onCancel: () => console.log('Cancel clicked'),
    onConfirm: () => console.log('Delete confirmed'),
  },
};

export const Content: Story = {
  args: {
    isOpen: true,
    title: 'Delete Content',
    itemName: 'Iron Man',
    isDeleting: false,
    deleteButtonText: 'Delete Content',
    onCancel: () => console.log('Cancel clicked'),
    onConfirm: () => console.log('Delete confirmed'),
  },
};

export const Deleting: Story = {
  args: {
    isOpen: true,
    title: 'Delete Universe',
    itemName: 'Doctor Who Universe',
    warningMessage: 'This will also delete all associated content',
    isDeleting: true,
    deleteButtonText: 'Delete Universe',
    onCancel: () => console.log('Cancel clicked'),
    onConfirm: () => console.log('Delete confirmed'),
  },
};

export const CustomMessage: Story = {
  args: {
    isOpen: true,
    title: 'Delete Character',
    itemName: 'Tony Stark',
    warningMessage: 'This character appears in multiple storylines',
    isDeleting: false,
    deleteButtonText: 'Delete Character',
    onCancel: () => console.log('Cancel clicked'),
    onConfirm: () => console.log('Delete confirmed'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    title: 'Delete Universe',
    itemName: 'Marvel Cinematic Universe',
    isDeleting: false,
    onCancel: () => console.log('Cancel clicked'),
    onConfirm: () => console.log('Delete confirmed'),
  },
};
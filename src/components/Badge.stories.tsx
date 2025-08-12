import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'CanonCore/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['public', 'private', 'owner', 'viewable', 'organisational', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Public: Story = {
  args: {
    variant: 'public',
    size: 'default',
    children: 'Public',
  },
};

export const Private: Story = {
  args: {
    variant: 'private',
    size: 'default',
    children: 'Private',
  },
};

export const Owner: Story = {
  args: {
    variant: 'owner',
    size: 'default',
    children: 'Your Universe',
  },
};

export const Viewable: Story = {
  args: {
    variant: 'viewable',
    size: 'default',
    children: 'Viewable Content',
  },
};

export const Organisational: Story = {
  args: {
    variant: 'organisational',
    size: 'default',
    children: 'Organisational Content',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    size: 'default',
    children: 'Information',
  },
};

export const SmallSize: Story = {
  args: {
    variant: 'public',
    size: 'small',
    children: 'Public',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="public">Public</Badge>
      <Badge variant="private">Private</Badge>
      <Badge variant="owner">Your Universe</Badge>
      <Badge variant="viewable">Viewable Content</Badge>
      <Badge variant="organisational">Organisational Content</Badge>
      <Badge variant="info">Information</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-sm font-medium">Small</span>
        <div className="flex gap-2">
          <Badge variant="public" size="small">Public</Badge>
          <Badge variant="owner" size="small">Your Universe</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <span className="text-sm font-medium">Default</span>
        <div className="flex gap-2">
          <Badge variant="public" size="default">Public</Badge>
          <Badge variant="owner" size="default">Your Universe</Badge>
        </div>
      </div>
    </div>
  ),
};
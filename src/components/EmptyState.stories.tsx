import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'CanonCore/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'hierarchical'],
    },
    size: {
      control: { type: 'select' },
      options: ['default'],
    },
    title: {
      control: 'text',
      description: 'The main title of the empty state',
    },
    description: {
      control: 'text',
      description: 'Description text explaining the empty state',
    },
    actionText: {
      control: 'text',
      description: 'Text for the call-to-action button',
    },
    actionHref: {
      control: 'text',
      description: 'Link destination for the call-to-action button',
    },
    showAction: {
      control: 'boolean',
      description: 'Whether to show the call-to-action button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    variant: 'default',
    title: 'No franchises yet',
    description: 'Start by adding your first franchise like Marvel, Doctor Who, or Star Wars',
    actionText: 'Add Your First Franchise',
    actionHref: '/universes/create',
  },
};

export const Universe: Story = {
  args: {
    variant: 'default',
    title: 'No content yet',
    description: 'Start by adding episodes, movies, characters, or other content to this universe',
    actionText: 'Add First Content',
    actionHref: '/universes/123/content/create',
  },
};

export const Profile: Story = {
  args: {
    variant: 'default',
    title: 'No favourites yet',
    description: 'Start exploring franchises to add them to your favourites',
    actionText: 'Discover Franchises',
    actionHref: '/discover',
  },
};

export const DiscoverEmpty: Story = {
  args: {
    variant: 'default',
    title: 'No public franchises yet',
    description: 'Be the first to create and share a public franchise!',
    actionText: 'Create Franchise',
    actionHref: '/universes/create',
  },
};


export const HierarchicalSimple: Story = {
  args: {
    variant: 'hierarchical',
    title: 'No hierarchical relationships defined yet. Create relationships by setting parent content when adding new items.',
    description: '', // Not used in hierarchical variant
  },
};

export const WithoutAction: Story = {
  args: {
    variant: 'default',
    title: 'No items found',
    description: 'There are currently no items to display',
    showAction: false,
  },
};
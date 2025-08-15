import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'CanonCore/Layout/EmptyState',
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
    actions: {
      control: false,
      description: 'Array of action buttons',
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
    actions: [
      { text: 'Add Your First Franchise', href: '/universes/create', variant: 'primary' },
    ],
  },
};

export const Universe: Story = {
  args: {
    variant: 'default',
    title: 'No content yet',
    description: 'Start by adding individual content items, or create organisational groups like series and characters',
    actions: [
      { text: 'Add Content Item', href: '/universes/123/content/add-viewable', variant: 'primary' },
      { text: 'Add Organisation Group', href: '/universes/123/content/organise', variant: 'secondary' },
    ],
  },
};

export const Profile: Story = {
  args: {
    variant: 'default',
    title: 'No favourites yet',
    description: 'Start exploring franchises to add them to your favourites',
    actions: [
      { text: 'Discover Franchises', href: '/discover', variant: 'primary' },
    ],
  },
};

export const DiscoverEmpty: Story = {
  args: {
    variant: 'default',
    title: 'No public franchises yet',
    description: 'Be the first to create and share a public franchise!',
    actions: [
      { text: 'Create Franchise', href: '/universes/create', variant: 'primary' },
    ],
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
    actions: [],
  },
};
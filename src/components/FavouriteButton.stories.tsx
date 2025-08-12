import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FavouriteButton } from './FavouriteButton';

// For Storybook, we'll import the actual AuthProvider to provide real context
import { AuthProvider } from '@/lib/contexts/auth-context';

const meta: Meta<typeof FavouriteButton> = {
  title: 'CanonCore/FavouriteButton',
  component: FavouriteButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
  argTypes: {
    targetType: {
      control: { type: 'select' },
      options: ['universe', 'content'],
    },
    showText: {
      control: { type: 'boolean' },
    },
  },
  args: {
    targetId: 'example-id',
    targetType: 'universe',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    targetType: 'universe',
    showText: false,
  },
};

export const WithText: Story = {
  args: {
    targetType: 'universe',
    showText: true,
  },
};

export const UniverseFavourite: Story = {
  args: {
    targetType: 'universe',
    showText: true,
  },
};

export const ContentFavourite: Story = {
  args: {
    targetType: 'content',
    showText: true,
  },
};

export const IconOnly: Story = {
  args: {
    targetType: 'universe',
    showText: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <FavouriteButton targetId="universe-1" targetType="universe" />
        <span>Universe (icon only)</span>
      </div>
      <div className="flex items-center gap-4">
        <FavouriteButton targetId="universe-2" targetType="universe" showText />
        <span>Universe (with text)</span>
      </div>
      <div className="flex items-center gap-4">
        <FavouriteButton targetId="content-1" targetType="content" />
        <span>Content (icon only)</span>
      </div>
      <div className="flex items-center gap-4">
        <FavouriteButton targetId="content-2" targetType="content" showText />
        <span>Content (with text)</span>
      </div>
    </div>
  ),
};
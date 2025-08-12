import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Navigation } from './Navigation';

// For Storybook, we'll import the actual AuthProvider to provide real context
import { AuthProvider } from '@/lib/contexts/auth-context';

const meta: Meta<typeof Navigation> = {
  title: 'CanonCore/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
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
    variant: {
      control: { type: 'select' },
      options: ['dashboard'],
    },
    currentPage: {
      control: { type: 'select' },
      options: ['dashboard', 'discover', 'profile', 'content', 'universe-detail'],
    },
    showNavigationMenu: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
    showNavigationMenu: true,
    currentPage: 'dashboard',
  },
};

export const Discover: Story = {
  args: {
    variant: 'dashboard', 
    showNavigationMenu: true,
    currentPage: 'discover',
  },
};

export const Profile: Story = {
  args: {
    variant: 'dashboard',
    showNavigationMenu: true,
    currentPage: 'profile',
  },
};

export const UniverseDetail: Story = {
  args: {
    variant: 'dashboard',
    showNavigationMenu: true,
    currentPage: 'dashboard',
  },
};

export const ContentDetail: Story = {
  args: {
    variant: 'dashboard',
    showNavigationMenu: true,
    currentPage: 'dashboard',
  },
};
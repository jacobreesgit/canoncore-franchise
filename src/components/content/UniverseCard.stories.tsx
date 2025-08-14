import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UniverseCard } from './UniverseCard';
import { Universe } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

// For Storybook, we'll import the actual AuthProvider to provide real context
import { AuthProvider } from '@/lib/contexts/auth-context';

const meta: Meta<typeof UniverseCard> = {
  title: 'CanonCore/Content/UniverseCard',
  component: UniverseCard,
  parameters: {
    layout: 'padded',
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
    showFavourite: {
      control: { type: 'boolean' },
    },
    showOwner: {
      control: { type: 'boolean' },
    },
    showOwnerBadge: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock universe data
const mockUniverse: Universe = {
  id: '1',
  name: 'Marvel Cinematic Universe',
  description: 'The Marvel Cinematic Universe is an American media franchise and shared universe centered on a series of superhero films produced by Marvel Studios.',
  userId: 'user123',
  isPublic: true,
  progress: 67,
  createdAt: Timestamp.fromDate(new Date('2023-01-15')),
  updatedAt: Timestamp.fromDate(new Date('2024-01-15')),
};

const mockPrivateUniverse: Universe = {
  ...mockUniverse,
  name: 'Star Wars Extended Universe',
  description: 'My personal collection of Star Wars content including movies, series, books, and expanded universe material.',
  isPublic: false,
  progress: 45,
};

const mockUniverseNoProgress: Universe = {
  ...mockUniverse,
  name: 'Doctor Who',
  description: 'The longest-running science fiction television series following the adventures of the Doctor.',
  progress: 0,
};

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
    universe: mockUniverse,
    href: '/universes/1',
    showFavourite: true,
    showOwner: false,
    showOwnerBadge: true,
    currentUserId: 'user123',
  },
};

export const Discover: Story = {
  args: {
    variant: 'discover',
    universe: mockUniverse,
    href: '/universes/1',
    showFavourite: false,
    showOwner: true,
    ownerName: 'John Doe',
    showOwnerBadge: true,
    currentUserId: 'different-user',
  },
};

export const Private: Story = {
  args: {
    variant: 'profile',
    universe: mockPrivateUniverse,
    href: '/universes/2',
    showFavourite: false,
    showOwner: false,
    showOwnerBadge: true,
    currentUserId: 'user123',
  },
};

export const YourUniverse: Story = {
  args: {
    variant: 'dashboard',
    universe: mockUniverse,
    href: '/universes/1',
    showFavourite: true,
    showOwner: false,
    showOwnerBadge: true,
    currentUserId: 'user123', // Same as universe.userId
  },
};

export const NotYourUniverse: Story = {
  args: {
    variant: 'discover',
    universe: mockUniverse,
    href: '/universes/1',
    showFavourite: true,
    showOwner: true,
    ownerName: 'Jane Smith',
    showOwnerBadge: true,
    currentUserId: 'different-user', // Different from universe.userId
  },
};

export const NoProgress: Story = {
  args: {
    variant: 'dashboard',
    universe: mockUniverseNoProgress,
    href: '/universes/3',
    showFavourite: true,
    showOwner: false,
    showOwnerBadge: true,
    currentUserId: 'user123',
  },
};
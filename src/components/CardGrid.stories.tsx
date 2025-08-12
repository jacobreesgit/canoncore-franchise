import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timestamp } from 'firebase/firestore';
import { CardGrid } from './CardGrid';
import { UniverseCard } from './UniverseCard';
import { ContentCard } from './ContentCard';

// Helper function to create mock timestamp
const mockTimestamp = () => Timestamp.fromDate(new Date());

const meta: Meta<typeof CardGrid> = {
  title: 'Components/CardGrid',
  component: CardGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'wide'],
    },
    size: {
      control: 'select', 
      options: ['default'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardGrid>;

// Mock universe data for stories
const mockUniverses = [
  {
    id: '1',
    name: 'Marvel Cinematic Universe',
    description: 'The shared universe of Marvel superhero films',
    userId: 'user1',
    isPublic: true,
    progress: 75,
    createdAt: mockTimestamp(),
    updatedAt: mockTimestamp()
  },
  {
    id: '2', 
    name: 'Doctor Who Universe',
    description: 'The time-travelling adventures of the Doctor',
    userId: 'user1',
    isPublic: true,
    progress: 45,
    createdAt: mockTimestamp(),
    updatedAt: mockTimestamp()
  },
  {
    id: '3',
    name: 'Star Wars Galaxy',
    description: 'A long time ago in a galaxy far, far away...',
    userId: 'user2',
    isPublic: true,
    progress: 90,
    createdAt: mockTimestamp(),
    updatedAt: mockTimestamp()
  }
];

// Mock content data for stories
const mockContent = [
  {
    id: '1',
    name: 'Iron Man',
    description: 'The first MCU film that started it all',
    universeId: '1',
    userId: 'user1',
    isPublic: true,
    isViewable: true,
    mediaType: 'video' as const,
    progress: 100,
    createdAt: mockTimestamp(),
    updatedAt: mockTimestamp()
  },
  {
    id: '2',
    name: 'The Avengers',
    description: 'Earth\'s Mightiest Heroes assemble for the first time',
    universeId: '1', 
    userId: 'user1',
    isPublic: true,
    isViewable: true,
    mediaType: 'video' as const,
    progress: 100,
    createdAt: mockTimestamp(),
    updatedAt: mockTimestamp()
  }
];

export const Default: Story = {
  args: {
    variant: 'default',
    children: mockUniverses.map((universe) => (
      <UniverseCard
        key={universe.id}
        universe={universe}
        href={`/universes/${universe.id}`}
        showFavourite={true}
        showOwner={false}
        showOwnerBadge={true}
        currentUserId="user1"
      />
    ))
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    children: mockUniverses.concat([
      {
        id: '4',
        name: 'Harry Potter',
        description: 'The wizarding world of Harry Potter',
        userId: 'user1',
        isPublic: true,
        progress: 60,
        createdAt: mockTimestamp(),
        updatedAt: mockTimestamp()
      }
    ]).map((universe) => (
      <UniverseCard
        key={universe.id}
        universe={universe}
        href={`/universes/${universe.id}`}
        showFavourite={true}
        showOwner={false}
        showOwnerBadge={true}
        currentUserId="user1"
      />
    ))
  },
};

export const Wide: Story = {
  args: {
    variant: 'wide',
    children: mockUniverses.slice(0, 2).map((universe) => (
      <UniverseCard
        key={universe.id}
        universe={universe}
        href={`/universes/${universe.id}`}
        showFavourite={true}
        showOwner={false}
        showOwnerBadge={true}
        currentUserId="user1"
      />
    ))
  },
};

export const WithContentCards: Story = {
  args: {
    variant: 'default',
    children: mockContent.map((content) => (
      <ContentCard
        key={content.id}
        content={content}
        href={`/content/${content.id}`}
      />
    ))
  },
};

export const Empty: Story = {
  args: {
    variant: 'default',
    children: null
  },
};

export const SingleCard: Story = {
  args: {
    variant: 'default',
    children: (
      <UniverseCard
        key={mockUniverses[0].id}
        universe={mockUniverses[0]}
        href={`/universes/${mockUniverses[0].id}`}
        showFavourite={true}
        showOwner={false}
        showOwnerBadge={true}
        currentUserId="user1"
      />
    )
  },
};
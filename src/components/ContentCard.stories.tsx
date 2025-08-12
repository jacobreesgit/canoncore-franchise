import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContentCard } from './ContentCard';
import { Content } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const meta: Meta<typeof ContentCard> = {
  title: 'CanonCore/ContentCard',
  component: ContentCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock viewable content data
const mockViewableContent: Content = {
  id: '1',
  name: 'Iron Man',
  description: 'Genius billionaire playboy philanthropist Tony Stark suits up as the armored superhero Iron Man.',
  universeId: 'universe1',
  userId: 'user123',
  isViewable: true,
  mediaType: 'video',
  progress: 100,
  isPublic: true,
  createdAt: Timestamp.fromDate(new Date('2023-01-15')),
  updatedAt: Timestamp.fromDate(new Date('2024-01-15')),
};

const mockViewableContentPartial: Content = {
  ...mockViewableContent,
  name: 'Thor',
  progress: 0,
};

// Mock organizational content data
const mockOrganizationalContent: Content = {
  id: '2',
  name: 'Phase One',
  description: 'The first phase of the Marvel Cinematic Universe, introducing the core Avengers characters.',
  universeId: 'universe1',
  userId: 'user123',
  isViewable: false,
  mediaType: 'collection',
  calculatedProgress: 85,
  isPublic: true,
  createdAt: Timestamp.fromDate(new Date('2023-01-15')),
  updatedAt: Timestamp.fromDate(new Date('2024-01-15')),
};

const mockOrganizationalContentPartial: Content = {
  ...mockOrganizationalContent,
  name: 'The Avengers',
  mediaType: 'character',
  calculatedProgress: 45,
};

export const Viewable: Story = {
  args: {
    variant: 'viewable',
    content: mockViewableContent,
    href: '/content/1',
  },
};

export const Organisational: Story = {
  args: {
    variant: 'organisational',
    content: mockOrganizationalContent,
    href: '/content/2',
  },
};

export const NoProgress: Story = {
  args: {
    variant: 'viewable',
    content: mockViewableContentPartial,
    href: '/content/3',
  },
};
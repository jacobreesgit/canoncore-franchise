import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageHeader } from './PageHeader';
import { Badge } from '../content/Badge';

const meta: Meta<typeof PageHeader> = {
  title: 'CanonCore/Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['dashboard', 'detail', 'form', 'centered'],
    },
    size: {
      control: { type: 'select' },
      options: ['default'],
    },
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
    title: 'Your Franchises',
    description: 'Manage and track your progress through your favourite fictional universes',
    actions: [
      { type: 'primary', label: 'Create Franchise', href: '/universes/create' },
    ],
  },
};

export const Detail: Story = {
  args: {
    variant: 'detail',
    title: 'Marvel Cinematic Universe',
    description: 'The Marvel Cinematic Universe is an American media franchise and shared universe centered on a series of superhero films produced by Marvel Studios.',
    breadcrumbs: [
      { label: 'Dashboard', href: '/' },
      { label: 'Marvel Cinematic Universe', isCurrentPage: true }
    ],
    metadata: (
      <>
        <Badge variant="public" size="default">Public</Badge>
        <span className="text-sm text-gray-500">23 Movies • 15 Series</span>
      </>
    ),
    progressBar: {
      variant: 'organisational',
      value: 67,
      label: 'Overall Progress'
    },
    actions: [
      { type: 'primary', label: '+ Content', href: '/content/create' },
      { type: 'secondary', label: 'Edit', href: '/edit' },
      { type: 'danger', label: 'Delete', onClick: () => alert('Delete clicked') },
    ],
  },
};

export const Form: Story = {
  args: {
    variant: 'form',
    title: 'Create New Franchise',
    description: 'Add a real existing franchise like Marvel, Doctor Who, Star Wars, etc. Remember, only catalogue established fictional universes.',
  },
};

export const Centered: Story = {
  args: {
    variant: 'centered',
    title: 'Discover Franchises',
    description: 'Explore public franchise collections created by the community',
  },
};

export const ContentDetail: Story = {
  args: {
    variant: 'detail',
    title: 'Iron Man',
    description: 'Genius billionaire playboy philanthropist Tony Stark suits up as the armored superhero Iron Man.',
    breadcrumbs: [
      { label: 'Dashboard', href: '/' },
      { label: 'Marvel Cinematic Universe', href: '/universes/123' },
      { label: 'Iron Man', isCurrentPage: true }
    ],
    metadata: (
      <>
        <Badge variant="organisational" size="default">Video</Badge>
        <span className="text-sm text-gray-500">Viewable Content</span>
      </>
    ),
    progressBar: {
      variant: 'viewable',
      value: 100,
      label: 'Progress'
    },
    actions: [
      { type: 'secondary', label: 'Edit', href: '/content/456/edit' },
      { type: 'danger', label: 'Delete', onClick: () => alert('Delete clicked') },
    ],
  },
};

export const OrganisationalContent: Story = {
  args: {
    variant: 'detail',
    title: 'Phase One',
    description: 'The first phase of the Marvel Cinematic Universe, introducing the core Avengers characters.',
    breadcrumbs: [
      { label: 'Dashboard', href: '/' },
      { label: 'Marvel Cinematic Universe', href: '/universes/123' },
      { label: 'Phase One', isCurrentPage: true }
    ],
    metadata: (
      <>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">Collection</span>
        <span className="text-sm text-gray-500">Organisational Content</span>
      </>
    ),
    progressBar: {
      variant: 'organisational',
      value: 85,
      label: 'Overall Progress'
    },
    actions: [
      { type: 'secondary', label: 'Edit', href: '/content/789/edit' },
      { type: 'danger', label: 'Delete', onClick: () => alert('Delete clicked') },
    ],
  },
};

export const WithSearch: Story = {
  args: {
    variant: 'centered',
    title: 'Your Franchises',
    description: 'Manage and track your progress through your favourite fictional universes',
    searchBar: {
      value: '',
      onChange: () => {},
      placeholder: 'Search your franchises...',
      variant: 'default'
    },
    actions: [
      { type: 'primary', label: '+ Franchise', href: '/universes/create' }
    ],
  },
};

export const WithSearchDetail: Story = {
  args: {
    variant: 'detail',
    title: 'Marvel Cinematic Universe',
    description: 'The shared universe of superhero films and TV series produced by Marvel Studios',
    breadcrumbs: [
      { label: 'Dashboard', href: '/' },
      { label: 'Marvel Cinematic Universe', isCurrentPage: true }
    ],
    searchBar: {
      value: '',
      onChange: () => {},
      placeholder: 'Search episodes, characters, locations...',
      variant: 'default'
    },
    actions: [
      { type: 'primary', label: '+ Content Item', href: '/universes/123/content/add-viewable' },
      { type: 'secondary', label: '+ Organisation Group', href: '/universes/123/content/organise' }
    ],
  },
};


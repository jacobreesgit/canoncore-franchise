import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'CanonCore/Interactive/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'clear'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Plus icon for add content actions
const PlusIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Media type icons
const VideoIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const BookIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const UserIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LocationIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const Default: Story = {
  args: {
    label: '+ Item',
    icon: PlusIcon,
    options: [
      {
        label: 'Add Content Item',
        value: 'content-item',
        href: '/universes/123/content/create?category=viewable',
        icon: VideoIcon,
      },
      {
        label: 'Add Organisational Group',
        value: 'organisational-group',
        href: '/universes/123/content/create?category=organisational',
        icon: UserIcon,
      },
    ],
  },
};

export const WithActions: Story = {
  args: {
    label: 'Actions',
    variant: 'secondary',
    options: [
      {
        label: 'Create Universe',
        value: 'create-universe',
        onClick: () => alert('Create Universe clicked'),
        icon: PlusIcon,
      },
      {
        label: 'Import Data',
        value: 'import',
        onClick: () => alert('Import Data clicked'),
      },
      {
        label: 'Export Data',
        value: 'export',
        onClick: () => alert('Export Data clicked'),
      },
      {
        label: 'Delete (Disabled)',
        value: 'delete',
        onClick: () => alert('Delete clicked'),
        disabled: true,
      },
    ],
  },
};

export const Primary: Story = {
  args: {
    label: '+ Content',
    variant: 'primary',
    icon: PlusIcon,
    options: [
      {
        label: 'Viewable Content',
        value: 'viewable',
        href: '/universes/123/content/create?category=viewable',
        icon: VideoIcon,
      },
      {
        label: 'Organisational Content',
        value: 'organisational',
        href: '/universes/123/content/create?category=organisational',
        icon: UserIcon,
      },
    ],
  },
};

export const Small: Story = {
  args: {
    label: 'Add',
    size: 'small',
    icon: PlusIcon,
    options: [
      {
        label: 'New Item',
        value: 'new',
        onClick: () => alert('New Item clicked'),
      },
      {
        label: 'Copy Item',
        value: 'copy',
        onClick: () => alert('Copy Item clicked'),
      },
    ],
  },
};

export const Large: Story = {
  args: {
    label: 'Create Content',
    size: 'large',
    variant: 'primary',
    icon: PlusIcon,
    options: [
      {
        label: 'Movie or TV Show',
        value: 'video',
        href: '/create?type=video',
        icon: VideoIcon,
      },
      {
        label: 'Book or Comic',
        value: 'text',
        href: '/create?type=text',
        icon: BookIcon,
      },
      {
        label: 'Character Profile',
        value: 'character',
        href: '/create?type=character',
        icon: UserIcon,
      },
      {
        label: 'Location Guide',
        value: 'location',
        href: '/create?type=location',
        icon: LocationIcon,
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: 'Add Content',
    disabled: true,
    icon: PlusIcon,
    options: [
      {
        label: 'Movie',
        value: 'movie',
        href: '/create?type=movie',
      },
      {
        label: 'Book',
        value: 'book',
        href: '/create?type=book',
      },
    ],
  },
};
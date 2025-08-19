import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ContentSection } from './ContentSection';
import { Content } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { AuthProvider } from '@/lib/contexts/auth-context';

const meta = {
  title: 'CanonCore/Content/ContentSection',
  component: ContentSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Complete content section with header, view toggle, and content display'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof ContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock content data
const mockContent: Content[] = [
  {
    id: 'phase1',
    name: 'Phase One',
    description: 'The beginning of the MCU',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: false,
    isPublic: true,
    mediaType: 'collection',
    calculatedProgress: 85,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'ironman',
    name: 'Iron Man',
    description: 'Tony Stark becomes Iron Man',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: true,
    isPublic: true,
    mediaType: 'video',
    progress: 100,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'hulk',
    name: 'The Incredible Hulk',
    description: 'Bruce Banner transforms',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: true,
    isPublic: true,
    mediaType: 'video',
    progress: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'ironman2',
    name: 'Iron Man 2',
    description: 'Tony faces new challenges',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: true,
    isPublic: true,
    mediaType: 'video',
    progress: 100,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'thor',
    name: 'Thor',
    description: 'God of Thunder arrives on Earth',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: true,
    isPublic: true,
    mediaType: 'video',
    progress: 50,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Mock hierarchy structure
const mockHierarchyTree = [
  {
    contentId: 'phase1',
    children: [
      { contentId: 'ironman', children: [] },
      { contentId: 'hulk', children: [] },
      { contentId: 'ironman2', children: [] },
      { contentId: 'thor', children: [] }
    ]
  }
];

const contentHref = (content: Content) => `/content/${content.id}`;

// Template for interactive stories
const Template = (args: any) => {
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>(args.viewMode || 'tree');
  
  return (
    <ContentSection
      {...args}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );
};

/**
 * Default content section with tree view as default
 */
export const Default: Story = {
  render: Template,
  args: {
    title: 'Content',
    content: mockContent,
    viewMode: 'tree',
    onViewModeChange: () => {},
    contentHref,
    hierarchyTree: mockHierarchyTree,
    showFavourite: true,
    currentUserId: 'user123',
    showUnorganized: true
  }
};

/**
 * Content section with custom title
 */
export const CustomTitle: Story = {
  render: Template,
  args: {
    title: 'Marvel Cinematic Universe',
    content: mockContent,
    viewMode: 'tree',
    onViewModeChange: () => {},
    contentHref,
    hierarchyTree: mockHierarchyTree,
    showFavourite: true,
    currentUserId: 'user123',
    showUnorganized: true
  }
};

/**
 * Content section with contextual tree (focused content)
 */
export const ContextualTree: Story = {
  render: Template,
  args: {
    title: 'Content',
    content: mockContent,
    viewMode: 'tree',
    onViewModeChange: () => {},
    contentHref,
    hierarchyTree: mockHierarchyTree,
    highlightedContentId: 'ironman',
    showFavourite: true,
    currentUserId: 'user123',
    showUnorganized: false
  }
};

/**
 * Content section with search results
 */
export const WithSearch: Story = {
  render: Template,
  args: {
    title: 'Content',
    content: mockContent,
    viewMode: 'tree',
    onViewModeChange: () => {},
    contentHref,
    hierarchyTree: mockHierarchyTree,
    searchQuery: 'Iron',
    filteredContent: mockContent.filter(c => c.name.includes('Iron')),
    showFavourite: true,
    currentUserId: 'user123',
    showUnorganized: true
  }
};

/**
 * Content section without favourites (unauthenticated user)
 */
export const WithoutFavourites: Story = {
  render: Template,
  args: {
    title: 'Content',
    content: mockContent,
    viewMode: 'tree',
    onViewModeChange: () => {},
    contentHref,
    hierarchyTree: mockHierarchyTree,
    showFavourite: false,
    showUnorganized: true
  }
};

/**
 * Empty content section
 */
export const Empty: Story = {
  render: Template,
  args: {
    title: 'Content',
    content: [],
    viewMode: 'tree',
    onViewModeChange: () => {},
    contentHref,
    hierarchyTree: [],
    showFavourite: true,
    currentUserId: 'user123',
    showUnorganized: true
  }
};
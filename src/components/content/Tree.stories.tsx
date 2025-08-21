import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tree } from './Tree';
import { Content } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { AuthProvider } from '@/lib/contexts/auth-context';

const meta = {
  title: 'CanonCore/Content/Tree',
  component: Tree,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Hierarchical tree display component for showing content organization with parent-child relationships. Supports full tree view and focused variant with smart auto-expansion and highlighting. Each tree node includes a favourite button for authenticated users to bookmark content items.'
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
  argTypes: {
    hierarchyTree: {
      description: 'Tree structure representing content hierarchy',
      control: 'object'
    },
    content: {
      description: 'Array of all content items',
      control: 'object'
    },
    contentHref: {
      description: 'Function to generate URLs for content items',
      control: false
    },
    searchQuery: {
      description: 'Current search query for filtering',
      control: 'text'
    },
    filteredContent: {
      description: 'Filtered content for search results',
      control: 'object'
    },
  }
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content data
const sampleContent: Content[] = [
  {
    id: '1',
    name: 'Marvel Cinematic Universe Phase 4',
    description: 'Collection of Phase 4 MCU content',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: false,
    isPublic: true,
    mediaType: 'collection',
    calculatedProgress: 65,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '2',
    name: 'Spider-Man: No Way Home',
    description: 'Third Spider-Man film in the MCU',
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
    id: '3',
    name: 'Doctor Strange in the Multiverse of Madness',
    description: 'Second Doctor Strange film exploring the multiverse',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: true,
    isPublic: true,
    mediaType: 'video',
    progress: 75,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: '4',
    name: 'Peter Parker',
    description: 'Spider-Man character in the MCU',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: false,
    isPublic: true,
    mediaType: 'character',
    calculatedProgress: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Sample hierarchy tree
const sampleHierarchy = [
  {
    contentId: '1',
    children: [
      { contentId: '2', children: [] },
      { contentId: '3', children: [] }
    ]
  }
];

export const Default: Story = {
  args: {
    hierarchyTree: sampleHierarchy,
    content: sampleContent,
    contentHref: (item: Content) => `/content/${item.id}`
  }
};

export const WithSearch: Story = {
  args: {
    hierarchyTree: sampleHierarchy,
    content: sampleContent,
    contentHref: (item: Content) => `/content/${item.id}`,
    searchQuery: 'Spider-Man',
    filteredContent: [sampleContent[1]] // Spider-Man movie
  }
};

export const EmptyHierarchy: Story = {
  args: {
    hierarchyTree: [],
    content: sampleContent,
    contentHref: (item: Content) => `/content/${item.id}`
  }
};

export const OnlyHierarchical: Story = {
  args: {
    hierarchyTree: sampleHierarchy,
    content: sampleContent.slice(0, 3), // Only content that's in the hierarchy
    contentHref: (item: Content) => `/content/${item.id}`
  }
};

export const DeepHierarchy: Story = {
  args: {
    hierarchyTree: [
      {
        contentId: '1',
        children: [
          {
            contentId: '2',
            children: [
              { contentId: '4', children: [] }
            ]
          },
          { contentId: '3', children: [] }
        ]
      }
    ],
    content: sampleContent,
    contentHref: (item: Content) => `/content/${item.id}`
  }
};

export const FocusedVariant: Story = {
  args: {
    variant: 'focused',
    hierarchyTree: sampleHierarchy,
    content: sampleContent,
    contentHref: (item: Content) => `/content/${item.id}`,
    highlightedContentId: '2' // Spider-Man movie
  }
};
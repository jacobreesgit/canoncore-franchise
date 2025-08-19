import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tree } from './Tree';
import { Content } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { AuthProvider } from '@/lib/contexts/auth-context';

const meta = {
  title: 'CanonCore/Content/TreeNode',
  component: Tree,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tree component displaying hierarchical content structures with expandable nodes'
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
} satisfies Meta<typeof Tree>;

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
  },
  {
    id: 'avengers',
    name: 'The Avengers',
    description: 'Heroes assemble for the first time',
    universeId: 'mcu',
    userId: 'user1',
    isViewable: true,
    isPublic: true,
    mediaType: 'video',
    progress: 100,
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
      { contentId: 'thor', children: [] },
      { contentId: 'avengers', children: [] }
    ]
  }
];

const contentHref = (content: Content) => `/content/${content.id}`;

/**
 * Default tree with hierarchical content structure
 */
export const Default: Story = {
  args: {
    variant: 'full',
    hierarchyTree: mockHierarchyTree,
    content: mockContent,
    contentHref,
    showUnorganized: true
  }
};

/**
 * Focused tree showing highlighted content with smart expansion
 */
export const Focused: Story = {
  args: {
    variant: 'focused',
    hierarchyTree: mockHierarchyTree,
    content: mockContent,
    contentHref,
    highlightedContentId: 'ironman',
    showUnorganized: false
  }
};

/**
 * Tree with search results
 */
export const WithSearch: Story = {
  args: {
    variant: 'full',
    hierarchyTree: mockHierarchyTree,
    content: mockContent,
    contentHref,
    searchQuery: 'Iron',
    filteredContent: mockContent.filter(c => c.name.includes('Iron')),
    showUnorganized: true
  }
};

/**
 * Empty tree with no content
 */
export const Empty: Story = {
  args: {
    variant: 'full',
    hierarchyTree: [],
    content: [],
    contentHref,
    showUnorganized: true
  }
};

/**
 * Tree with mixed progress states
 */
export const MixedProgress: Story = {
  args: {
    variant: 'full',
    hierarchyTree: mockHierarchyTree,
    content: mockContent,
    contentHref,
    showUnorganized: true
  }
};
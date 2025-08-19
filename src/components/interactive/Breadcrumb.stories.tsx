import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'CanonCore/Interactive/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Hierarchical navigation breadcrumb component for showing current location and enabling quick navigation to parent levels. Design matches PageHeader breadcrumb implementation with forward slash separators and proper spacing.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of breadcrumb items to display',
      control: 'object'
    },
    className: {
      description: 'Optional custom CSS classes',
      control: 'text'
    }
  }
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Marvel Cinematic Universe', onClick: () => console.log('Navigate to root') },
      { label: 'Phase 4', onClick: () => console.log('Navigate to Phase 4') },
      { label: 'Spider-Man: No Way Home', isCurrentPage: true }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Default breadcrumb with hierarchical navigation using onClick handlers. Uses forward slash separators and proper text styling.'
      }
    }
  }
};

export const SimpleNavigation: Story = {
  args: {
    items: [
      { label: 'Home', onClick: () => console.log('Navigate to home') },
      { label: 'Current Page', isCurrentPage: true }
    ]
  }
};

export const DeepHierarchy: Story = {
  args: {
    items: [
      { label: 'Star Wars Universe', onClick: () => console.log('Navigate to universe') },
      { label: 'Original Trilogy', onClick: () => console.log('Navigate to trilogy') },
      { label: 'Episode IV', onClick: () => console.log('Navigate to episode') },
      { label: 'Tatooine', onClick: () => console.log('Navigate to planet') },
      { label: 'Luke Skywalker', isCurrentPage: true }
    ]
  }
};

export const WithHrefLinks: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/' },
      { label: 'Universes', href: '/universes' },
      { label: 'Doctor Who', href: '/universes/123' },
      { label: 'Season 1', isCurrentPage: true }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb using href links for navigation. Matches PageHeader breadcrumb design with link styling.'
      }
    }
  }
};

export const SingleItem: Story = {
  args: {
    items: [
      { label: 'Current Page', isCurrentPage: true }
    ]
  }
};

export const Empty: Story = {
  args: {
    items: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty breadcrumb (renders nothing when no items provided).'
      }
    }
  }
};

export const LongBreadcrumb: Story = {
  args: {
    items: [
      { label: 'Dashboard', onClick: () => console.log('Navigate to dashboard') },
      { label: 'Marvel Cinematic Universe', onClick: () => console.log('Navigate to MCU') },
      { label: 'Phase 4', onClick: () => console.log('Navigate to Phase 4') },
      { label: 'Movies', onClick: () => console.log('Navigate to Movies') },
      { label: 'Spider-Man Collection', onClick: () => console.log('Navigate to Collection') },
      { label: 'Spider-Man: No Way Home', isCurrentPage: true }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Long breadcrumb with horizontal scrolling (overflow-x-auto) and min-width preservation.'
      }
    }
  }
};
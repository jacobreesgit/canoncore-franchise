import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ViewToggle } from './ViewToggle';
import { useState } from 'react';

const meta: Meta<typeof ViewToggle> = {
  title: 'CanonCore/Interactive/ViewToggle',
  component: ViewToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible toggle component with enhanced active states. Active buttons feature blue background with white text (5.17:1 contrast ratio) for better visual distinction and WCAG AA compliance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: { type: 'object' },
    },
    value: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ViewToggleWithState = (props: any) => {
  const [value, setValue] = useState(props.value);
  return <ViewToggle {...props} value={value} onChange={setValue} />;
};

export const GridTreeToggle: Story = {
  render: () => (
    <ViewToggleWithState
      value="grid"
      options={[
        { value: 'grid', label: 'Grid View' },
        { value: 'tree', label: 'Tree View' }
      ]}
    />
  ),
};

export const ProfileTabs: Story = {
  render: () => (
    <ViewToggleWithState
      value="universes"
      options={[
        { value: 'universes', label: 'Public Franchises (3)' },
        { value: 'favourites', label: 'Favourites (7)' }
      ]}
    />
  ),
};

export const MultipleOptions: Story = {
  render: () => (
    <ViewToggleWithState
      value="all"
      options={[
        { value: 'all', label: 'All' },
        { value: 'movies', label: 'Movies' },
        { value: 'episodes', label: 'Episodes' },
        { value: 'characters', label: 'Characters' }
      ]}
    />
  ),
};

export const TwoOptions: Story = {
  args: {
    value: 'option1',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ],
    onChange: () => {},
  },
};

export const ThreeOptions: Story = {
  args: {
    value: 'middle',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'middle', label: 'Middle' },
      { value: 'right', label: 'Right' }
    ],
    onChange: () => {},
  },
};
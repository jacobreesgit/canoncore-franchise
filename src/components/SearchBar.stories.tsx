import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'large'],
    },
    size: {
      control: 'select', 
      options: ['default', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// Interactive wrapper for stories
function SearchBarWrapper({ ...args }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchBar
      {...args}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

export const Default: Story = {
  render: (args) => <SearchBarWrapper {...args} />,
  args: {
    placeholder: 'Search franchises...',
    variant: 'default',
    size: 'default',
  },
};

export const Large: Story = {
  render: (args) => <SearchBarWrapper {...args} />,
  args: {
    placeholder: 'Search Marvel, Doctor Who, Star Wars...',
    variant: 'large',
    size: 'large',
  },
};

export const WithValue: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState('Marvel');
    
    return (
      <SearchBar
        {...args}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    );
  },
  args: {
    placeholder: 'Search franchises...',
    variant: 'default',
  },
};

export const CustomPlaceholder: Story = {
  render: (args) => <SearchBarWrapper {...args} />,
  args: {
    placeholder: 'Find your favourite fictional universe...',
    variant: 'default',
  },
};

export const InContainer: Story = {
  render: (args) => (
    <div className="max-w-md mx-auto">
      <SearchBarWrapper {...args} />
    </div>
  ),
  args: {
    placeholder: 'Search franchises...',
    variant: 'default',
  },
};
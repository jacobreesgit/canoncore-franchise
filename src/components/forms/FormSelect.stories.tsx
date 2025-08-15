import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormSelect } from './FormSelect';

const meta: Meta<typeof FormSelect> = {
  title: 'CanonCore/Forms/FormSelect',
  component: FormSelect,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="video">Movies & Episodes</option>
        <option value="audio">Audio Content</option>
        <option value="text">Books & Comics</option>
      </>
    ),
  },
};

export const WithValue: Story = {
  args: {
    variant: 'default',
    value: 'video',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="video">Movies & Episodes</option>
        <option value="audio">Audio Content</option>
        <option value="text">Books & Comics</option>
      </>
    ),
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: (
      <>
        <option value="">Please select an option</option>
        <option value="video">Movies & Episodes</option>
        <option value="audio">Audio Content</option>
        <option value="text">Books & Comics</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
    value: 'video',
    children: (
      <>
        <option value="">Select an option</option>
        <option value="video">Movies & Episodes</option>
        <option value="audio">Audio Content</option>
        <option value="text">Books & Comics</option>
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    variant: 'default',
    required: true,
    children: (
      <>
        <option value="">Select media type *</option>
        <option value="video">Movies & Episodes</option>
        <option value="audio">Audio Content</option>
        <option value="text">Books & Comics</option>
      </>
    ),
  },
};

export const MediaTypeSelector: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <option value="">Choose media type</option>
        <optgroup label="Viewable Content">
          <option value="video">Movies & Episodes</option>
          <option value="audio">Audio Content</option>
          <option value="text">Books & Comics</option>
        </optgroup>
        <optgroup label="Organisational Content">
          <option value="character">Characters</option>
          <option value="location">Locations</option>
          <option value="item">Items</option>
          <option value="event">Events</option>
          <option value="series">Series</option>
        </optgroup>
      </>
    ),
  },
};

export const ParentSelector: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <option value="">No parent (top level)</option>
        <option value="phase1">Phase One</option>
        <option value="phase2">Phase Two</option>
        <option value="phase3">Phase Three</option>
        <option value="characters">Main Characters</option>
        <option value="locations">Key Locations</option>
      </>
    ),
  },
};
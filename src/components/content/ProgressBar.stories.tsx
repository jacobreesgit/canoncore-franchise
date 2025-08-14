import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'CanonCore/Content/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['viewable', 'organisational'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'large'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value from 0 to 100',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show label and percentage',
    },
    label: {
      control: 'text',
      description: 'Custom label text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewableContent: Story = {
  args: {
    variant: 'viewable',
    value: 75,
    showLabel: true,
    label: 'Watched',
  },
};

export const OrganisationalContent: Story = {
  args: {
    variant: 'organisational',
    value: 45,
    showLabel: true,
    label: 'Complete',
  },
};

export const WithoutLabel: Story = {
  args: {
    variant: 'viewable',
    value: 85,
    showLabel: false,
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'organisational',
    size: 'large',
    value: 90,
    showLabel: true,
    label: 'Progress',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Viewable Content (Green)</h3>
        <ProgressBar variant="viewable" value={75} showLabel={true} label="Watched" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Organisational Content (Blue)</h3>
        <ProgressBar variant="organisational" value={45} showLabel={true} label="Complete" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Large Size</h3>
        <ProgressBar variant="organisational" size="large" value={90} showLabel={true} label="Progress" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Without Labels</h3>
        <ProgressBar variant="viewable" value={60} showLabel={false} />
      </div>
    </div>
  ),
};
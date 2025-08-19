import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './Footer';

const meta = {
  title: 'CanonCore/Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Footer component displaying version information and copyright notice'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default footer with version display
 */
export const Default: Story = {
  args: {}
};

/**
 * Footer with custom styling
 */
export const CustomStyling: Story = {
  args: {
    className: 'bg-gray-50'
  }
};
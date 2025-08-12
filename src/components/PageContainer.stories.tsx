import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageContainer } from './PageContainer';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageContainer> = {
  title: 'CanonCore/PageContainer',
  component: PageContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['wide', 'narrow'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Wide: Story = {
  args: {
    variant: 'wide',
    children: (
      <div>
        <PageHeader
          variant="dashboard"
          title="Dashboard Page"
          description="Wide container for dashboard and detail pages"
        />
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <p className="text-gray-600">
            This is a wide container (max-w-7xl) used for dashboard pages, detail pages, and content that needs more space.
          </p>
        </div>
      </div>
    ),
  },
};

export const Narrow: Story = {
  args: {
    variant: 'narrow',
    children: (
      <div>
        <PageHeader
          variant="form"
          title="Form Page"
          description="Narrow container for form pages"
        />
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <p className="text-gray-600">
            This is a narrow container (max-w-2xl) used for form pages where content should be focused and not too wide.
          </p>
        </div>
      </div>
    ),
  },
};

export const WithContent: Story = {
  args: {
    variant: 'wide',
    children: (
      <div className="space-y-6">
        <PageHeader
          variant="dashboard"
          title="Marvel Cinematic Universe"
          description="Manage and track your progress through the Marvel franchise"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-900 mb-2">Card {i}</h3>
              <p className="text-gray-600 text-sm">Track your progress through Marvel Phase {i} movies and series.</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const FormLayout: Story = {
  args: {
    variant: 'narrow',
    children: (
      <div>
        <PageHeader
          variant="form"
          title="Create New Item"
          description="Form layout with narrow container"
        />
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Marvel Cinematic Universe, Doctor Who, Star Wars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe this franchise universe and what content you plan to catalogue..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save</button>
            </div>
          </form>
        </div>
      </div>
    ),
  },
};
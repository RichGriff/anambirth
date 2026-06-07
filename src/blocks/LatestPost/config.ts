import { backgroundColorField } from '@/fields/backgroundColor'
import type { Block } from 'payload'

export const LatestPost: Block = {
  slug: 'latestPost',
  interfaceName: 'LatestPost',
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of posts',
      defaultValue: 3,
      min: 1,
      max: 12,
      required: true,
    },
    backgroundColorField(),
  ],
  labels: {
    singular: 'Latest Post',
    plural: 'Latest Posts',
  },
}

import { backgroundColorField } from '@/fields/backgroundColor'
import { Block } from 'payload'

export const FeaturedQuote: Block = {
  slug: 'featuredQuote',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'source',
      type: 'text',
    },
    backgroundColorField(),
  ],
}

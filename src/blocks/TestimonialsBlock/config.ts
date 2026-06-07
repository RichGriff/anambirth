import { backgroundColorField } from '@/fields/backgroundColor'
import { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonialBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
    backgroundColorField(),
  ],
}

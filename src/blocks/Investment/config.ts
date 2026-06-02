import { Block } from 'payload'

export const Investment: Block = {
  slug: 'investment',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'investments',
      type: 'relationship',
      relationTo: 'investments',
      hasMany: true,
      required: true,
    },
  ],
}

import { Block } from 'payload'

export const EyebrowHeading: Block = {
  slug: 'eyebrowHeading',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
      required: true,
    },
  ],
}

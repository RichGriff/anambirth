import { Block } from 'payload'

export const Footnotes: Block = {
  slug: 'footnotes',
  fields: [
    {
      name: 'footnotes',
      type: 'array',
      label: 'Footnotes',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Footnote Text',
        },
      ],
    },
  ],
}

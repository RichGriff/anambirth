import { backgroundColorField } from '@/fields/backgroundColor'
import { linkGroup } from '@/fields/linkGroup'
import { Block } from 'payload'

export const Philosophy: Block = {
  slug: 'philosophy',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    backgroundColorField(),
    linkGroup({
      appearances: false,
      overrides: {
        maxRows: 1,
        label: 'Learn More Link',
      },
    }),
    {
      name: 'principles',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
      minRows: 0,
      maxRows: 6,
    },
  ],
}

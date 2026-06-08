import { backgroundColorField } from '@/fields/backgroundColor'
import { Block } from 'payload'

export const Accreditation: Block = {
  slug: 'accreditation',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@/blocks/Accreditation/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    backgroundColorField(),
  ],
}

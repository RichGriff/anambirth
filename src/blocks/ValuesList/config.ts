import { Block } from 'payload'

export const ValuesList: Block = {
  slug: 'valuesList',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'values',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
  ],
}

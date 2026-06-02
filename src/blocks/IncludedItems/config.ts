import { Block } from 'payload'

import { defaultIncludedItemIcon, includedItemIconOptions } from './icons'

export const IncludedItems: Block = {
  slug: 'includedItems',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: defaultIncludedItemIcon,
          options: [...includedItemIconOptions],
          required: true,
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

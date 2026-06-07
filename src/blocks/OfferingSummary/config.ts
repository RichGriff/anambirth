import { linkGroup } from '@/fields/linkGroup'
import { backgroundColorField } from '@/fields/backgroundColor'
import { Block } from 'payload'

export const OfferingSummary: Block = {
  slug: 'offeringSummary',
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
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'priceFrom',
          label: 'Price from',
          type: 'number',
          min: 0,
        },
        linkGroup({
          appearances: false,
          overrides: {
            maxRows: 1,
          },
        }),
      ],
      minRows: 2,
      maxRows: 4,
    },
    backgroundColorField(),
  ],
}

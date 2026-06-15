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
      admin: {
        components: {
          RowLabel: '@/blocks/OfferingSummary/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'offering',
          type: 'relationship',
          relationTo: 'offerings',
          validate: (
            value: unknown,
            { siblingData }: { siblingData?: { title?: string | null } },
          ) => {
            if (value || siblingData?.title) {
              return true
            }

            return 'Select an offering.'
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            condition: () => false,
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            condition: () => false,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            condition: () => false,
          },
        },
        {
          name: 'priceFrom',
          label: 'Price from',
          type: 'number',
          min: 0,
          admin: {
            condition: () => false,
          },
        },
        {
          name: 'sectionAnchor',
          type: 'text',
          admin: {
            condition: () => false,
          },
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

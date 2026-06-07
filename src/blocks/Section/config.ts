import { backgroundColorField } from '@/fields/backgroundColor'
import { Block } from 'payload' // import the Block type from 'payload'

export const Section: Block = {
  // export a constant called Section with the Block type assigned to it
  slug: 'section', // we'll name this block 'section'
  fields: [
    {
      type: 'blocks',
      name: 'column',
      label: 'Columns',
      blocks: [],
      blockReferences: ['column'],
      required: true,
      minRows: 1,
      admin: {
        description:
          'Add one or more columns, then choose each column width and its content blocks.',
        initCollapsed: true,
      },
    },
    backgroundColorField({
      includeBrandColors: true,
    }),
    {
      name: 'showDivider',
      type: 'checkbox',
      label: 'Show Divider',
      defaultValue: false,
    },
  ],
}

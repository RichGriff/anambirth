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
    {
      name: 'bg',
      type: 'select', // and will have the select type
      label: 'Background Color', // and will have a label of 'Background Color' to make it clear what it's for
      options: [
        { value: 'bg-primary', label: 'Primary Color' },
        { value: 'bg-secondary', label: 'Secondary Color' },
        { value: 'bg-black', label: 'Black' },
        { value: 'bg-light', label: 'Light' },
        { value: 'bg-lighter', label: 'Lighter' },
        { value: 'bg-dark', label: 'Dark' },
        { value: 'bg-white', label: 'White' },
      ],
      defaultValue: 'bg-white',
      required: true,
    },
    {
      name: 'showDivider',
      type: 'checkbox',
      label: 'Show Divider',
      defaultValue: false,
    },
  ],
}

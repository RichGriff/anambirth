import { Block } from 'payload' // import the Block type from 'payload'

export const Column: Block = {
  // export a constant called Column with the Block type assigned to it
  slug: 'column', // we'll call our column block 'column'
  fields: [
    {
      type: 'blocks',
      name: 'content',
      label: 'Content Blocks',
      blocks: [],
      blockReferences: [
        'textBlock',
        'eyebrowHeading',
        'investment',
        'footnotes',
        'invitationList',
        'includedItems',
        'faq',
        'image',
        'valuesList',
        'cta',
      ],
      required: true,
      minRows: 1,
      admin: {
        description: 'Choose the content blocks for this column.',
        initCollapsed: true,
      },
    },
    {
      type: 'select',
      name: 'columnWidth',
      required: true,
      label: 'Column Width',
      options: [
        { label: 'Full Width', value: 'auto' },
        { label: '80%', value: '4/5' },
        { label: '75%', value: '3/4' },
        { label: '66%', value: '2/3' },
        { label: '50%', value: '1/2' },
        { label: '33%', value: '1/3' },
        { label: '25%', value: '1/4' },
        { label: '20%', value: '1/5' },
      ],
      defaultValue: 'auto',
    },
  ],
}

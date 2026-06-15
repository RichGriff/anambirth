import { backgroundColorField } from '@/fields/backgroundColor'
import {
  BlockquoteFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
  AlignFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TextOnly: Block = {
  slug: 'textOnly',
  interfaceName: 'TextOnly',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'anchorId',
      type: 'text',
      admin: {
        description: 'Optional section anchor for direct links, for example "philosophy".',
      },
    },
    {
      name: 'textWidth',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Standard', value: 'standard' },
        { label: 'Wide', value: 'wide' },
      ],
      required: true,
    },
    {
      name: 'textColumns',
      type: 'select',
      label: 'Text Columns',
      defaultValue: '1',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          UnorderedListFeature(),
          OrderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          BlockquoteFeature(),
          AlignFeature(),
        ],
      }),
    },
    backgroundColorField(),
  ],
}

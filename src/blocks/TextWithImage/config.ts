import { backgroundColorField } from '@/fields/backgroundColor'
import {
  AlignFeature,
  BlockquoteFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TextWithImage: Block = {
  slug: 'textWithImage',
  interfaceName: 'TextWithImage',
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
        description: 'Optional section anchor for direct links, for example "story".',
      },
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
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      required: true,
    },
    {
      name: 'imageStyle',
      type: 'select',
      defaultValue: 'portrait',
      options: [
        { label: 'Portrait', value: 'portrait' },
        { label: 'Square', value: 'square' },
        { label: 'Landscape', value: 'landscape' },
      ],
      required: true,
    },
    backgroundColorField(),
  ],
}

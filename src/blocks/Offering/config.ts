import { backgroundColorField } from '@/fields/backgroundColor'
import {
  BlockquoteFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  lexicalEditor,
  AlignFeature,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const Offering: Block = {
  slug: 'offering',
  interfaceName: 'Offering',
  fields: [
    {
      name: 'eyebrowHeading',
      type: 'text',
    },
    {
      name: 'mainHeading',
      type: 'text',
      required: true,
    },
    {
      name: 'anchorId',
      type: 'text',
      admin: {
        description: 'Optional section anchor for direct links, for example "postpartum".',
      },
    },
    {
      name: 'subHeading',
      type: 'text',
    },
    {
      name: 'details',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlockquoteFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          AlignFeature(),
        ],
      }),
    },
    {
      name: 'whatsIncluded',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              UnorderedListFeature(),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    {
      name: 'investment',
      type: 'group',
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
          name: 'items',
          type: 'relationship',
          relationTo: 'investments',
          hasMany: true,
        },
      ],
    },
    {
      name: 'footnotes',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    backgroundColorField(),
  ],
}

import { backgroundColorField } from '@/fields/backgroundColor'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const Checklist: Block = {
  slug: 'checklist',
  interfaceName: 'Checklist',
  fields: [
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
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'card',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'Plain', value: 'plain' },
      ],
      required: true,
    },
    {
      name: 'items',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          UnorderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    backgroundColorField(),
  ],
}

import { Block } from 'payload'
import {
  BlockquoteFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Text: Block = {
  slug: 'textBlock',
  fields: [
    {
      type: 'richText',
      name: 'text',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            UnorderedListFeature(),
            OrderedListFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            BlockquoteFeature(),
          ]
        },
      }),
    },
  ],
}

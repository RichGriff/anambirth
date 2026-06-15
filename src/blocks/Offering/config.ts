import { backgroundColorField } from '@/fields/backgroundColor'
import {
  AlignFeature,
  BlockquoteFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const Offering: Block = {
  slug: 'offering',
  interfaceName: 'OfferingBlock',
  fields: [
    {
      name: 'offering',
      type: 'relationship',
      relationTo: 'offerings',
      admin: {
        description: 'Select the offering document to render in this section.',
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { mainHeading?: string | null } },
      ) => {
        if (value || siblingData?.mainHeading) {
          return true
        }

        return 'Select an offering.'
      },
    },
    {
      name: 'eyebrowHeading',
      type: 'text',
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'mainHeading',
      type: 'text',
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'anchorId',
      type: 'text',
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'subHeading',
      type: 'text',
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'details',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlockquoteFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          AlignFeature(),
        ],
      }),
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'whatsIncluded',
      type: 'group',
      admin: {
        condition: () => false,
      },
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
      admin: {
        condition: () => false,
      },
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
      admin: {
        condition: () => false,
      },
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

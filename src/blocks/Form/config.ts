import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { backgroundColorField } from '@/fields/backgroundColor'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introEyebrowHeading',
      type: 'text',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      label: 'Intro Eyebrow Heading',
    },
    {
      name: 'introHeading',
      type: 'text',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      label: 'Intro Heading',
    },
    {
      name: 'introDescription',
      type: 'text',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      label: 'Intro Description',
    },
    {
      name: 'introList',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
        },
      ],
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      label: 'Intro List',
    },
    backgroundColorField(),
    // {
    //   name: 'introContent',
    //   type: 'richText',
    //   admin: {
    //     condition: (_, { enableIntro }) => Boolean(enableIntro),
    //   },
    //   editor: lexicalEditor({
    //     features: ({ rootFeatures }) => {
    //       return [
    //         ...rootFeatures,
    //         HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    //         FixedToolbarFeature(),
    //         InlineToolbarFeature(),
    //       ]
    //     },
    //   }),
    //   label: 'Intro Content',
    // },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}

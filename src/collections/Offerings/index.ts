import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import {
  AlignFeature,
  BlockquoteFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { revalidateOfferings, revalidateOfferingsDelete } from './hooks/revalidateOfferings'

export const Offerings: CollectionConfig = {
  slug: 'offerings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['mainHeading', 'eyebrowHeading', 'updatedAt'],
    useAsTitle: 'mainHeading',
  },
  hooks: {
    afterChange: [revalidateOfferings],
    afterDelete: [revalidateOfferingsDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'summaryDescription',
              type: 'textarea',
              admin: {
                description:
                  'Optional summary copy for offering cards. If left empty, the summary card uses the first three body sections from the offering details.',
              },
            },
          ],
        },
      ],
    },
  ],
}

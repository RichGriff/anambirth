import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import {
  revalidateTestimonials,
  revalidateTestimonialsDelete,
} from './hooks/revalidateTestimonials'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'quote', 'paymentOption', 'oneOffCost', 'monthlyCost', 'updatedAt'],
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [revalidateTestimonials],
    afterDelete: [revalidateTestimonialsDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      admin: {
        description: 'This could be business, service, social link, etc.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

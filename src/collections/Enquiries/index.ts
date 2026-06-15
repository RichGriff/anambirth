import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Enquiries: CollectionConfig<'enquiries'> = {
  slug: 'enquiries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Contacted',
          value: 'contacted',
        },
        {
          label: 'Booked',
          value: 'booked',
        },
        {
          label: 'Declined',
          value: 'declined',
        },
      ],
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'journey',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'details',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'formSubmissionID',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'submissionData',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'textarea',
        },
      ],
    },
  ],
  timestamps: true,
}

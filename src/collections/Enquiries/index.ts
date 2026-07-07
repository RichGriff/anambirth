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
    defaultColumns: ['name', 'status', 'priority', 'nextFollowUpDate', 'archived', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
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
      name: 'priority',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'medium',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
      ],
      required: true,
    },
    {
      name: 'nextFollowUpDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      label: 'Archived',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  admin: {
                    readOnly: true,
                    width: '50%',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    readOnly: true,
                    width: '50%',
                  },
                  label: 'Email address',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phoneNumber',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'preferredContactMethod',
                  type: 'select',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: 'Email',
                      value: 'email',
                    },
                    {
                      label: 'Phone',
                      value: 'phone',
                    },
                    {
                      label: 'Text',
                      value: 'text',
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dueDateOrBirthMonth',
                  type: 'text',
                  admin: {
                    description: 'For example: Due 12 Aug 2026 or Baby due in September.',
                    width: '50%',
                  },
                  label: 'Due date / birth month',
                },
                {
                  name: 'source',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'notes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Form',
          fields: [
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'formSubmissionID',
              type: 'number',
              admin: {
                readOnly: true,
              },
              label: 'Form Submission ID',
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
          ],
        },
      ],
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Investments: CollectionConfig = {
  slug: 'investments',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'paymentOption', 'oneOffCost', 'monthlyCost', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'paymentOption',
      type: 'select',
      defaultValue: 'oneOff',
      options: [
        {
          label: 'One Off',
          value: 'oneOff',
        },
        {
          label: 'Monthly',
          value: 'monthly',
        },
      ],
      required: true,
    },
    {
      name: 'oneOffCost',
      type: 'number',
      min: 0,
      admin: {
        condition: (_, siblingData) => siblingData?.paymentOption === 'oneOff',
      },
    },
    {
      name: 'monthlyCost',
      type: 'number',
      min: 0,
      admin: {
        condition: (_, siblingData) => siblingData?.paymentOption === 'monthly',
      },
    },
    {
      name: 'monthlyCommitmentMonths',
      type: 'number',
      min: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.paymentOption === 'monthly',
      },
    },
  ],
}

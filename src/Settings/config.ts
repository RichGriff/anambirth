import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Site',
          fields: [
            {
              name: 'siteName',
              type: 'text',
            },
            {
              label: 'Header Logo',
              name: 'headerLogo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              label: 'Footer Logo',
              name: 'footerLogo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              type: 'group',
              name: 'adminLogos',
              label: 'Admin Logos',
              fields: [
                {
                  name: 'lightModeIcon',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'darkModeIcon',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'lightModeLogo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'darkModeLogo',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: 'Posts',
          fields: [
            {
              type: 'group',
              name: 'postPageHeading',
              label: 'Page Heading',
              fields: [
                {
                  name: 'eyebrowHeading',
                  type: 'text',
                },
                {
                  name: 'mainHeading',
                  type: 'text',
                },
                {
                  name: 'subHeading',
                  type: 'textarea',
                },
              ],
            },
            {
              type: 'group',
              name: 'postPageMeta',
              label: 'Page SEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Custom title used for /posts metadata.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Custom description used for /posts metadata.',
                  },
                },
                {
                  name: 'image',
                  label: 'Social Share Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Used as the Open Graph/Twitter image for /posts.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

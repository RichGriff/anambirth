import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Investments } from './collections/Investments'
import { Offerings } from './collections/Offerings'
import { Testimonials } from './collections/Testimonials'
import { Enquiries } from './collections/Enquiries'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { FAQ } from './blocks/FAQ/config'
import { Image } from './blocks/Image/config'
import { CallToAction } from './blocks/CallToAction/config'
import { OfferingSummary } from './blocks/OfferingSummary/config'
import { TestimonialsBlock } from './blocks/TestimonialsBlock/config'
import { Philosophy } from './blocks/Philosophy/config'
import { LatestPost } from './blocks/LatestPost/config'
import { Settings } from './Settings/config'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { FeaturedQuote } from './blocks/FeaturedQuote/config'
import { Accreditation } from './blocks/Accreditation/config'
import { TextOnly } from './blocks/TextOnly/config'
import { TextWithImage } from './blocks/TextWithImage/config'
import { Checklist } from './blocks/Checklist/config'
import { MusicTracks } from './collections/MusicTracks'
import { analyticsEndpoint } from './endpoints/analytics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    dashboard: {
      defaultLayout: [
        {
          widgetSlug: 'collections',
          width: 'full',
        },
        {
          widgetSlug: 'analytics-summary',
          width: 'full',
        },
      ],
      widgets: [
        {
          slug: 'analytics-summary',
          Component: '@/components/Dashboard/Analytics',
          minWidth: 'medium',
          maxWidth: 'full',
        },
      ],
    },
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeDashboard: ['@/components/BeforeDashboard'],
      graphics: {
        Logo: '/graphics/Logo/index.tsx#Logos',
        Icon: '/graphics/Icon/index.tsx#Icons',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Posts, Investments, Offerings, Media, Categories, Users, Testimonials, MusicTracks, Enquiries],
  blocks: [
    FAQ,
    Image,
    CallToAction,
    OfferingSummary,
    TestimonialsBlock,
    Philosophy,
    LatestPost,
    FeaturedQuote,
    Accreditation,
    TextOnly,
    TextWithImage,
    Checklist,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  endpoints: [analyticsEndpoint],
  globals: [Header, Footer, Settings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'hello@anambirth.com',
    defaultFromName: 'Anam Birth',
    transportOptions: {
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})

import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const url: string = getServerSideURL()
  const productionURL = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined
  const allowIndexing = process.env.ALLOW_INDEXING
  const isProductionDeployment =
    allowIndexing === 'true'
      ? true
      : allowIndexing === 'false'
        ? false
        : process.env.APP_ENV === 'production' ||
          process.env.VERCEL_ENV === 'production' ||
          (Boolean(productionURL) && process.env.NEXT_PUBLIC_SERVER_URL === productionURL)

  if (!isProductionDeployment) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/admin',
      },
      { userAgent: ['Bingbot', 'SemrushBot'], disallow: '/' },
    ],
    sitemap: `${url}/sitemap.xml`,
  }
}

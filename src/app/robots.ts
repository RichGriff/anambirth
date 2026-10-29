import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import { isIndexingEnabled } from '@/utilities/isIndexingEnabled'

export default function robots(): MetadataRoute.Robots {
  const url = getServerSideURL().replace(/\/$/, '')

  if (!isIndexingEnabled()) {
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

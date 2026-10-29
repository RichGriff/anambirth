import { getServerSideSitemapIndex } from 'next-sitemap'

import { getServerSideURL } from '@/utilities/getURL'
import { isIndexingEnabled } from '@/utilities/isIndexingEnabled'

export async function GET() {
  if (!isIndexingEnabled()) {
    return new Response(null, { status: 404 })
  }

  const siteURL = getServerSideURL().replace(/\/$/, '')

  return getServerSideSitemapIndex([
    `${siteURL}/pages-sitemap.xml`,
    `${siteURL}/posts-sitemap.xml`,
  ])
}

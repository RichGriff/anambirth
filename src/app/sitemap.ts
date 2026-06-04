import type { MetadataRoute } from 'next'
import { BasePayload, getPayload, PaginatedDocs } from 'payload'
import config from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import { Page, Post } from '@/payload-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    return []
  }

  const payload: BasePayload = await getPayload({ config })

  // Fetch all posts
  const posts: PaginatedDocs<Post> = await payload.find({
    collection: 'posts',
    limit: 0,
    where: {},
  })

  const pages: PaginatedDocs<Page> = await payload.find({
    collection: 'pages',
    limit: 0,
    where: {},
  })

  // Define the base URL dynamically
  const url: string = getServerSideURL()

  // Return structured sitemap data
  return [
    ...posts.docs
      .filter(({ slug }: { slug: string | null | undefined }) => Boolean(slug))
      .map(({ slug, updatedAt }: { slug: string | null | undefined; updatedAt: string }) => ({
        url: `${url}/${slug}`,
        lastModified: new Date(updatedAt),
      })),
    ...pages.docs
      .filter(({ slug }: { slug: string | null | undefined }) => Boolean(slug))
      .map(({ slug, updatedAt }: { slug: string | null | undefined; updatedAt: string }) => ({
        url: `${url}/${slug}`,
        lastModified: new Date(updatedAt),
      })),
  ]
}

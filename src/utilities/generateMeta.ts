import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { defaultMetaDescription, defaultSocialImagePath, mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    const url = ogUrl ?? image.url

    if (!url) return `${serverUrl}${defaultSocialImagePath}`

    // Already absolute (S3, CDN, etc.)
    if (url.startsWith('http')) return url

    return `${serverUrl}${url}`
  }

  return `${serverUrl}${defaultSocialImagePath}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  pathname: string
}): Promise<Metadata> => {
  const { doc, pathname } = args

  const ogImage = getImageURL(doc?.meta?.image)
  const canonicalURL = new URL(pathname, `${getServerSideURL()}/`).toString()
  const excerpt = doc && 'excerpt' in doc ? doc.excerpt : undefined

  const title = doc?.meta?.title || doc?.title || 'Anam Birth'
  const description = doc?.meta?.description || excerpt || defaultMetaDescription

  return {
    alternates: {
      canonical: canonicalURL,
    },
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
      title,
      url: canonicalURL,
    }),
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [ogImage],
      title,
    },
  }
}

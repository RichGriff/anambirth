import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'
import { getDocumentPath } from './getDocumentPath'

type Props = {
  collection: Extract<CollectionSlug, 'pages' | 'posts'>
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const encodedParams = new URLSearchParams({
    path: getDocumentPath({ collection, slug: encodeURIComponent(slug) }),
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}

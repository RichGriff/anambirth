import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getDocumentPath } from '@/utilities/getDocumentPath'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, permanentRedirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      permanentRedirect(redirectItem.to.url)
    }

    let redirectUrl = ''
    const collection = redirectItem.to?.reference?.relationTo

    if (
      (collection === 'pages' || collection === 'posts') &&
      (typeof redirectItem.to?.reference?.value === 'string' ||
        typeof redirectItem.to?.reference?.value === 'number')
    ) {
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, String(id))()) as Page | Post
      redirectUrl = getDocumentPath({ collection, slug: document?.slug })
    } else if (collection === 'pages' || collection === 'posts') {
      redirectUrl = getDocumentPath({
        collection,
        slug:
          typeof redirectItem.to?.reference?.value === 'object'
            ? redirectItem.to?.reference?.value?.slug
            : '',
      })
    }

    if (redirectUrl) permanentRedirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}

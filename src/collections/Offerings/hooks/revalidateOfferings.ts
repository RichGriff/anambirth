import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { type BasePayload } from 'payload'

import type { Offering, Page } from '../../../payload-types'

type PageWithOfferingBlocks = Pick<Page, 'slug' | 'content'>

const pageReferencesOffering = (page: PageWithOfferingBlocks, offeringID: number) => {
  return (page.content || []).some((block) => {
    if (block.blockType === 'offering') {
      return block.offering === offeringID
    }

    if (block.blockType === 'offeringSummary') {
      return (block.items || []).some((item) => item.offering === offeringID)
    }

    return false
  })
}

const revalidatePublishedPages = async (payload: BasePayload, offeringID: number) => {
  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      content: true,
      slug: true,
    },
  })

  const matchedPages = (pages.docs as PageWithOfferingBlocks[]).filter((page) =>
    pageReferencesOffering(page, offeringID),
  )

  for (const page of matchedPages) {
    const path = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(path)
    revalidateTag(`page_${page.slug}`, 'max')
  }

  payload.logger.info(
    `Revalidated ${matchedPages.length} published pages after offering change: ${offeringID}`,
  )
}

export const revalidateOfferings: CollectionAfterChangeHook<Offering> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    await revalidatePublishedPages(payload, doc.id)
  }

  return doc
}

export const revalidateOfferingsDelete: CollectionAfterDeleteHook<Offering> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    await revalidatePublishedPages(payload, doc.id)
  }

  return doc
}

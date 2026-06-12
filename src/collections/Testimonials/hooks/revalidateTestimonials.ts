import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { type BasePayload } from 'payload'

import type { Page, Testimonial } from '../../../payload-types'

type PageWithTestimonialBlocks = Pick<Page, 'slug' | 'content'>

const pageReferencesTestimonial = (page: PageWithTestimonialBlocks, testimonialID: number) => {
  return (page.content || []).some((block) => {
    if (block.blockType !== 'testimonialBlock') {
      return false
    }

    return (block.testimonials || []).some((testimonial) => testimonial === testimonialID)
  })
}

const revalidatePublishedPages = async (payload: BasePayload, testimonialID: number) => {
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

  const matchedPages = (pages.docs as PageWithTestimonialBlocks[]).filter((page) =>
    pageReferencesTestimonial(page, testimonialID),
  )

  for (const page of matchedPages) {
    const path = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(path)
    revalidateTag(`page_${page.slug}`, 'max')
  }

  payload.logger.info(
    `Revalidated ${matchedPages.length} published pages after testimonial change: ${testimonialID}`,
  )
}

export const revalidateTestimonials: CollectionAfterChangeHook<Testimonial> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    await revalidatePublishedPages(payload, doc.id)
  }

  return doc
}

export const revalidateTestimonialsDelete: CollectionAfterDeleteHook<Testimonial> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    await revalidatePublishedPages(payload, doc.id)
  }

  return doc
}

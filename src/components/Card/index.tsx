'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { hero } from '@/heros/config'
import { ImageIcon, MoveRightIcon } from 'lucide-react'

const publishedDateFormat = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})

export type CardPostData = Pick<
  Post,
  | 'slug'
  | 'categories'
  | 'meta'
  | 'title'
  | 'heroImage'
  | 'excerpt'
  | 'guestBlog'
  | 'publishedAt'
  | 'guestBlogUrl'
>

export const Card: React.FC<{
  index?: number
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  block?: boolean
  title?: string
  excerpt?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    excerpt: excerptFromProps,
    index,
    block,
  } = props

  const {
    slug,
    categories,
    meta,
    title,
    heroImage,
    excerpt,
    guestBlog,
    publishedAt,
    guestBlogUrl,
  } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const excerptToUse = excerptFromProps || excerpt
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const defaultHref = `/${relationTo}/${slug}`
  const href = guestBlog ? (guestBlogUrl ?? defaultHref) : defaultHref
  const isFeatured = index === 0

  return (
    <Link href={href} ref={link.ref} target={guestBlog ? '_blank' : '_self'}>
      <article
        className={cn(
          // 'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
          className,
          isFeatured && 'md:grid md:grid-cols-12 md:gap-x-8 md:items-center md:mb-32',
          'hover:-translate-y-2 transition-transform duration-600 ease-in-out hover:cursor-pointer',
        )}
        ref={card.ref}
      >
        <div className={cn('relative w-full', isFeatured && 'md:col-span-7')}>
          {guestBlog && (
            <span className="absolute top-4 right-4 bg-accent border border-accent text-accent-foreground px-3 py-1 rounded-full text-xs uppercase">
              Guest Blog
            </span>
          )}
          {!heroImage && (
            <div className="flex justify-center items-center bg-accent/10 min-h-112 max-h-112 rounded-lg w-full">
              <ImageIcon className="size-10 text-accent" />
            </div>
          )}
          {heroImage && typeof heroImage !== 'string' && (
            <Media
              resource={heroImage}
              size="33vw"
              imgClassName={`object-cover ${block ? 'min-h-[20rem] max-h-[20rem]' : 'min-h-[28rem] max-h-[28rem]'} rounded-lg`}
            />
          )}
        </div>
        <div className={cn('py-4', isFeatured && 'md:col-span-5 md:py-0')}>
          {showCategories && hasCategories && (
            <div className="uppercase text-xs mb-1">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <div key={index} className="text-accent inline-block">
                      {categoryTitle}
                      {!isLast && <span>, &nbsp;</span>}
                    </div>
                  )
                }

                return null
              })}
            </div>
          )}
          {titleToUse && (
            <div className="prose">
              <h3
                className={cn(
                  'font-(family-name:--font-cormorant)  font-light leading-tight text-foreground',
                  isFeatured ? 'text-4xl' : 'text-3xl',
                )}
              >
                {titleToUse}
                {/* <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link> */}
              </h3>
            </div>
          )}
          {excerptToUse && (
            <div
              className={`my-6 leading-relaxed text-muted-foreground lg:mx-0 mx-auto w-full ${!isFeatured ? 'line-clamp-3' : 'line-clamp-6'}`}
            >
              {excerptToUse && <p>{excerptToUse}</p>}
            </div>
          )}
          {publishedAt && (
            <div className="text-sm text-muted-foreground">
              {publishedDateFormat.format(new Date(publishedAt))}
            </div>
          )}
          {/* <Link href={href} ref={link.ref}>
            <p className="text-xs text-accent uppercase hover:underline">Read Story</p>
          </Link> */}
        </div>
      </article>
    </Link>
  )
}

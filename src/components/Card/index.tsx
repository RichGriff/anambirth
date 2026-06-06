'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { hero } from '@/heros/config'
import { MoveRightIcon } from 'lucide-react'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'heroImage'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, heroImage } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        // 'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!heroImage && <div className="">No image</div>}
        {heroImage && typeof heroImage !== 'string' && (
          <Media
            resource={heroImage}
            size="33vw"
            imgClassName="object-cover min-h-[28rem] max-h-[28rem] rounded-lg"
          />
        )}
      </div>
      <div className="py-4">
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
            <h3 className="font-(family-name:--font-cormorant) text-3xl font-light leading-tight text-foreground">
              {titleToUse}
              {/* <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link> */}
            </h3>
          </div>
        )}
        {description && (
          <div className="my-6 leading-relaxed text-foreground lg:mx-0 mx-auto w-full">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
        <p className="text-xs text-accent uppercase">Read Story</p>
      </div>
    </article>
  )
}

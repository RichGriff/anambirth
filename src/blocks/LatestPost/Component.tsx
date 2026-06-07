import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { MoveRightIcon } from 'lucide-react'
import { SectionBackground } from '../Section/SectionBackground'
import { BackgroundColorValue } from '@/fields/backgroundColor'

type LatestPostProps = {
  heading?: string | null
  limit?: number | null
  tagline?: string | null
  bg: BackgroundColorValue
}

export const LatestPost = async ({ heading, limit = 3, tagline, bg }: LatestPostProps) => {
  const payload = await getPayload({ config: configPromise })

  const latestPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: limit || 3,
    sort: '-publishedAt',
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      excerpt: true,
      guestBlog: true,
      publishedAt: true,
      guestBlogUrl: true,
    },
  })

  const posts = latestPosts.docs as CardPostData[]

  if (!posts?.length) return null

  return (
    <SectionBackground bg={bg} className="px-2">
      <div className="container py-3 md:py-6">
        <div className="flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex flex-col">
            {tagline && (
              <div className="uppercase text-xs text-accent mb-2 flex justify-start items-start gap-2">
                {tagline}
              </div>
            )}

            {heading && (
              <div className="mb-2">
                <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
                  {heading}
                </h2>
              </div>
            )}
          </div>
          <Link
            href="/posts"
            className="text-sm text-primary hover:text-accent hover:underline flex items-center gap-1"
          >
            View All
            <MoveRightIcon size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts.map((post, index) => {
            if (typeof post === 'object' && post !== null) {
              return (
                <div className="col-span-4" key={post.slug || index}>
                  <Card
                    className="h-full text-muted-foreground"
                    doc={post}
                    relationTo="posts"
                    showCategories
                    block
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </SectionBackground>
  )
}

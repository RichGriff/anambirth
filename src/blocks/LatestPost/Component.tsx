import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { MoveRightIcon } from 'lucide-react'

type LatestPostProps = {
  heading?: string | null
  limit?: number | null
  tagline?: string | null
}

export const LatestPost = async ({ heading, limit = 3, tagline }: LatestPostProps) => {
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
      publishedAt: true,
    },
  })

  const posts = latestPosts.docs as CardPostData[]

  if (!posts?.length) return null

  return (
    <section className="bg-[#FCF9F2] pb-8 pt-20">
      <div className={cn('container pb-16')}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {tagline && (
              <div className="uppercase text-xs text-accent mb-2 flex justify-start items-start gap-2">
                {tagline}
              </div>
            )}

            {heading && (
              <div className="mb-8">
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
    </section>
  )
}

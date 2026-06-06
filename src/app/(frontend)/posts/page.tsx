import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
    },
  })

  return (
    <div className="">
      <PageClient />

      <div className="bg-[#FCF9F2]">
        <div className="container w-full flex flex-col justify-center items-center text-center min-h-[calc(100svh-24rem)]">
          <div className="max-w-3xl mb-12">
            <div className="uppercase text-xs text-accent mb-4 flex justify-center items-center gap-2">
              Storytelling & Reflection
            </div>
            <h1 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground text-balance">
              The Journel
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0 mx-auto w-full">
              A sacred space for sharing stories of birth, transition, and wholeness. Here, we honor
              the raw edges and the radiant moments of the human experience.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div> */}

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Anam Birth Posts`,
  }
}

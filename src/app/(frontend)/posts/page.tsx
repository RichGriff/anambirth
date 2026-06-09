import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { generateMeta } from '@/utilities/generateMeta'
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
      subTitle: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      excerpt: true,
      guestBlog: true,
      publishedAt: true,
      guestBlogUrl: true,
    },
    sort: '-publishedAt',
  })

  const postHeading = await payload.findGlobal({
    slug: 'settings',
    depth: 1,
    overrideAccess: true,
    select: {
      postPageHeading: true,
    },
  })

  return (
    <div className="">
      <PageClient />

      <div className="bg-[#FCF9F2]">
        <div className="container w-full flex flex-col justify-center items-center text-center min-h-[calc(100svh-24rem)]">
          <div className="max-w-3xl mb-12">
            <div className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
              {postHeading?.postPageHeading?.eyebrowHeading || 'Storytelling & Reflection'}
            </div>
            <h1 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground text-balance">
              {postHeading?.postPageHeading?.mainHeading || 'Blog & Stories'}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0 mx-auto w-full">
              {postHeading?.postPageHeading?.subHeading ||
                'A sacred space for sharing stories of birth, transition, and wholeness. Here, we honor the raw edges and the radiant moments of the human experience.'}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div> */}

      <div className="bg-[#F6F3EC] py-8">
        {/* <div className="container">
          <PageRange
            collection="posts"
            currentPage={posts.page}
            limit={12}
            totalDocs={posts.totalDocs}
          />
        </div> */}

        <CollectionArchive posts={posts.docs} />

        <div className="container">
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const settings = (await payload.findGlobal({
    slug: 'settings',
    depth: 1,
    overrideAccess: true,
  })) as any

  const baseTitle = settings?.postPageMeta?.title || 'Anam Birth Posts'

  return generateMeta({
    doc: {
      slug: 'posts',
      meta: {
        title: baseTitle,
        description: settings?.postPageMeta?.description,
        image: settings?.postPageMeta?.image,
      },
    } as any,
  })
}

import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Separator } from '@radix-ui/react-select'
import Image from 'next/image'
import { Media } from '@/components/Media'
import { BookmarkIcon, Share2Icon, User2Icon } from 'lucide-react'
import ShareButton from '@/components/ui/share-button'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    depth: 3,
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8 pb-16 bg-[#F6F3EC]">
        <div className="container">
          {/* <RichText className="max-w-3xl mx-auto" data={post.content} enableGutter={false} /> */}
          {!post.guestBlog && post.content && (
            <RichText className="max-w-3xl mx-auto" data={post.content} enableGutter={false} />
          )}

          <div className="mx-auto mt-12 mb-8 h-px max-w-3xl bg-primary/10" />

          <div className="max-w-3xl mx-auto flex justify-between items-start text-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {post.populatedAuthors?.[0]?.avatar ? (
                <Media
                  className=""
                  imgClassName="w-10 h-10 rounded-full bg-primary/10 mx-auto ring-2 ring-offset-4 ring-accent"
                  priority
                  resource={post.populatedAuthors?.[0]?.avatar}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 mx-auto ring-2 ring-offset-4 ring-accent flex justify-center items-center">
                  <User2Icon className="size-5 text-primary mx-auto" />
                </div>
              )}

              <div className="flex flex-col justify-start items-left text-left">
                <div className="font-medium text-foreground">
                  Written by {post.populatedAuthors?.[0]?.name || 'Unknown'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Published on{' '}
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                        dateStyle: 'long',
                      })
                    : 'Unknown'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <div className="font-medium text-foreground bg-accent/10 hover:bg-accent/30 hover:cursor-pointer p-2 rounded-full flex items-center gap-2">
                <Share2Icon className="size-5 text-primary" />
              </div> */}
              <ShareButton
                title={post.meta?.title || 'Check out this post!'}
                text={post.meta?.description ?? ''}
                className="font-medium text-primary! bg-accent/10 hover:bg-accent/30 hover:cursor-pointer p-2 rounded-full flex items-center gap-2"
              />
              <div className="font-medium text-foreground bg-accent/10 hover:bg-accent/30 hover:cursor-pointer p-2 rounded-full flex items-center gap-2">
                <BookmarkIcon className="size-5 text-primary" />
              </div>
            </div>
          </div>

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-208 lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

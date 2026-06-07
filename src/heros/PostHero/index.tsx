import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="bg-[#FCF9F2]">
      <div className="container w-full flex flex-col justify-center items-center text-center min-h-[calc(100svh-24rem)]">
        <div className="max-w-3xl mb-12">
          <div className="uppercase text-xs text-accent mb-4 flex justify-center items-center gap-2">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <div key={index} className="rounded-full border border-accent py-1 px-3">
                    {titleToUse}
                  </div>
                )
              }
              return null
            })}
          </div>
          {title && (
            <h1 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground text-balance">
              {title}
            </h1>
          )}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0 mx-auto w-full">
            Exploring the emotional and spiritual landscape of labor as a rite of passage, and how
            to hold space for yourself during the transition.
          </p>
        </div>
        {heroImage && typeof heroImage !== 'string' && (
          <div className="relative min-h-auto md:min-h-[70vh] max-w-6xl select-none mb-2 md:mb-8">
            <Media
              className=""
              alt={title || 'Post hero image'}
              // imgClassName="object-cover object-middle h-[300px] md:h-[400px] 2xl:h-[500px] rounded-t-4xl"
              imgClassName="object-cover object-middle h-[300px] sm:h-[600px] rounded-3xl z-10"
              priority
              resource={heroImage}
            />
            <div className="rounded-3xl absolute pointer-events-none left-0 top-0 w-full h-75 sm:h-150 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        )}
      </div>
    </div>
    // <div className="relative mt-[-10.4rem] flex items-end bg-primary">
    //   <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
    //     <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
    //       <div className="uppercase text-sm mb-6">
    //         {categories?.map((category, index) => {
    //           if (typeof category === 'object' && category !== null) {
    //             const { title: categoryTitle } = category

    //             const titleToUse = categoryTitle || 'Untitled category'

    //             const isLast = index === categories.length - 1

    //             return (
    //               <React.Fragment key={index}>
    //                 {titleToUse}
    //                 {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
    //               </React.Fragment>
    //             )
    //           }
    //           return null
    //         })}
    //       </div>

    //       <div className="">
    //         <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
    //       </div>

    //       <div className="flex flex-col md:flex-row gap-4 md:gap-16">
    //         {hasAuthors && (
    //           <div className="flex flex-col gap-4">
    //             <div className="flex flex-col gap-1">
    //               <p className="text-sm">Author</p>

    //               <p>{formatAuthors(populatedAuthors)}</p>
    //             </div>
    //           </div>
    //         )}
    //         {publishedAt && (
    //           <div className="flex flex-col gap-1">
    //             <p className="text-sm">Date Published</p>

    //             <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="relative min-h-[80vh] select-none">
    //     {heroImage && typeof heroImage !== 'string' && (
    //       <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
    //     )}
    //     <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
    //   </div>
    // </div>
  )
}

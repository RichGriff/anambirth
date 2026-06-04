import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  eyebrowHeading,
  heading,
  subHeading,
}) => {
  return (
    <div className="bg-primary py-20">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 mb-12 justify-center items-center">
          <div className="mb-8">
            {eyebrowHeading && (
              <div className="mb-4 flex items-center text-sm uppercase tracking-[0.3em] text-foreground-light before:mr-3 before:block before:h-px before:w-8 before:bg-current">
                {eyebrowHeading}
              </div>
            )}
            {heading && (
              <h1 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground-light text-balance">
                {heading}
              </h1>
            )}
            {subHeading && (
              <h2 className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground-light md:text-xl lg:mx-0">
                {subHeading}
              </h2>
            )}
            {/* {richText && <RichText className="mb-6" data={richText} enableGutter={false} />} */}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex gap-4">
                {links.map(({ link }, i) => {
                  return (
                    // <li key={i}>
                    //   <CMSLink {...link} />
                    // </li>
                    <div key={i} className="mt-8">
                      <Button asChild size="lg" className="rounded-full px-8">
                        <CMSLink {...link} className="" />
                      </Button>
                    </div>
                  )
                })}
              </ul>
            )}
          </div>
          <div className="justify-end">
            {media && typeof media === 'object' && (
              <div>
                <Media
                  className=""
                  // imgClassName="object-cover object-middle h-[300px] md:h-[400px] 2xl:h-[500px] rounded-t-4xl"
                  imgClassName="object-cover object-middle h-[300px] sm:h-[600px] rounded-3xl z-10"
                  priority
                  resource={media}
                />
                {media?.caption && (
                  <div className="mt-3">
                    <RichText data={media.caption} enableGutter={false} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

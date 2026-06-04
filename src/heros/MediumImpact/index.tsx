import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { InViewFade, StaggerInViewList, StaggerListItem } from '@/components/animations/InView'
import { Button } from '@/components/ui/button'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  eyebrowHeading,
  heading,
  subHeading,
}) => {
  return (
    <div className="bg-primary py-20 px-2 sm:px-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 mb-12 justify-center items-center">
          <div className="mb-8">
            {eyebrowHeading && (
              <InViewFade>
                <div className="mb-4 flex items-center text-sm uppercase tracking-[0.3em] text-foreground-light before:mr-3 before:block before:h-px before:w-8 before:bg-current">
                  {eyebrowHeading}
                </div>
              </InViewFade>
            )}
            {heading && (
              <InViewFade delay={0.04}>
                <h1 className="font-(family-name:--font-cormorant) text-5xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground-light text-balance">
                  {heading}
                </h1>
              </InViewFade>
            )}
            {subHeading && (
              <InViewFade delay={0.08}>
                <h2 className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground-light md:text-xl lg:mx-0">
                  {subHeading}
                </h2>
              </InViewFade>
            )}
            {/* {richText && <RichText className="mb-6" data={richText} enableGutter={false} />} */}

            {Array.isArray(links) && links.length > 0 && (
              <StaggerInViewList
                className="flex gap-4"
                delayChildren={0.12}
                staggerChildren={0.1}
                mobileStaggerChildren={0.06}
              >
                {links.map(({ link }, i) => {
                  return (
                    <StaggerListItem key={i} className="mt-8">
                      <Button asChild size="lg" className="rounded-full px-8">
                        <CMSLink {...link} className="" />
                      </Button>
                    </StaggerListItem>
                  )
                })}
              </StaggerInViewList>
            )}
          </div>
          <div className="justify-end">
            {media && typeof media === 'object' && (
              <InViewFade delay={0.12} duration={0.5} distance={16}>
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
              </InViewFade>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

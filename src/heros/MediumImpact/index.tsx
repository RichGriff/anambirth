import React from 'react'
import { MoveRightIcon } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { InViewFade, StaggerInViewList, StaggerListItem } from '@/components/animations/InView'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  eyebrowHeading,
  heading,
  subHeading,
}) => {
  return (
    <div className="bg-primary py-20 px-2 sm:px-0 md:bg-[radial-gradient(120%_120%_at_0%_100%,color-mix(in_oklab,var(--color-accent)_40%,transparent)_0%,transparent_58%)]">
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
                className="flex flex-wrap items-center gap-4"
                delayChildren={0.12}
                staggerChildren={0.1}
                mobileStaggerChildren={0.06}
              >
                {links.map(({ link }, i) => {
                  const appearance = link.appearance ?? (i === 0 ? 'default' : 'link')
                  const isSecondaryLink = appearance === 'link'

                  return (
                    <StaggerListItem key={i} className="mt-8 flex items-center">
                      <CMSLink
                        {...link}
                        appearance={appearance}
                        className={
                          isSecondaryLink
                            ? 'h-11 px-1 text-foreground-light/80 hover:text-foreground-light hover:no-underline [&_svg]:transition-transform hover:[&_svg]:translate-x-1'
                            : 'rounded-full px-8'
                        }
                        size={isSecondaryLink ? undefined : 'lg'}
                      >
                        {isSecondaryLink && <MoveRightIcon />}
                      </CMSLink>
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

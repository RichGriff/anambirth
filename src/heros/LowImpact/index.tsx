import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'

export const LowImpactHero: React.FC<Page['hero']> = ({
  eyebrowHeading,
  heading,
  subHeading,
  links,
}) => {
  return (
    <div className="bg-[#FCF9F2]">
      <div className="container w-full flex flex-col justify-center items-center text-center py-12 sm:py-24">
        <div className="max-w-3xl">
          {eyebrowHeading && (
            <div className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">
              {eyebrowHeading}
            </div>
          )}
          {heading && (
            <h1 className="font-(family-name:--font-cormorant) text-5xl font-light leading-tight tracking-tight lg:text-6xl text-foreground text-balance">
              {heading}
            </h1>
          )}
          {subHeading && (
            <h2 className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0 mx-auto w-full">
              {subHeading}
            </h2>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="mt-8 flex justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <Button asChild size="lg" className="rounded-full px-8">
                      <CMSLink {...link} />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className="mx-auto mt-16 h-px w-24 bg-primary/30" />
      </div>
    </div>
  )
}

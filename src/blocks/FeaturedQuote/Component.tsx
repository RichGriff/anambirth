import React from 'react'

import type { FeaturedQuote as FeaturedQuoteProps } from '@/payload-types'
import { SectionBackground } from '../Section/SectionBackground'

export const FeaturedQuote: React.FC<FeaturedQuoteProps> = ({ quote, author, source, bg }) => {
  return (
    <SectionBackground
      bg={bg}
      className="relative px-6 overflow-hidden bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklab,var(--color-accent)_40%,transparent)_0%,transparent_58%)]"
    >
      <img
        alt={'Anam Birth Logo'}
        width={400}
        height={34}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        className="hidden md:block h-auto absolute -top-40 -left-28 opacity-5"
        src={'/logo-icon-dark.svg'}
      />
      <div className="mx-auto max-w-5xl py-8">
        <blockquote className="font-(family-name:--font-cormorant) text-2xl md:text-2xl lg:text-3xl italic text-left md:text-center mb-4">
          "{quote}"
        </blockquote>
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-center text-sm uppercase tracking-[0.3em] md:before:mr-3 md:before:block md:before:h-px md:before:w-8 md:before:bg-current">
          {author} &middot; <span className="text-accent ml-1">{source}</span>
        </div>
      </div>
    </SectionBackground>
  )
}

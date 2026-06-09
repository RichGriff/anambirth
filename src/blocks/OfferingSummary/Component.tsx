import React from 'react'
import Link from 'next/link'
import { ArrowRight, MoveRightIcon } from 'lucide-react'

import type { OfferingSummary as OfferingSummaryProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { InViewFade, StaggerInView, StaggerItem } from '@/components/animations/InView'
import { formatAnchor } from '@/utilities/anchors'
import { SectionBackground } from '../Section/SectionBackground'

type OfferingSummaryLink = NonNullable<
  NonNullable<OfferingSummaryProps['items']>[number]['links']
>[number]['link']

const getHref = (link: OfferingSummaryLink, sectionAnchor?: string | null) => {
  const anchor = formatAnchor(sectionAnchor)

  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
  ) {
    const href = `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${link.reference.value.slug}`

    return anchor ? `${href}#${anchor}` : href
  }

  const href = link.url || ''

  if (!anchor || !href || href.includes('#')) {
    return href
  }

  return `${href}#${anchor}`
}

export const OfferingSummary: React.FC<OfferingSummaryProps> = ({
  heading,
  description,
  items,
  bg,
}) => {
  return (
    <SectionBackground bg={bg} className="px-6">
      <div className="mx-auto max-w-6xl pb-12">
        <div className="text-center">
          <InViewFade>
            <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{description}</p>
          </InViewFade>
        </div>

        {items && (
          <StaggerInView staggerChildren={0.12} className="mt-16 grid gap-8 md:grid-cols-3">
            {items.map((item, index) => (
              <StaggerItem
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30"
              >
                <div className="mb-4">
                  <h3 className="font-(family-name:--font-cormorant) text-3xl font-light text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm italic text-accent">{item.subtitle}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-light text-muted-foreground letter-spacing-wide">
                      Investment
                    </span>
                    <p className="font-(family-name:--font-cormorant) text-2xl font-medium text-foreground">
                      From £{item.priceFrom}
                    </p>
                  </div>
                  {item.links?.[0]?.link && (
                    <Button
                      asChild
                      variant="secondary"
                      size="icon"
                      className="rounded-full flex justify-center items-center"
                    >
                      <Link href={getHref(item.links[0].link, item.sectionAnchor)}>
                        {/* Learn more
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /> */}
                        <MoveRightIcon className="h-5 w-5 text-foreground-light transition-transform" />
                      </Link>
                    </Button>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerInView>
        )}
      </div>
    </SectionBackground>
  )
}

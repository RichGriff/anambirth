import React from 'react'
import Link from 'next/link'
import { MoveRightIcon } from 'lucide-react'

import type { Investment, Offering, OfferingSummary as OfferingSummaryProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { InViewFade, StaggerInView, StaggerItem } from '@/components/animations/InView'
import { formatAnchor } from '@/utilities/anchors'
import { isPopulatedRelationship } from '@/utilities/isPopulatedRelationship'
import { SectionBackground } from '../Section/SectionBackground'

type OfferingSummaryLink = NonNullable<
  NonNullable<OfferingSummaryProps['items']>[number]['links']
>[number]['link']

const getFromPrice = (offering: Offering) => {
  const investments = (offering.investment?.items || []).filter(isPopulatedRelationship<Investment>)
  const prices = investments
    .map((investment) =>
      investment.paymentOption === 'monthly' ? investment.monthlyCost : investment.oneOffCost,
    )
    .filter((price): price is number => typeof price === 'number')

  if (prices.length === 0) {
    return null
  }

  return Math.min(...prices)
}

const getHref = (link: OfferingSummaryLink, anchorId?: string | null) => {
  const anchor = formatAnchor(anchorId)

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
            {items.map((item, index) => {
              const selectedOffering = isPopulatedRelationship<Offering>(item.offering)
                ? item.offering
                : null
              const title = selectedOffering?.mainHeading ?? item.title
              const subtitle = selectedOffering?.subHeading ?? item.subtitle
              const summary = selectedOffering
                ? selectedOffering.summaryDescription?.trim() || null
                : item.description
              const anchorId = selectedOffering?.anchorId ?? item.sectionAnchor
              const priceFrom = selectedOffering
                ? getFromPrice(selectedOffering)
                : (item.priceFrom ?? null)

              if (!title) {
                return null
              }

              return (
                <StaggerItem
                  key={selectedOffering?.id ?? item.id ?? index}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30"
                >
                  <div className="mb-4">
                    <h3 className="font-(family-name:--font-cormorant) text-3xl font-light text-foreground">
                      {title}
                    </h3>
                    {subtitle && <p className="mt-1 text-sm italic text-accent">{subtitle}</p>}
                  </div>
                  <div className="min-h-32">
                    {summary && <p className="text-muted-foreground leading-relaxed">{summary}</p>}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-light text-muted-foreground letter-spacing-wide">
                        Investment
                      </span>
                      <p className="font-(family-name:--font-cormorant) text-2xl font-medium text-foreground">
                        {priceFrom === null ? 'Pricing on request' : `From £${priceFrom}`}
                      </p>
                    </div>
                    {item.links?.[0]?.link && (
                      <Button
                        asChild
                        variant="secondary"
                        size="icon"
                        className="rounded-full flex justify-center items-center"
                      >
                        <Link href={getHref(item.links[0].link, anchorId)}>
                          <MoveRightIcon className="h-5 w-5 text-foreground-light transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerInView>
        )}
      </div>
    </SectionBackground>
  )
}

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { OfferingSummary as OfferingSummaryProps } from '@/payload-types'
import { Button } from '@/components/ui/button'

type OfferingSummaryLink = NonNullable<
  NonNullable<OfferingSummaryProps['items']>[number]['links']
>[number]['link']

const getHref = (link: OfferingSummaryLink) => {
  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
  ) {
    return `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${link.reference.value.slug}`
  }

  return link.url || ''
}

export const OfferingSummary: React.FC<OfferingSummaryProps> = ({
  heading,
  description,
  items,
}) => {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{description}</p>
        </div>

        {items && (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30"
              >
                <div className="mb-4">
                  <h3 className="font-(family-name:--font-cormorant) text-2xl font-light text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm italic text-primary">{item.subtitle}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    From £{item.priceFrom}
                  </span>
                  {item.links?.[0]?.link && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 hover:bg-background"
                    >
                      <Link href={getHref(item.links[0].link)}>
                        Learn more
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

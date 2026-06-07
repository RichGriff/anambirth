import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Philosophy as PhilosophyProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { InViewFade } from '@/components/animations/InView'
import { SectionBackground } from '../Section/SectionBackground'

export const Philosophy: React.FC<PhilosophyProps> = ({
  heading,
  subtitle,
  links,
  principles,
  bg,
}) => {
  const aboutLink = links?.[0]?.link

  return (
    <SectionBackground bg={bg} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <InViewFade className="mb-16 text-center">
          <h2 className="font-(family-name:--font-cormorant) text-4xl font-light md:text-5xl text-foreground">
            {heading}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          )}
          {aboutLink && (
            <div className="mt-8 group">
              <Button asChild variant="link">
                <Link
                  href={
                    aboutLink.type === 'custom'
                      ? aboutLink.url || ''
                      : aboutLink.type === 'reference' &&
                          typeof aboutLink.reference?.value === 'object' &&
                          aboutLink.reference.value.slug
                        ? `/${aboutLink.reference.relationTo !== 'pages' ? `${aboutLink.reference.relationTo}/` : ''}${aboutLink.reference.value.slug}`
                        : ''
                  }
                >
                  {aboutLink.label || 'Read More'}{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          )}
        </InViewFade>

        {Array.isArray(principles) && principles.length > 0 && (
          <div className="mt-16">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle, index) => (
                <InViewFade
                  key={index}
                  delay={(index % 3) * 0.04}
                  amount={0.7}
                  className="relative flex flex-col p-2 text-center items-center justify-start sm:items-start sm:justify-start sm:text-left"
                >
                  {principle.image && (
                    <div className="mb-4 h-16 w-16">
                      <Media
                        resource={principle.image}
                        fill
                        className="relative h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="mb-3 font-(family-name:--font-cormorant) text-3xl font-light text-foreground">
                    {principle.title}
                  </h3>
                  {principle.description && (
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  )}
                </InViewFade>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionBackground>
  )
}

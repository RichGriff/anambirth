import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Philosophy as PhilosophyProps } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'

export const Philosophy: React.FC<PhilosophyProps> = ({ heading, subtitle, links, principles }) => {
  const aboutLink = links?.[0]?.link

  return (
    <section className="px-6 py-24 bg-secondary">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-(family-name:--font-cormorant) text-4xl font-light md:text-5xl text-foreground">
            {heading}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          )}
          {aboutLink && (
            <div className="mt-8">
              <Button asChild variant="outline">
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
                  {aboutLink.label || 'Read More'} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Principles List */}
        {principles && principles.length > 0 && (
          <div className="mt-16">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle, index) => (
                <div key={index} className="relative p-2 flex flex-col items-start justify-start">
                  {principle.image && (
                    <div className="w-16 h-16 mb-4">
                      <Media
                        resource={principle.image}
                        fill
                        className="relative h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-(family-name:--font-cormorant) text-2xl font-light text-foreground mb-3">
                    {principle.title}
                  </h3>
                  {principle.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {principle.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

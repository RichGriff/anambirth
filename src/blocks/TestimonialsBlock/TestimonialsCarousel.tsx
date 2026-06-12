'use client'

import * as React from 'react'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import type { Testimonial } from '@/payload-types'
import { cn } from '@/utilities/ui'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon, User2Icon } from 'lucide-react'

type TestimonialsCarouselProps = {
  testimonials: Testimonial[]
}

export const TestimonialsCarousel = ({ testimonials }: TestimonialsCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: testimonials.length > 1,
  })
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  React.useEffect(() => {
    if (!emblaApi) {
      return
    }

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()

    emblaApi.on('reInit', () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      onSelect()
    })
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <div className="mt-16">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id ?? index} className="min-w-0 shrink-0 grow-0 basis-full pl-4">
              <div className="mx-auto max-w-4xl px-8 py-6 md:px-10 md:py-8 flex justify-center items-center">
                <blockquote className="relative flex flex-col items-center text-center">
                  <p className="text-lg leading-relaxed text-muted-foreground italic md:text-xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-8 flex gap-3 pt-2">
                    {testimonial.avatar ? (
                      <Media
                        imgClassName="h-[48px] w-[48px] rounded-full object-cover object-middle"
                        resource={testimonial.avatar}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User2Icon className="size-6 text-primary" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.shortDescription}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            aria-label="Show previous testimonial"
            className="rounded-full"
            onClick={() => emblaApi?.scrollPrev()}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to testimonial ${index + 1}`}
                className={cn(
                  'h-2.5 w-2.5 rounded-full bg-primary/20 transition-colors hover:bg-primary/40',
                  index === selectedIndex && 'bg-primary',
                )}
                onClick={() => emblaApi?.scrollTo(index)}
                type="button"
              />
            ))}
          </div>

          <Button
            aria-label="Show next testimonial"
            className="rounded-full"
            onClick={() => emblaApi?.scrollNext()}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

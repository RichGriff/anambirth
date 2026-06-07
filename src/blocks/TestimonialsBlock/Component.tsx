import { Media } from '@/components/Media'
import { InViewFade, StaggerInView, StaggerItem } from '@/components/animations/InView'
import type { TestimonialBlock as TestimonialsBlockProps } from '@/payload-types'
import { isPopulatedRelationship } from '@/utilities/isPopulatedRelationship'
import { User2Icon } from 'lucide-react'
import { SectionBackground } from '../Section/SectionBackground'

export const TestimonialsBlock = (props: TestimonialsBlockProps) => {
  const { heading, description, testimonials, bg } = props
  const selectedTestimonials = (testimonials || []).filter(isPopulatedRelationship)

  return (
    <SectionBackground bg={bg} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <InViewFade className="text-center">
          <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground italic">{description}</p>
        </InViewFade>

        {selectedTestimonials.length > 0 && (
          <StaggerInView className="mt-16 grid gap-8 md:grid-cols-3" staggerChildren={0.12}>
            {selectedTestimonials.map((testimonial, index) => (
              <StaggerItem key={index} className="relative rounded-2xl bg-card p-8">
                <blockquote className="relative">
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex justify-start items-center gap-3">
                    {testimonial.avatar ? (
                      <Media
                        className=""
                        imgClassName="object-cover object-middle h-[42px] w-[42px] rounded-full z-10"
                        priority
                        resource={testimonial.avatar}
                      />
                    ) : (
                      <div className="h-10.5 w-10.5 rounded-full bg-primary/10 flex justify-center items-center">
                        <User2Icon className="size-6 text-primary" />
                      </div>
                    )}
                    <div className="">
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.offering}</p>
                    </div>
                  </footer>
                </blockquote>
              </StaggerItem>
            ))}
          </StaggerInView>
        )}
      </div>
    </SectionBackground>
  )
}

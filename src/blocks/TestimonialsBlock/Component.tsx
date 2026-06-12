import { InViewFade } from '@/components/animations/InView'
import type { TestimonialBlock as TestimonialsBlockProps } from '@/payload-types'
import { isPopulatedRelationship } from '@/utilities/isPopulatedRelationship'
import { SectionBackground } from '../Section/SectionBackground'
import { TestimonialsCarousel } from './TestimonialsCarousel'

export const TestimonialsBlock = (props: TestimonialsBlockProps) => {
  const { heading, description, testimonials, bg } = props
  const selectedTestimonials = (testimonials || []).filter(isPopulatedRelationship)

  return (
    <SectionBackground bg={bg} showDivider className="px-6">
      <div className="mx-auto max-w-5xl">
        <InViewFade className="text-center">
          <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl text-foreground">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground italic">{description}</p>
        </InViewFade>

        {selectedTestimonials.length > 0 && <TestimonialsCarousel testimonials={selectedTestimonials} />}
      </div>
    </SectionBackground>
  )
}

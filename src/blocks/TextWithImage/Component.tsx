import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { InViewFade } from '@/components/animations/InView'
import type { TextWithImage as TextWithImageProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { SectionBackground } from '../Section/SectionBackground'

const imageStyleVariants = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
} as const

export const TextWithImage = ({
  eyebrow,
  heading,
  intro,
  anchorId,
  body,
  image,
  caption,
  imagePosition = 'right',
  imageStyle = 'portrait',
  bg,
}: TextWithImageProps) => {
  return (
    <SectionBackground id={anchorId || undefined} bg={bg} className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <InViewFade className={cn('order-2', imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1')}>
          {eyebrow && <p className="mb-4 text-xs uppercase tracking-[0.24em] text-accent">{eyebrow}</p>}
          <h2 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight text-foreground md:text-5xl">
            {heading}
          </h2>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}

          <div className="mt-8">
            <RichText className="max-w-none" data={body} enableGutter={false} />
          </div>
        </InViewFade>

        <InViewFade
          delay={0.05}
          className={cn('order-1', imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2')}
        >
          <div className="overflow-hidden rounded-2xl bg-card/60">
            <Media
              resource={image}
              imgClassName={cn(
                'h-full w-full object-cover',
                imageStyleVariants[imageStyle ?? 'portrait'],
              )}
            />
          </div>

          {caption && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{caption}</p>}
        </InViewFade>
      </div>
    </SectionBackground>
  )
}

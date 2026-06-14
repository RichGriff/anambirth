import { InViewFade } from '@/components/animations/InView'
import RichText from '@/components/RichText'
import type { Checklist as ChecklistProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { SectionBackground } from '../Section/SectionBackground'

export const Checklist = ({ heading, intro, displayStyle = 'card', items, bg }: ChecklistProps) => {
  const isCard = displayStyle !== 'plain'

  return (
    <SectionBackground bg={bg} className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className={cn(isCard && 'rounded-2xl bg-card p-8 md:p-12')}>
          <InViewFade>
            <h2 className="font-(family-name:--font-cormorant) text-3xl font-light leading-tight text-foreground md:text-4xl">
              {heading}
            </h2>
            {intro && (
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {intro}
              </p>
            )}
          </InViewFade>

          <div className="mt-8">
            <RichText
              className="max-w-none"
              data={items}
              enableGutter={false}
              listVariant="checklist"
            />
          </div>
        </div>
      </div>
    </SectionBackground>
  )
}

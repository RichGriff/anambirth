import type { ValuesList as ValuesListProps } from '@/payload-types'
import { InViewFade, StaggerInViewList, StaggerListItem } from '@/components/animations/InView'
import { BadgeCheckIcon } from 'lucide-react'

export const ValuesList = (props: ValuesListProps) => {
  const { title, values } = props

  return (
    <div className="container">
      <div className="rounded-2xl bg-card p-8 md:p-12">
        <InViewFade>
          <h3 className="mb-8 font-(family-name:--font-cormorant) text-2xl font-medium text-foreground md:text-3xl">
            {title}
          </h3>
        </InViewFade>

        <StaggerInViewList className="grid gap-6 md:grid-cols-2" staggerChildren={0.1}>
          {values &&
            values.map((item, i) => (
              <StaggerListItem key={i} className="flex gap-4 text-muted-foreground items-start">
                <BadgeCheckIcon className="size-5 shrink-0 mt-1 text-accent" />
                <span className="text-muted-foreground leading-relaxed">{item.value}</span>
              </StaggerListItem>
            ))}
        </StaggerInViewList>
      </div>
    </div>
  )
}

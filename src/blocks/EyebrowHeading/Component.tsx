import type { EyebrowHeading as EyebrowHeadingProps } from '@/payload-types'
import { HeartIcon } from 'lucide-react'

export const EyebrowHeading: React.FC<EyebrowHeadingProps> = ({ eyebrow, heading, subheading }) => {
  return (
    <div className="container">
      {eyebrow && (
        <div className="max-w-5xl">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-6">
            {/* {(() => {
              const Icon = iconMap[doulaCompanioningContent.icon]
              return <Icon className="h-3 w-3" />
            })()} */}
            <HeartIcon className="size-3" />
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight md:text-5xl text-foreground">
        {heading}
      </h2>

      <p className="mt-4 font-(family-name:--font-cormorant) text-xl italic text-muted-foreground">
        {subheading}
      </p>
    </div>
  )
}

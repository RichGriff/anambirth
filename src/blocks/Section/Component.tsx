import type { Section as SectionProps } from '@/payload-types'
import { Column } from '../Column/Component'

type LegacySectionShape = {
  column?: SectionProps extends { column?: infer T } ? T : never
  bg?: 'bg-primary' | 'bg-secondary' | 'bg-black' | 'bg-white' | null
}

type SectionShape = SectionProps & {
  columns?: SectionProps extends { columns?: infer T }
    ? T
    : SectionProps extends { column?: infer U }
      ? U
      : never
  backgroundColor?: 'primary' | 'secondary' | 'black' | 'white' | null
}

export const Section = (props: SectionProps) => {
  const { columns, backgroundColor, showDivider } = props as SectionShape
  const legacy = props as SectionProps & LegacySectionShape
  const resolvedColumns = columns ?? legacy.column

  const bgColorVariants = {
    primary: 'bg-background text-black',
    secondary: 'bg-blue-50 text-blue-950',
    black: 'bg-gray-800 text-gray-50',
    white: 'bg-secondary text-gray-950',
  }

  const legacyBg = legacy.bg ? legacy.bg.replace('bg-', '') : undefined
  const resolvedBackground =
    backgroundColor ?? (legacyBg as keyof typeof bgColorVariants | undefined) ?? 'white'

  return (
    <section className={`${bgColorVariants[resolvedBackground]} py-8`}>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start lg:px-8">
          {resolvedColumns?.map((column) => (
            <Column key={column.id} {...column} />
          ))}
        </div>
      </div>
      {showDivider && <div className="mx-auto h-px w-full max-w-xs bg-border mt-26" />}
    </section>
  )
}

import type { Section as SectionProps } from '@/payload-types'
import { Column } from '../Column/Component'
import { SectionBackground } from './SectionBackground'

export const Section = (props: SectionProps) => {
  const { column, bg, showDivider } = props

  return (
    <SectionBackground bg={bg} showDivider={showDivider}>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start lg:px-8">
          {column?.map((column) => (
            <Column key={column.id} {...column} />
          ))}
        </div>
      </div>
    </SectionBackground>
  )
}

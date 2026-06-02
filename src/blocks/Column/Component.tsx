import type { Column as ColumnProps } from '@/payload-types'
import { RenderBlocks } from '../RenderBlocks'

export const Column = (props: ColumnProps) => {
  const { columnWidth, content } = props // we only need columnWidth and content from our props

  const basisVariant = {
    auto: 'lg:basis-full',
    '4/5': 'lg:basis-4/5',
    '3/4': 'lg:basis-3/4',
    '2/3': 'lg:basis-2/3',
    '1/2': 'lg:basis-1/2',
    '1/3': 'lg:basis-1/3',
    '1/4': 'lg:basis-1/4',
    '1/5': 'lg:basis-1/5',
  }

  return (
    <div
      className={`flex w-full flex-col basis-full ${basisVariant[columnWidth]} p-4 my-4 lg:my-3`}
    >
      <RenderBlocks blocks={content} />
    </div>
  )
}

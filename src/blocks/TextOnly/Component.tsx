import RichText from '@/components/RichText'
import { InViewFade } from '@/components/animations/InView'
import type { TextOnly as TextOnlyProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { SectionBackground } from '../Section/SectionBackground'

const textWidthVariants = {
  narrow: 'max-w-3xl',
  standard: 'max-w-5xl',
  wide: 'max-w-6xl',
} as const

const splitEditorStateIntoColumns = (
  data: DefaultTypedEditorState,
  requestedColumns: number,
): DefaultTypedEditorState[] => {
  const children = data.root.children ?? []

  if (requestedColumns <= 1 || children.length <= 1) {
    return [data]
  }

  const chunks: typeof children[] = []
  let startIndex = 0
  let remainingChildren = children.length

  for (let columnIndex = 0; columnIndex < requestedColumns && startIndex < children.length; columnIndex++) {
    const remainingColumns = requestedColumns - columnIndex
    const chunkSize = Math.ceil(remainingChildren / remainingColumns)
    const endIndex = startIndex + chunkSize

    chunks.push(children.slice(startIndex, endIndex))
    startIndex = endIndex
    remainingChildren = children.length - startIndex
  }

  return chunks.map((chunk) => ({
    ...data,
    root: {
      ...data.root,
      children: chunk,
    },
  }))
}

export const TextOnly = ({
  eyebrow,
  heading,
  intro,
  anchorId,
  textWidth = 'narrow',
  textColumns = '1',
  body,
  bg,
}: TextOnlyProps) => {
  const columnCount = Number(textColumns ?? '1')
  const columnStates = splitEditorStateIntoColumns(body, columnCount)

  return (
    <SectionBackground id={anchorId || undefined} bg={bg} className="px-6 py-24">
      <div className={cn('mx-auto', textWidthVariants[textWidth ?? 'narrow'])}>
        <InViewFade>
          {eyebrow && (
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
          )}
          <h2 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight text-foreground md:text-5xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
          )}
        </InViewFade>

        <InViewFade delay={0.05} className="mt-8">
          {columnCount <= 1 || columnStates.length === 1 ? (
            <RichText className="max-w-none" data={body} enableGutter={false} />
          ) : (
            <div
              className={cn('grid gap-8 lg:gap-10', {
                'lg:grid-cols-2': columnCount === 2,
                'lg:grid-cols-3': columnCount === 3,
              })}
            >
              {columnStates.map((columnState, index) => (
                <RichText key={index} className="max-w-none" data={columnState} enableGutter={false} />
              ))}
            </div>
          )}
        </InViewFade>
      </div>
    </SectionBackground>
  )
}

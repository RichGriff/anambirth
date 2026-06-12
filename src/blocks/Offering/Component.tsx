import RichText from '@/components/RichText'
import { InViewFade, StaggerInViewList, StaggerListItem } from '@/components/animations/InView'
import type { Offering as OfferingProps } from '@/payload-types'
import { formatAnchor } from '@/utilities/anchors'
import { isPopulatedRelationship } from '@/utilities/isPopulatedRelationship'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { HeartIcon, SparklesIcon } from 'lucide-react'

import { SectionBackground } from '../Section/SectionBackground'

const splitDetailsIntoColumns = (details: DefaultTypedEditorState, columnCount: number) => {
  const children = details.root.children ?? []

  if (columnCount <= 1 || children.length <= 1) {
    return {
      leftColumn: details,
      rightColumn: null,
    }
  }

  const splitIndex = Math.ceil(children.length / columnCount)

  const createColumnState = (columnChildren: typeof children): DefaultTypedEditorState => ({
    ...details,
    root: {
      ...details.root,
      children: columnChildren,
    },
  })

  const rightColumnChildren = children.slice(splitIndex)

  return {
    leftColumn: createColumnState(children.slice(0, splitIndex)),
    rightColumn: rightColumnChildren.length > 0 ? createColumnState(rightColumnChildren) : null,
  }
}

export const Offering: React.FC<OfferingProps> = ({
  eyebrowHeading,
  mainHeading,
  anchorId,
  subHeading,
  details,
  whatsIncluded,
  investment,
  footnotes,
  bg,
}) => {
  const selectedInvestments = (investment?.items || []).filter(isPopulatedRelationship)
  const safeFootnotes = footnotes || []
  const { leftColumn, rightColumn } = splitDetailsIntoColumns(details, 2)
  const sectionId = formatAnchor(anchorId)

  const renderPriceLabel = (option: (typeof selectedInvestments)[number]) => {
    if (option.paymentOption === 'monthly') {
      if (typeof option.monthlyCost === 'number') {
        const totalCost =
          typeof option.monthlyCommitmentMonths === 'number'
            ? option.monthlyCost * option.monthlyCommitmentMonths
            : null

        return (
          <>
            £{option.monthlyCost}
            <span className="text-sm font-serif text-muted-foreground"> /month</span>
            {typeof totalCost === 'number' && (
              <span className="text-sm font-serif text-muted-foreground">
                {' '}
                • £{totalCost} total
              </span>
            )}
          </>
        )
      }

      return 'Monthly amount not set'
    }

    if (typeof option.oneOffCost === 'number') {
      return `£${option.oneOffCost}`
    }

    return 'One-off amount not set'
  }

  const investmentGridCols =
    {
      1: 'grid-cols-1 sm:grid-cols-2',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[Math.min(selectedInvestments.length, 4)] ?? 'grid-cols-1'

  return (
    <SectionBackground id={sectionId || undefined} bg={bg} className="px-6">
      <div className="mx-auto max-w-6xl">
        <InViewFade>
          <div>
            {eyebrowHeading && (
              <div className="flex items-center gap-2">
                <HeartIcon className="h-4 w-4 text-primary" />
                <p className="text-xs uppercase tracking-[0.2em] text-primary">{eyebrowHeading}</p>
              </div>
            )}

            <h2 className="mt-3 max-w-4xl font-(family-name:--font-cormorant) text-4xl font-light text-foreground md:text-5xl">
              {mainHeading}
            </h2>

            {subHeading && (
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{subHeading}</p>
            )}
          </div>
        </InViewFade>

        <InViewFade delay={0.06}>
          <div className="mt-10 lg:hidden">
            <RichText
              className="max-w-none"
              data={details}
              enableGutter={false}
              listVariant="offering"
            />
          </div>

          <div className="mt-10 hidden items-start gap-8 lg:grid lg:grid-cols-2 lg:gap-12">
            <RichText
              className="max-w-none"
              data={leftColumn}
              enableGutter={false}
              listVariant="offering"
            />

            {rightColumn && rightColumn.root.children.length > 0 && (
              <RichText
                className="max-w-none"
                data={rightColumn}
                enableGutter={false}
                listVariant="offering"
              />
            )}
          </div>
        </InViewFade>

        {safeFootnotes.length > 0 && (
          <StaggerInViewList
            className="mt-8 space-y-3 text-sm text-muted-foreground"
            staggerChildren={0.06}
          >
            {safeFootnotes.map((footnote, index) => (
              <StaggerListItem
                key={footnote.id ?? index}
                className="flex items-center gap-2 list-none"
              >
                <SparklesIcon className="h-4 w-4 shrink-0 text-accent" />
                {footnote.text}
              </StaggerListItem>
            ))}
          </StaggerInViewList>
        )}

        <div className="mt-12 space-y-8">
          {(whatsIncluded?.heading || whatsIncluded?.content) && (
            <InViewFade>
              <div className="rounded-2xl border border-border/60 bg-card p-8 md:p-12">
                {whatsIncluded.heading && (
                  <h3 className="mb-4 font-(family-name:--font-cormorant) text-2xl font-medium text-foreground md:text-3xl">
                    {whatsIncluded.heading}
                  </h3>
                )}

                {whatsIncluded.content && (
                  <RichText
                    className="mt-4 text-muted-foreground leading-relaxed"
                    data={whatsIncluded.content}
                    enableGutter={false}
                    listVariant="offering"
                  />
                )}
              </div>
            </InViewFade>
          )}

          {(investment?.title || investment?.subtitle || selectedInvestments.length > 0) && (
            <div className="pt-4">
              <InViewFade>
                <div>
                  {investment?.title && (
                    <h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">
                      {investment.title}
                    </h3>
                  )}

                  {investment?.subtitle && (
                    <p className="mb-8 text-muted-foreground">{investment.subtitle}</p>
                  )}
                </div>
              </InViewFade>

              {selectedInvestments.length > 0 && (
                <StaggerInViewList
                  className={`mt-6 grid gap-4 ${investmentGridCols}`}
                  staggerChildren={0.08}
                >
                  {selectedInvestments.map((option, index) => (
                    <StaggerListItem
                      key={option.id ?? index}
                      className="rounded-xl border border-border/60 bg-card p-5 list-none"
                    >
                      {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between md:flex-col md:items-start md:justify-start xl:flex-row xl:items-baseline xl:justify-between">
                        <h4 className="font-medium text-foreground">{option.name}</h4>
                        <span className="font-(family-name:--font-cormorant) text-2xl font-light text-primary">
                          {renderPriceLabel(option)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{option.description}</p> */}
                      <div
                        className={`flex ${selectedInvestments.length > 3 ? 'flex-col' : 'flex-row'} items-baseline justify-between`}
                      >
                        <h4 className="font-medium text-foreground">{option.name}</h4>
                        <span className="font-(family-name:--font-cormorant) text-2xl font-light text-primary">
                          {renderPriceLabel(option)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                    </StaggerListItem>
                  ))}
                </StaggerInViewList>
              )}
            </div>
          )}
        </div>
      </div>
    </SectionBackground>
  )
}

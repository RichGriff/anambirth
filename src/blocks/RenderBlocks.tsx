import React, { Fragment } from 'react'

import {
  Page,
  Section as SectionProps,
  Column as ColumnProps,
  TextBlock as TextProps,
  EyebrowHeading as EyebrowHeadingProps,
  Investment as InvestmentProps,
  Footnotes as FootnotesProps,
  InvitationList as InvitationListProps,
  IncludedItems as IncludedItemsProps,
  Faq as FAQProps,
  FormBlock as FormBlockProps,
  Image as ImgProps,
  ValuesList as ValuesListProps,
  CallToAction as CallToActionProps,
  OfferingSummary as OfferingSummaryProps,
  Offering as OfferingProps,
  TestimonialBlock as TestimonialsBlockProps,
  Philosophy as PhilosophyProps,
  FeaturedQuote as FeaturedQuoteProps,
  Accreditation as AccreditationProps,
} from '@/payload-types'

import { Section } from '@/blocks/Section/Component'
import { Text } from '@/blocks/Text/Component'
import { Column } from '@/blocks/Column/Component'
import { EyebrowHeading } from '@/blocks/EyebrowHeading/Component'
import { Investment } from '@/blocks/Investment/Component'
import { Footnotes } from '@/blocks/Footnotes/Component'
import { InvitationList } from '@/blocks/InvitationList/Component'
import { IncludedItems } from '@/blocks/IncludedItems/Component'
import { FAQ } from '@/blocks/FAQ/Component'
import { FormBlock as FormBlockComponent } from '@/blocks/Form/Component'
import { Img } from '@/blocks/Image/Component'
import { ValuesList } from '@/blocks/ValuesList/Component'
import { OfferingSummary } from './OfferingSummary/Component'
import { TestimonialsBlock } from './TestimonialsBlock/Component'
import { Philosophy } from '@/blocks/Philosophy/Component'
import { CallToAction } from '@/blocks/CallToAction/Component'
import { LatestPost } from '@/blocks/LatestPost/Component'
import { FeaturedQuote } from './FeaturedQuote/Component'
import { Accreditation } from './Accreditation/Component'
import { Offering } from './Offering/Component'

const blockComponents = {
  section: Section,
  column: Column,
  textBlock: Text,
  eyebrowHeading: EyebrowHeading,
  investment: Investment,
  footnotes: Footnotes,
  invitationList: InvitationList,
  includedItems: IncludedItems,
  faq: FAQ,
  formBlock: FormBlockComponent,
  image: Img,
  valuesList: ValuesList,
  cta: CallToAction,
  offeringSummary: OfferingSummary,
  offering: Offering,
  testimonialBlock: TestimonialsBlock,
  philosophy: Philosophy,
  latestPost: LatestPost,
  featuredQuote: FeaturedQuote,
  accreditation: Accreditation,
}

const isBlockComponentKey = (key: unknown): key is keyof typeof blockComponents =>
  typeof key === 'string' && key in blockComponents

type SectionColumns = SectionProps extends { columns?: infer T }
  ? T
  : SectionProps extends { column?: infer U }
    ? U
    : never

export const RenderBlocks: React.FC<{
  blocks: any
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (isBlockComponentKey(blockType)) {
            const Block = blockComponents[blockType]

            if (Block) {
              const BlockComponent = Block as React.ComponentType<any>
              return (
                <div key={index}>
                  <BlockComponent {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

import { existsSync } from 'fs'
import { resolve } from 'path'

import dotenv from 'dotenv'
import { getPayload } from 'payload'

type RelationshipValue = number

type LegacyInvestmentGroup = {
  title?: string | null
  subtitle?: string | null
  items?: RelationshipValue[] | null
} | null

type LegacyFootnote = {
  text?: string | null
}

type LegacyOfferingBlock = {
  blockType: 'offering'
  blockName?: string | null
  id?: string | null
  offering?: RelationshipValue | null
  eyebrowHeading?: string | null
  mainHeading?: string | null
  anchorId?: string | null
  subHeading?: string | null
  details?: unknown
  whatsIncluded?: {
    heading?: string | null
    content?: unknown
  } | null
  investment?: LegacyInvestmentGroup
  footnotes?: LegacyFootnote[] | null
  bg?: 'bg-light' | 'bg-lighter' | 'bg-dark' | 'bg-white'
}

type LegacySummaryItem = {
  id?: string | null
  offering?: RelationshipValue | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
  priceFrom?: number | null
  sectionAnchor?: string | null
  links?: unknown
}

type LegacyOfferingSummaryBlock = {
  blockType: 'offeringSummary'
  items?: LegacySummaryItem[] | null
}

type PageDoc = {
  id: number | string
  title?: string | null
  slug?: string | null
  _status?: 'draft' | 'published'
  content?: Array<LegacyOfferingBlock | LegacyOfferingSummaryBlock | Record<string, unknown>> | null
}

const isWriteMode = process.argv.includes('--write')

const loadEnv = () => {
  const envPath = resolve(process.cwd(), '.env')
  const localEnvPath = resolve(process.cwd(), '.env.local')

  if (existsSync(envPath)) {
    dotenv.config({ path: envPath })
  }

  if (existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath, override: true })
  }
}

const createParagraphRichText = (text: string): any => ({
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
      },
    ],
  },
})

const asKey = (...parts: Array<string | null | undefined>) =>
  parts
    .map((part) => part?.trim().toLowerCase())
    .filter(Boolean)
    .join('::')

const main = async () => {
  loadEnv()

  const { default: configPromise } = await import('@payload-config')
  const payload = await getPayload({ config: configPromise })
  try {
    const pagesResult = await payload.find({
      collection: 'pages',
      depth: 0,
      draft: true,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    })

    const pages = pagesResult.docs as PageDoc[]
    const createdOfferings = new Map<string, number | string>()
    const createdInvestments = new Map<string, number | string>()

    const ensureInvestment = async (title: string, priceFrom?: number | null) => {
      if (typeof priceFrom !== 'number') {
        return []
      }

      const key = asKey(title, String(priceFrom))
      const existing = createdInvestments.get(key)

      if (existing) {
        return [existing]
      }

      if (!isWriteMode) {
        return []
      }

      const investment = await payload.create({
        collection: 'investments',
        data: {
          name: `${title} investment`,
          description: 'Auto-migrated from a legacy offering summary card.',
          paymentOption: 'oneOff',
          oneOffCost: priceFrom,
        },
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
      })

      createdInvestments.set(key, investment.id)

      return [investment.id]
    }

    const ensureOfferingFromLegacyBlock = async (block: LegacyOfferingBlock) => {
      if (block.offering) {
        return block.offering
      }

      if (!block.mainHeading) {
        return null
      }

      const key = asKey(block.mainHeading, block.anchorId)
      const existing = createdOfferings.get(key)

      if (existing) {
        return existing
      }

      if (!isWriteMode) {
        return key
      }

      const created = await payload.create({
        collection: 'offerings',
        data: {
          eyebrowHeading: block.eyebrowHeading,
          mainHeading: block.mainHeading,
          anchorId: block.anchorId,
          subHeading: block.subHeading,
          details:
            block.details ||
            createParagraphRichText(block.subHeading || block.mainHeading || 'Auto-migrated offering.'),
          whatsIncluded: block.whatsIncluded || undefined,
          investment: block.investment || undefined,
          footnotes:
            block.footnotes?.filter((footnote): footnote is { text: string } => Boolean(footnote?.text)) ||
            undefined,
        } as any,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
      })

      createdOfferings.set(key, created.id)

      return created.id
    }

    const ensureOfferingFromSummaryItem = async (item: LegacySummaryItem) => {
      if (item.offering) {
        return item.offering
      }

      const key = asKey(item.title, item.sectionAnchor)
      const existing = createdOfferings.get(key)

      if (existing) {
        return existing
      }

      if (!item.title) {
        return null
      }

      if (!isWriteMode) {
        return key
      }

      const investmentIDs = await ensureInvestment(item.title, item.priceFrom)

      const created = await payload.create({
        collection: 'offerings',
        data: {
          eyebrowHeading: item.subtitle,
          mainHeading: item.title,
          anchorId: item.sectionAnchor,
          subHeading: item.description,
          details: createParagraphRichText(item.description || item.title),
          investment:
            investmentIDs.length > 0
              ? {
                  title: 'Investment',
                  items: investmentIDs,
                }
              : undefined,
        } as any,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
      })

      createdOfferings.set(key, created.id)

      return created.id
    }

    let updatedPages = 0

    for (const page of pages) {
      const content = page.content || []
      let pageChanged = false

      const nextContent = await Promise.all(
        content.map(async (block) => {
          if (block.blockType === 'offering') {
            const offeringID = await ensureOfferingFromLegacyBlock(block as LegacyOfferingBlock)

            if (!offeringID || block.offering === offeringID) {
              return block
            }

            pageChanged = true

            return {
              ...block,
              offering: offeringID,
            }
          }

          if (block.blockType === 'offeringSummary') {
            const legacyBlock = block as LegacyOfferingSummaryBlock
            const nextItems = await Promise.all(
              (legacyBlock.items || []).map(async (item) => {
                const offeringID = await ensureOfferingFromSummaryItem(item)

                if (!offeringID || item.offering === offeringID) {
                  return item
                }

                pageChanged = true

                return {
                  ...item,
                  offering: offeringID,
                }
              }),
            )

            if (!pageChanged) {
              return block
            }

            return {
              ...block,
              items: nextItems,
            }
          }

          return block
        }),
      )

      if (!pageChanged) {
        continue
      }

      updatedPages += 1

      if (!isWriteMode) {
        payload.logger.info(`Dry run: would migrate page ${page.slug || page.id}`)
        continue
      }

      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          content: nextContent,
          _status: page._status,
        } as any,
        draft: true,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
      })

      payload.logger.info(`Migrated page ${page.slug || page.id}`)
    }

    payload.logger.info(
      `${isWriteMode ? 'Migrated' : 'Checked'} ${pages.length} pages, ${updatedPages} page(s) ${
        isWriteMode ? 'updated' : 'would be updated'
      }.`,
    )
  } finally {
    await payload.destroy()
  }
}

void main()

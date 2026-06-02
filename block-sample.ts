/**
 * Payload CMS Block Schemas
 * Ananya Birth — Offerings Page
 *
 * Architecture:
 *   Page -> layout[] -> ColumnsBlock -> columns[] -> Column -> blocks[] -> Content Blocks
 */

import type { Block, Field } from 'payload'

// ─────────────────────────────────────────────
// SHARED FIELDS
// ─────────────────────────────────────────────

const linkField: Field = {
  name: 'link',
  type: 'group',
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        { label: 'Internal Page', value: 'internal' },
        { label: 'External URL', value: 'external' },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'internal',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'external',
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
      defaultValue: false,
    },
  ],
}

// ─────────────────────────────────────────────
// CONTENT BLOCKS
// ─────────────────────────────────────────────

/**
 * EyebrowHeadingBlock
 * Eyebrow label + main heading + optional subtitle
 * e.g. "First Offering / Doula Holding / A place to rest your story"
 */
export const EyebrowHeadingBlock: Block = {
  slug: 'eyebrowHeading',
  labels: { singular: 'Eyebrow Heading', plural: 'Eyebrow Headings' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Label',
      admin: { description: 'Small uppercase label above the heading e.g. "First Offering"' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'headingLevel',
      type: 'select',
      defaultValue: 'h2',
      options: ['h1', 'h2', 'h3', 'h4'],
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle / Tagline',
      admin: { description: 'Italic line below the heading' },
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: ['left', 'center', 'right'],
    },
  ],
}

/**
 * RichTextBlock
 * Multi-paragraph prose content
 */
export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}

/**
 * PullQuoteBlock
 * Styled blockquote with optional attribution
 * e.g. "This is about the deep exhale..."
 */
export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: { singular: 'Pull Quote', plural: 'Pull Quotes' },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
      label: 'Attribution (optional)',
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
  ],
}

/**
 * BulletListBlock
 * Heading + array of bullet items
 * e.g. "The doula holding space is an invitation to you if:"
 */
export const BulletListBlock: Block = {
  slug: 'bulletList',
  labels: { singular: 'Bullet List', plural: 'Bullet Lists' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'List Heading',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '1',
      label: 'Display columns',
      admin: { description: 'Split list items into columns' },
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
    },
  ],
}

/**
 * FeatureListBlock
 * Icon + text pairs for "Each companioning option includes:"
 */
export const FeatureListBlock: Block = {
  slug: 'featureList',
  labels: { singular: 'Feature List', plural: 'Feature Lists' },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Phone / Call', value: 'phone' },
            { label: 'Heart', value: 'heart' },
            { label: 'Message', value: 'message' },
            { label: 'Checkmark', value: 'check' },
            { label: 'Star', value: 'star' },
          ],
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
      ],
    },
  ],
}

/**
 * PricingCardBlock
 * Single pricing option — label, price, description
 * e.g. "Standalone Call — £65 — 1 × 1 hour session held on Zoom"
 */
export const PricingCardBlock: Block = {
  slug: 'pricingCard',
  labels: { singular: 'Pricing Card', plural: 'Pricing Cards' },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Option Name',
      admin: { description: 'e.g. "Standalone Call" or "Series of Three"' },
    },
    {
      name: 'price',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "£65" or "£150"' },
    },
    {
      name: 'billingCycle',
      type: 'text',
      label: 'Billing Cycle (optional)',
      admin: { description: 'e.g. "/ month" — leave blank for one-off payments' },
    },
    {
      name: 'savingsNote',
      type: 'text',
      label: 'Savings Note (optional)',
      admin: { description: 'e.g. "save £50/mo"' },
    },
    {
      name: 'description',
      type: 'text',
      admin: { description: 'e.g. "3 × 1 hour sessions held on Zoom"' },
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      label: 'Highlight this option',
      defaultValue: false,
      admin: { description: 'Visually emphasise this as recommended' },
    },
  ],
}

/**
 * FootnotesBlock
 * Small tick/check-mark notes below pricing
 * e.g. "Will offer you the space to be deeply witnessed."
 */
export const FootnotesBlock: Block = {
  slug: 'footnotes',
  labels: { singular: 'Footnotes', plural: 'Footnotes' },
  fields: [
    {
      name: 'notes',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

/**
 * CTABlock
 * Call-to-action section — heading, body, tagline, button
 * e.g. "Free Connection Call"
 */
export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Label',
      admin: { description: 'e.g. "Let\'s Connect"' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Italic tagline (no-pressure line)',
      admin: { description: 'e.g. "No pressure — just a conversation"' },
    },
    {
      name: 'button',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: ['primary', 'secondary', 'outline'],
        },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: ['left', 'center'],
    },
  ],
}

/**
 * FAQBlock
 * Accordion-style Q&A section
 */
export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Common Questions',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
}

/**
 * DividerBlock
 * Visual spacer / section separator
 */
export const DividerBlock: Block = {
  slug: 'divider',
  labels: { singular: 'Divider', plural: 'Dividers' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'line',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Spacer only (no line)', value: 'spacer' },
        { label: 'Decorative', value: 'decorative' },
      ],
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
    },
  ],
}

// ─────────────────────────────────────────────
// ALL CONTENT BLOCKS (used inside Column.blocks)
// ─────────────────────────────────────────────

export const contentBlocks: Block[] = [
  EyebrowHeadingBlock,
  RichTextBlock,
  PullQuoteBlock,
  BulletListBlock,
  FeatureListBlock,
  PricingCardBlock,
  FootnotesBlock,
  CTABlock,
  FAQBlock,
  DividerBlock,
]

// ─────────────────────────────────────────────
// COLUMNS BLOCK
// ─────────────────────────────────────────────

/**
 * ColumnsBlock
 * Layout primitive — defines a row of columns.
 * Each column holds any number of content blocks.
 */
export const ColumnsBlock: Block = {
  slug: 'columns',
  labels: { singular: 'Columns', plural: 'Columns' },
  fields: [
    // ── Row-level settings ──
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'md',
      label: 'Column Gap',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    {
      name: 'stackOnMobile',
      type: 'checkbox',
      defaultValue: true,
      label: 'Stack columns on mobile',
    },

    // ── Columns array ──
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        // ── Width ──
        {
          name: 'width',
          type: 'select',
          required: true,
          defaultValue: 'full',
          options: [
            { label: 'Full (12/12)', value: 'full' },
            { label: 'Half (6/12)', value: '1/2' },
            { label: 'One Third (4/12)', value: '1/3' },
            { label: 'Two Thirds (8/12)', value: '2/3' },
            { label: 'One Quarter (3/12)', value: '1/4' },
            { label: 'Three Quarters (9/12)', value: '3/4' },
          ],
        },

        // ── Vertical alignment ──
        {
          name: 'verticalAlign',
          type: 'select',
          defaultValue: 'top',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
        },

        // ── Card appearance ──
        {
          name: 'showAsCard',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show as card',
          admin: {
            description: 'Wraps the column content in a card with background, border and radius',
          },
        },
        {
          name: 'cardPadding',
          type: 'select',
          defaultValue: 'md',
          label: 'Card padding',
          admin: {
            condition: (_, siblingData) => siblingData.showAsCard === true,
          },
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        {
          name: 'cardBackground',
          type: 'select',
          defaultValue: 'default',
          label: 'Card background',
          admin: {
            condition: (_, siblingData) => siblingData.showAsCard === true,
          },
          options: [
            { label: 'Default (white)', value: 'default' },
            { label: 'Muted', value: 'muted' },
            { label: 'Dark', value: 'dark' },
          ],
        },
        {
          name: 'cardBorder',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show border',
          admin: {
            condition: (_, siblingData) => siblingData.showAsCard === true,
          },
        },

        // ── Content blocks ──
        {
          name: 'blocks',
          type: 'blocks',
          blocks: contentBlocks,
          admin: {
            description: 'Add content blocks to this column',
          },
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────
// PAGE LAYOUT FIELD
// ─────────────────────────────────────────────

/**
 * Use this as the `layout` field on your Pages collection.
 * ColumnsBlock is the only top-level block — all content
 * lives inside columns within it.
 */
export const layoutField: Field = {
  name: 'layout',
  type: 'blocks',
  blocks: [ColumnsBlock],
  admin: {
    description: 'Build the page by adding column rows. Each row can contain 1–4 columns.',
  },
}

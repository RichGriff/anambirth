'use client'

import type { OfferingSummary } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<OfferingSummary['items']>[number]>()

  if (data?.data?.title) {
    return <div>{data.data.title}</div>
  }

  const itemNumber = data?.rowNumber !== undefined ? data.rowNumber + 1 : ''
  return <div>{`Item ${itemNumber}`}</div>
}

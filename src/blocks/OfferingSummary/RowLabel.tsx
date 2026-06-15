'use client'

import type { OfferingSummary } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<OfferingSummary['items']>[number]>()

  if (data?.data?.offering && typeof data.data.offering === 'object' && 'mainHeading' in data.data.offering) {
    return <div>{data.data.offering.mainHeading}</div>
  }

  const itemNumber = data?.rowNumber !== undefined ? data.rowNumber + 1 : ''
  return <div>{`Item ${itemNumber}`}</div>
}

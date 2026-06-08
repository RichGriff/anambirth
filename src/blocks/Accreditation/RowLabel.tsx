'use client'

import type { Accreditation } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Accreditation['items']>[number]>()

  if (data?.data?.name) {
    return <div>{data.data.name}</div>
  }

  const itemNumber = data?.rowNumber !== undefined ? data.rowNumber + 1 : ''
  return <div>{`Item ${itemNumber}`}</div>
}

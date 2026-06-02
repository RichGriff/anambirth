import { cn } from '@/utilities/ui'
import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const resolvedWidth = width ? `${width}%` : '100%'

  return (
    <div
      className={cn('w-full', className)}
      style={{
        flexBasis: resolvedWidth,
        maxWidth: resolvedWidth,
      }}
    >
      {children}
    </div>
  )
}

import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  imagePath?: string
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, imagePath } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Anam Birth Logo"
      width={200}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('block h-auto', className)}
      src={imagePath || '/logo-dark.svg'}
    />
  )
}
